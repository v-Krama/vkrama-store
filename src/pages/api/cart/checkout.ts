import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { customers, products } from '../../../db/schema'
import { eq, inArray } from 'drizzle-orm'
import { generateId, verifyToken } from '../../../lib/auth'
import { CURRENCY } from '../../../lib/constants'
import { sendOrderConfirmationEmail } from '../../../lib/email'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), { status: 500 })
  }
  const db = getDb(env.DB)

  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 })
  }
  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'customer') {
    return new Response(JSON.stringify({ error: 'Invalid or expired session' }), { status: 401 })
  }

  const customer = await db
    .select({ id: customers.id, email: customers.email })
    .from(customers)
    .where(eq(customers.id, payload.userId))
    .get()

  if (!customer) {
    return new Response(JSON.stringify({ error: 'Customer not found' }), { status: 401 })
  }

  try {
    const { items, paymentMethod, email } = await request.json()
    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), { status: 400 })
    }

    const status = 'pending'

    const slugs = items.map((i: any) => i.slug)
    const productRows = await db
      .select()
      .from(products)
      .where(inArray(products.slug, slugs))
      .all()

    const productMap = new Map(productRows.map((p) => [p.slug, p]))

    let subtotalCents = 0
    const lineItems: Array<{
      name: string; quantity: number; priceCents: number; imageUrl?: string;
      slug: string; productId: string; variantId?: string; variantName?: string
    }> = []

    for (const item of items) {
      const p = productMap.get(item.slug)
      if (!p || p.status !== 'active') {
        return new Response(JSON.stringify({ error: `Product not found: ${item.slug}` }), { status: 400 })
      }
      if (p.stock < item.quantity) {
        return new Response(JSON.stringify({ error: `Insufficient stock: ${p.name}` }), { status: 400 })
      }
      lineItems.push({
        name: item.variantName ? `${p.name} (${item.variantName})` : p.name,
        quantity: item.quantity,
        priceCents: p.priceCents,
        imageUrl: p.imageUrl || undefined,
        slug: item.slug,
        productId: p.id,
        variantId: item.variantId,
        variantName: item.variantName,
      })
      subtotalCents += p.priceCents * item.quantity
    }

    const orderId = generateId('ord')
    const shippingCents = 0
    const taxCents = 0
    const totalCents = subtotalCents + shippingCents + taxCents

    const body = await request.json()
    const { shippingInfo } = body

    await env.DB.prepare(
      `INSERT INTO orders (id, customer_id, email, phone, status, subtotal_cents, shipping_cents, tax_cents, total_cents, currency, payment_method, shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      orderId,
      customer.id,
      customer.email,
      email || null,
      status,
      subtotalCents, shippingCents, taxCents, totalCents,
      CURRENCY, paymentMethod || 'qr',
      shippingInfo?.name || null, shippingInfo?.phone || null,
      shippingInfo?.line1 || null, shippingInfo?.line2 || null,
      shippingInfo?.city || null, shippingInfo?.state || null,
      shippingInfo?.postalCode || null, shippingInfo?.country || 'US'
    ).run()

    for (const item of lineItems) {
      await env.DB.prepare(
        'INSERT INTO order_items (id, order_id, product_id, variant_id, name, variant_name, quantity, price_cents, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(generateId('oi'), orderId, item.productId, item.variantId || null, item.name, item.variantName || null, item.quantity, item.priceCents, item.imageUrl || null).run()

      await env.DB.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').bind(item.quantity, item.productId).run()
    }

    if (customer.email) {
      sendOrderConfirmationEmail({ email: customer.email, orderId, totalCents }).catch(() => {})
    }

    return new Response(JSON.stringify({ orderId, totalCents, paymentMethod: paymentMethod || 'qr' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Checkout error:', err)
    return new Response(JSON.stringify({ error: 'Checkout failed. Please try again.' }), { status: 400 })
  }
}
