import type { APIRoute } from "astro"
import { getDb } from "../../../lib/db"
import { customers, products, productVariants, orders } from "../../../db/schema"
import { eq, inArray } from "drizzle-orm"
import { generateId, getAuthUser } from "../../../lib/auth"
import { CURRENCY, CURRENCY_SYMBOL, SHIPPING_COST_CENTS, TAX_RATE } from "../../../lib/constants"
import { jsonError, jsonOk } from "../../../lib/validation"

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Database not configured")

  const customer = await getAuthUser(request, env.DB, "customer")
  if (!customer) return jsonError(401, "Authentication required")

  const db = getDb(env.DB)

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, "Invalid request body")

    const { items, paymentMethod, phone, shippingInfo, billingInfo, couponCode, notes, isGift, giftNote } = body as any

    if (!items || !Array.isArray(items) || items.length === 0) {
      return jsonError(400, "Cart is empty")
    }
    if (items.length > 50) return jsonError(400, "Too many items in cart")

    const variantIds = items.map((i: any) => String(i.variantId || i.slug).slice(0, 200))
    const variantRows = await db
      .select({
        id: productVariants.id,
        productId: productVariants.productId,
        name: productVariants.name,
        priceCents: productVariants.priceCents,
        compareAtPriceCents: productVariants.compareAtPriceCents,
        stock: productVariants.stock,
        imageUrl: productVariants.imageUrl,
        sku: productVariants.sku,
        productName: products.name,
        productSlug: products.slug,
        productStatus: products.status,
      })
      .from(productVariants)
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(inArray(productVariants.id, variantIds))
      .all()

    const variantMap = new Map(variantRows.map((v) => [v.id, v]))

    let subtotalCents = 0
    const lineItems: Array<{
      orderItemId: string
      productId: string
      variantId: string
      name: string
      variantName: string | null
      sku: string | null
      quantity: number
      priceCents: number
      taxCents: number
      discountCents: number
      weight: number | null
      imageUrl: string | null
    }> = []

    for (const item of items) {
      const qty = Math.min(Math.max(1, Number(item.quantity) || 1), 100)
      const v = variantMap.get(item.variantId)

      if (!v || v.productStatus !== "active") {
        return jsonError(400, `Product not available: ${item.variantId}`)
      }
      if (v.stock < qty) {
        return jsonError(400, `Insufficient stock for ${v.productName} (${v.name})`)
      }

      const taxCents = Math.round(v.priceCents * TAX_RATE)

      lineItems.push({
        orderItemId: generateId("oi"),
        productId: v.productId,
        variantId: v.id,
        name: v.productName,
        variantName: v.name,
        sku: v.sku,
        quantity: qty,
        priceCents: v.priceCents,
        taxCents,
        discountCents: 0,
        weight: null,
        imageUrl: v.imageUrl,
      })
      subtotalCents += v.priceCents * qty
    }

    const orderId = generateId("ord")
    const orderNumber = "VK-" + Date.now().toString(36).toUpperCase() + "-" + orderId.slice(-4).toUpperCase()
    const shippingCents = SHIPPING_COST_CENTS
    const taxCents = lineItems.reduce((s, i) => s + i.taxCents * i.quantity, 0)
    const discountCents = 0
    const totalCents = subtotalCents + shippingCents + taxCents - discountCents

    const orderInsert = env.DB.prepare(
      `INSERT INTO orders (id, order_number, customer_id, email, phone, status, subtotal_cents, shipping_cents, tax_cents, discount_cents, total_cents, currency, payment_method, payment_status, shipping_cost_cents, coupon_code, gift_note, notes, ip_address, user_agent, shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, billing_name, billing_phone, billing_line1, billing_line2, billing_city, billing_state, billing_postal_code, billing_country, is_gift)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      orderId,
      orderNumber,
      customer.id,
      customer.email,
      phone || null,
      "pending",
      subtotalCents,
      shippingCents,
      taxCents,
      discountCents,
      totalCents,
      CURRENCY,
      paymentMethod || "qr",
      paymentMethod === "cash" ? "pending" : "pending",
      shippingCents,
      couponCode || null,
      giftNote || null,
      notes || null,
      request.headers.get("CF-Connecting-IP") || null,
      request.headers.get("User-Agent") || null,
      shippingInfo?.name || null,
      shippingInfo?.phone || null,
      shippingInfo?.line1 || null,
      shippingInfo?.line2 || null,
      shippingInfo?.city || null,
      shippingInfo?.state || null,
      shippingInfo?.postalCode || null,
      shippingInfo?.country || "NP",
      billingInfo?.name || shippingInfo?.name || null,
      billingInfo?.phone || shippingInfo?.phone || null,
      billingInfo?.line1 || shippingInfo?.line1 || null,
      billingInfo?.line2 || shippingInfo?.line2 || null,
      billingInfo?.city || shippingInfo?.city || null,
      billingInfo?.state || shippingInfo?.state || null,
      billingInfo?.postalCode || shippingInfo?.postalCode || null,
      billingInfo?.country || shippingInfo?.country || "NP",
      isGift ? 1 : 0,
    )

    const itemStatements = lineItems.map((item) =>
      env.DB.prepare(
        "INSERT INTO order_items (id, order_id, product_id, variant_id, name, variant_name, sku, quantity, price_cents, tax_cents, discount_cents, image_url, is_gift) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ).bind(
        item.orderItemId,
        orderId,
        item.productId,
        item.variantId,
        item.name,
        item.variantName,
        item.sku,
        item.quantity,
        item.priceCents,
        item.taxCents,
        item.discountCents,
        item.imageUrl,
        isGift ? 1 : 0,
      ),
    )

    const stockStatements = lineItems.map((item) =>
      env.DB.prepare("UPDATE product_variants SET stock = stock - ? WHERE id = ? AND stock >= ?").bind(
        item.quantity,
        item.variantId,
        item.quantity,
      ),
    )

    const statusStatement = env.DB.prepare(
      "INSERT INTO order_status_history (order_id, from_status, to_status, created_by) VALUES (?, NULL, ?, ?)",
    ).bind(orderId, "pending", customer.id)

    const batchOps = [orderInsert, statusStatement, ...itemStatements, ...stockStatements]
    const batchResults = await env.DB.batch(batchOps)

    const stockFailures = batchResults.filter(
      (r, i) => i >= 2 + itemStatements.length && r.meta?.changes === 0,
    )
    if (stockFailures.length > 0) {
      await env.DB.batch(
        lineItems.map((item) =>
          env.DB.prepare("UPDATE product_variants SET stock = stock + ? WHERE id = ?").bind(
            item.quantity,
            item.variantId,
          ),
        ),
      )
      return jsonError(409, "Stock changed, please review your cart")
    }

    // Queue async processing
    await env.ORDER_QUEUE.send({
      type: "validate",
      orderId,
    }).catch(() => {})

    await env.ORDER_QUEUE.send({
      type: "send_confirmation",
      orderId,
    }).catch(() => {})

    return jsonOk({
      orderId,
      orderNumber,
      totalCents,
      paymentMethod: paymentMethod || "qr",
    })
  } catch (err) {
    console.error("Checkout error:", err)
    return jsonError(500, "Checkout failed. Please try again.")
  }
}
