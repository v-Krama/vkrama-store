import type { APIRoute } from "astro"
import { getDb } from "../../../lib/db"
import { customers, products, productVariants, orders, coupons } from "../../../db/schema"
import { eq, inArray } from "drizzle-orm"
import { generateId, getAuthUser } from "../../../lib/auth"
import { CURRENCY, CURRENCY_SYMBOL, SHIPPING_COST_CENTS, FREE_SHIPPING_MINIMUM_CENTS, TAX_RATE } from "../../../lib/constants"
import { jsonError, jsonOk } from "../../../lib/validation"
import { rateLimitMiddleware } from "../../../lib/rate-limit"

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Database not configured")

  const rl = await rateLimitMiddleware(request, env, { maxRequests: 10, windowMs: 60_000 })
  if (rl) return rl

  const customer = await getAuthUser(request, env.DB, "customer")
  if (!customer) return jsonError(401, "Authentication required")

  const custRow = await env.DB.prepare('SELECT is_verified FROM customers WHERE id = ?').bind(customer.id).first() as any
  if (custRow && !custRow.is_verified) return jsonError(403, "Please verify your email before placing an order")

  const db = getDb(env.DB)

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, "Invalid request body")

    const { items, paymentMethod, phone, shippingInfo, billingInfo, couponCode, notes, isGift, giftNote } = body as any

    if (!items || !Array.isArray(items) || items.length === 0) {
      return jsonError(400, "Cart is empty")
    }
    if (items.length > 50) return jsonError(400, "Too many items in cart")

    const vidItems = items.filter((i: any) => i.variantId)
    const slugItems = items.filter((i: any) => !i.variantId)

    let variantRows: any[] = []

    if (vidItems.length > 0) {
      const ids = vidItems.map((i: any) => String(i.variantId).slice(0, 200))
      variantRows = await db
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
        .where(inArray(productVariants.id, ids))
        .all()
    }

    if (slugItems.length > 0) {
      const slugs = slugItems.map((i: any) => String(i.slug).slice(0, 200))
      const rows = await db
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
        .where(inArray(products.slug, slugs))
        .all()

      const firstBySlug = new Map<string, any>()
      for (const row of rows) {
        if (!firstBySlug.has(row.productSlug)) {
          firstBySlug.set(row.productSlug, row)
        }
      }
      variantRows.push(...Array.from(firstBySlug.values()))
    }

    const variantMap = new Map(variantRows.map((v: any) => [v.id, v]))
    const slugMap = new Map(variantRows.map((v: any) => [v.productSlug, v]))

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
      const v = variantMap.get(item.variantId) || slugMap.get(item.slug)

      if (!v || v.productStatus !== "active") {
        return jsonError(400, `Product not available: ${item.variantId || item.slug}`)
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
    const orderNumber = "VK-" + Date.now().toString(36).toUpperCase() + "-" + orderId.slice(-4).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase()
    const shippingCents = subtotalCents >= FREE_SHIPPING_MINIMUM_CENTS ? 0 : SHIPPING_COST_CENTS
    const taxCents = lineItems.reduce((s, i) => s + i.taxCents * i.quantity, 0)

    let discountCents = 0
    let appliedCouponId = null
    if (couponCode) {
      const now = new Date().toISOString()
      const coupon = await db.select().from(coupons).where(eq(coupons.code, couponCode.toUpperCase().trim())).get()
      if (coupon && coupon.isActive && (!coupon.startsAt || coupon.startsAt <= now) && (!coupon.endsAt || coupon.endsAt >= now)) {
        if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
          if (!coupon.minOrderCents || subtotalCents >= coupon.minOrderCents) {
            if (coupon.type === 'percent' && coupon.valuePercent) {
              discountCents = Math.round(subtotalCents * (coupon.valuePercent / 100))
            } else if (coupon.type === 'fixed' && coupon.valueCents) {
              discountCents = coupon.valueCents
            }
            if (coupon.maxDiscountCents && discountCents > coupon.maxDiscountCents) {
              discountCents = coupon.maxDiscountCents
            }
            discountCents = Math.min(discountCents, subtotalCents)
            appliedCouponId = coupon.id
          }
        }
      }
    }

    const totalCents = Math.max(0, subtotalCents + shippingCents + taxCents - discountCents)

    const pm = paymentMethod || "qr"
    const isCod = pm === "cash" || pm === "cod"
    const orderStatus = isCod ? "pending" : "awaiting_payment"

    const orderInsert = env.DB.prepare(
      `INSERT INTO orders (id, order_number, customer_id, email, phone, status, subtotal_cents, shipping_cents, tax_cents, discount_cents, total_cents, currency, payment_method, payment_status, shipping_cost_cents, coupon_code, gift_note, notes, ip_address, user_agent, shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, billing_name, billing_phone, billing_line1, billing_line2, billing_city, billing_state, billing_postal_code, billing_country, is_gift)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      orderId,
      orderNumber,
      customer.id,
      customer.email,
      phone || null,
      orderStatus,
      subtotalCents,
      shippingCents,
      taxCents,
      discountCents,
      totalCents,
      CURRENCY,
      pm,
      isCod ? "pending" : "pending",
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

    const statusStatement = env.DB.prepare(
      "INSERT INTO order_status_history (order_id, from_status, to_status, created_by) VALUES (?, NULL, ?, ?)",
    ).bind(orderId, orderStatus, customer.id)

    const batchOps: any[] = [orderInsert, statusStatement, ...itemStatements]

    if (appliedCouponId) {
      batchOps.push(
        env.DB.prepare("UPDATE coupons SET used_count = used_count + 1 WHERE id = ?").bind(appliedCouponId)
      )
      batchOps.push(
        env.DB.prepare("INSERT INTO coupon_usages (id, coupon_id, order_id, customer_id, discount_cents) VALUES (?, ?, ?, ?, ?)").bind(
          generateId('coup'), appliedCouponId, orderId, customer.id, discountCents
        )
      )
    }

    // For COD: deduct stock immediately. For QR: payment must be confirmed first.
    if (isCod) {
      for (const item of lineItems) {
        batchOps.push(
          env.DB.prepare("UPDATE product_variants SET stock = stock - ? WHERE id = ? AND stock >= ?").bind(
            item.quantity,
            item.variantId,
            item.quantity,
          ),
        )
      }
    }

    const batchResults = await env.DB.batch(batchOps)

    if (isCod) {
      const stockStartIdx = 2 + itemStatements.length + (appliedCouponId ? 2 : 0)
      const failedItems = lineItems.filter((_, i) => {
        const result = batchResults[stockStartIdx + i]
        return !result || result.meta?.changes === 0
      })
      if (failedItems.length > 0) {
        const succeededItems = lineItems.filter((_, i) => {
          const result = batchResults[stockStartIdx + i]
          return result && result.meta?.changes > 0
        })
        if (succeededItems.length > 0) {
          await env.DB.batch(
            succeededItems.map((item) =>
              env.DB.prepare("UPDATE product_variants SET stock = stock + ? WHERE id = ?").bind(
                item.quantity,
                item.variantId,
              ),
            ),
          )
        }
        return jsonError(409, "Stock changed, please review your cart")
      }
    }

    // Queue async processing
    await env.ORDER_QUEUE.send({
      type: "validate",
      orderId,
    }).catch((err) => { console.error("Order validate queue failed:", err) })

    await env.ORDER_QUEUE.send({
      type: "send_confirmation",
      orderId,
    }).catch((err) => { console.error("Order confirmation queue failed:", err) })

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
