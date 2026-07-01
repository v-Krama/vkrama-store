import type { APIRoute } from 'astro'
import { getAuthUser } from '../../../lib/auth'
import { jsonError, jsonOk } from '../../../lib/validation'
import { hasPermission, jsonForbidden } from '../../../lib/admin-auth'
import { logAudit } from '../../../lib/audit'

const VALID_STATUSES = ['pending', 'awaiting_payment', 'payment_requested', 'paid', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded']

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')

  try {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const q = url.searchParams.get('q')
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM orders WHERE 1=1'
    const params: any[] = []

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }
    if (q) {
      query += ' AND (email LIKE ? OR order_number LIKE ?)'
      params.push(`%${q}%`, `%${q}%`)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const result = await env.DB.prepare(query).bind(...params).all()
    return new Response(JSON.stringify(result.results), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Orders GET error:', err)
    return jsonError(500, 'Failed to load orders')
  }
}

export const PATCH: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')
  if (!hasPermission(user.role, 'orders:write')) return jsonForbidden()

  try {
    const body = await request.json().catch(() => null)
    const orderId = (body as any)?.orderId
    const newStatus = (body as any)?.status
    const note = (body as any)?.note || null

    if (!orderId || !newStatus) return jsonError(400, 'Order ID and status required')

    if (!VALID_STATUSES.includes(newStatus)) return jsonError(400, 'Invalid status')

    const order = await env.DB.prepare('SELECT id, status, email, customer_id, order_number, total_cents FROM orders WHERE id = ?').bind(orderId).first() as any
    if (!order) return jsonError(404, 'Order not found')

    await env.DB.prepare('UPDATE orders SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').bind(newStatus, orderId).run()

    await env.DB.prepare('INSERT INTO order_status_history (order_id, from_status, to_status, note, created_by) VALUES (?, ?, ?, ?, ?)').bind(orderId, order.status, newStatus, note, user.id).run()

    if (['shipped', 'delivered', 'cancelled', 'processing'].includes(newStatus)) {
      const customer = await env.DB.prepare('SELECT email, name FROM customers WHERE id = ?').bind(order.customer_id).first()
      await env.EMAIL_QUEUE.send({
        type: 'order_status_update',
        to: customer?.email || order.email,
        data: {
          orderNumber: order.order_number,
          status: newStatus,
          totalCents: order.total_cents,
          customerName: customer?.name || 'Customer',
          note,
        },
      }).catch((err) => { console.error('Queue send failed:', err) })
    }

    await logAudit(env.DB, { actorType: "admin", actorId: user.id, action: `order.status:${newStatus}`, resourceType: "order", resourceId: orderId, metadata: { fromStatus: order.status, toStatus: newStatus }, ipAddress: request.headers.get("CF-Connecting-IP"), userAgent: request.headers.get("User-Agent") })

    return jsonOk({ success: true })
  } catch (err) {
    console.error('Orders PATCH error:', err)
    return jsonError(500, 'Failed to update order')
  }
}
