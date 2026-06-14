import type { APIRoute } from 'astro'
import { getAuthUser } from '../../../../lib/auth'
import { jsonError } from '../../../../lib/validation'
import { sendShippingUpdateEmail } from '../../../../lib/email'

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['paid', 'cancelled'],
  awaiting_payment: ['paid', 'cancelled'],
  paid: ['processing', 'cancelled', 'refunded'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}

const ORDER_STATUSES = ['pending', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const

export const GET: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')

  const id = params.id
  if (!id) return jsonError(400, 'Order ID required')

  try {
    const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first()
    if (!order) return jsonError(404, 'Order not found')

    const items = await env.DB.prepare('SELECT * FROM order_items WHERE order_id = ?').bind(id).all()

    return new Response(
      JSON.stringify({ ...(order as any), items: items.results }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Order GET error:', err)
    return jsonError(500, 'Failed to load order')
  }
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')

  const id = params.id
  if (!id) return jsonError(400, 'Order ID required')

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, 'Invalid request body')

    const newStatus = String((body as any).status || '').toLowerCase()
    if (!ORDER_STATUSES.includes(newStatus as any)) {
      return jsonError(400, 'Invalid order status')
    }

    const current = await env.DB.prepare('SELECT status, email FROM orders WHERE id = ?').bind(id).first() as any
    if (!current) return jsonError(404, 'Order not found')

    const allowed = VALID_TRANSITIONS[current.status]
    if (!allowed || !allowed.includes(newStatus)) {
      return jsonError(400, `Cannot transition from ${current.status} to ${newStatus}`)
    }

    await env.DB.prepare(
      "UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?"
    ).bind(newStatus, id).run()

    if (current.email && ['shipped', 'delivered', 'processing'].includes(newStatus)) {
      sendShippingUpdateEmail({ email: current.email, orderId: id, status: newStatus }).catch(() => {})
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return jsonError(400, err.message || 'Failed to update order')
  }
}
