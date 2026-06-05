import type { APIRoute } from 'astro'
import { createPaymentIntent, calculateTax, calculateShipping } from '../../../lib/payment'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }

  try {
    const { items, shippingInfo } = await request.json()
    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), { status: 400 })
    }

    const slugs = items.map((i: any) => i.slug)
    const placeholders = slugs.map(() => '?').join(',')
    const productRows = await env.DB.prepare(
      `SELECT * FROM products WHERE slug IN (${placeholders})`
    ).bind(...slugs).all()

    const productMap = new Map(productRows.results.map((p: any) => [p.slug, p]))

    let subtotalCents = 0
    for (const item of items) {
      const p = productMap.get(item.slug)
      if (!p || p.status !== 'active') {
        return new Response(JSON.stringify({ error: `Product not available: ${item.slug}` }), { status: 400 })
      }
      subtotalCents += p.price_cents * item.quantity
    }

    const shippingCents = shippingInfo ? await calculateShipping(subtotalCents) : 0
    const taxCents = await calculateTax(subtotalCents)
    const totalCents = subtotalCents + shippingCents + taxCents

    const paymentIntent = await createPaymentIntent({
      amountCents: totalCents,
      metadata: {
        items: JSON.stringify(items.map((i: any) => ({ slug: i.slug, quantity: i.quantity, variantId: i.variantId, variantName: i.variantName }))),
      },
    })

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      totalCents,
      subtotalCents,
      shippingCents,
      taxCents,
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Payment setup failed' }), { status: 400 })
  }
}
