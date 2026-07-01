import type { APIRoute } from 'astro'
import { getAuthUser, generateId } from '../../../../lib/auth'
import { jsonError, jsonOk } from '../../../../lib/validation'
import { sendShippingUpdateEmail, sendPaymentRequestEmail } from '../../../../lib/email'
import { hasPermission, jsonForbidden } from '../../../../lib/admin-auth'
import { logAudit } from '../../../../lib/audit'

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  awaiting_payment: ['payment_requested', 'cancelled'],
  payment_requested: ['paid', 'cancelled'],
  paid: ['processing', 'refunded', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['refunded', 'partially_refunded'],
  cancelled: [],
  refunded: [],
  partially_refunded: ['refunded'],
}

const ORDER_STATUSES = ['pending', 'awaiting_payment', 'payment_requested', 'paid', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded'] as const

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
    const payments = await env.DB.prepare('SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC').bind(id).all()
    const statusHistory = await env.DB.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at DESC').bind(id).all()

    return new Response(
      JSON.stringify({ ...(order as any), items: items.results, payments: payments.results, statusHistory: statusHistory.results }),
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
  if (!hasPermission(user.role, 'orders:write')) return jsonForbidden()

  const id = params.id
  if (!id) return jsonError(400, 'Order ID required')

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, 'Invalid request body')

    const action = String((body as any).action || '').toLowerCase()
    const newStatus = String((body as any).status || '').toLowerCase()

    const current = await env.DB.prepare(
      'SELECT o.*, c.name as customer_name FROM orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE o.id = ?'
    ).bind(id).first() as any
    if (!current) return jsonError(404, 'Order not found')

    // Handle "request_payment" action
    if (action === 'request_payment') {
      if (current.status !== 'awaiting_payment') {
        return jsonError(400, `Cannot request payment from ${current.status}. Must be awaiting_payment`)
      }

      await env.DB.prepare(
        "UPDATE orders SET status = 'payment_requested', updated_at = datetime('now') WHERE id = ?"
      ).bind(id).run()

      await env.DB.prepare(
        'INSERT INTO order_status_history (order_id, from_status, to_status, note, created_by) VALUES (?, ?, ?, ?, ?)'
      ).bind(id, 'awaiting_payment', 'payment_requested', (body as any).note || null, user.id).run()

      // Notify customer that payment request is ready
      const toEmail = current.email
      if (toEmail) {
        sendPaymentRequestEmail({
          email: toEmail,
          orderId: id,
          orderNumber: current.order_number,
          totalCents: current.total_cents,
          customerName: current.customer_name || 'Customer',
        }).catch(() => {})
      }

      await logAudit(env.DB, {
        actorType: "admin", actorId: user.id,
        action: "order.payment_requested",
        resourceType: "order", resourceId: id,
        metadata: { fromStatus: 'awaiting_payment', toStatus: 'payment_requested' },
        ipAddress: request.headers.get("CF-Connecting-IP"),
        userAgent: request.headers.get("User-Agent"),
      })

      return jsonOk({ success: true, status: 'payment_requested' })
    }

    // Handle "confirm_payment" action
    if (action === 'confirm_payment') {
      if (current.status !== 'payment_requested') {
        return jsonError(400, `Cannot confirm payment from ${current.status}. Must be payment_requested`)
      }

      const transactionId = String((body as any).transactionId || '').trim()
      if (!transactionId) {
        return jsonError(400, 'Transaction reference is required')
      }

      // Deduct stock now that payment is confirmed
      const orderItems = await env.DB.prepare(
        'SELECT variant_id, quantity FROM order_items WHERE order_id = ?'
      ).bind(id).all()

      const stockOps: any[] = []
      for (const item of orderItems.results as any[]) {
        if (item.variant_id) {
          stockOps.push(
            env.DB.prepare('UPDATE product_variants SET stock = stock - ? WHERE id = ? AND stock >= ?').bind(
              item.quantity, item.variant_id, item.quantity
            )
          )
        }
      }

      if (stockOps.length > 0) {
        const stockResults = await env.DB.batch(stockOps)
        const failed = stockResults.some((r: any) => r.meta?.changes === 0)
        if (failed) {
          // Rollback: restore any that succeeded
          for (let i = 0; i < stockResults.length; i++) {
            if ((stockResults[i] as any).meta?.changes > 0) {
              const item = (orderItems.results as any[])[i]
              await env.DB.prepare('UPDATE product_variants SET stock = stock + ? WHERE id = ?').bind(
                item.quantity, item.variant_id
              ).run()
            }
          }
          return jsonError(409, 'Insufficient stock to confirm payment. Update stock levels first.')
        }
      }

      // Record payment
      const paymentId = generateId('pay')
      await env.DB.prepare(
        `INSERT INTO payments (id, order_id, method, transaction_id, amount_cents, currency, status, paid_at, created_at)
         VALUES (?, ?, ?, ?, ?, 'NPR', 'succeeded', datetime('now'), datetime('now'))`
      ).bind(paymentId, id, current.payment_method || 'qr', transactionId, current.total_cents).run()

      await env.DB.prepare(
        "UPDATE orders SET status = 'paid', payment_status = 'paid', updated_at = datetime('now') WHERE id = ?"
      ).bind(id).run()

      await env.DB.prepare(
        'INSERT INTO order_status_history (order_id, from_status, to_status, note, created_by) VALUES (?, ?, ?, ?, ?)'
      ).bind(id, 'payment_requested', 'paid', (body as any).note || null, user.id).run()

      await logAudit(env.DB, {
        actorType: "admin", actorId: user.id,
        action: "order.payment_confirmed",
        resourceType: "order", resourceId: id,
        metadata: { transactionId, amountCents: current.total_cents },
        ipAddress: request.headers.get("CF-Connecting-IP"),
        userAgent: request.headers.get("User-Agent"),
      })

      return jsonOk({ success: true, status: 'paid' })
    }

    // Standard status transition
    if (!newStatus || !ORDER_STATUSES.includes(newStatus as any)) {
      return jsonError(400, 'Invalid order status')
    }

    const allowed = VALID_TRANSITIONS[current.status]
    if (!allowed || !allowed.includes(newStatus)) {
      return jsonError(400, `Cannot transition from ${current.status} to ${newStatus}`)
    }

    await env.DB.prepare(
      "UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?"
    ).bind(newStatus, id).run()

    await env.DB.prepare(
      'INSERT INTO order_status_history (order_id, from_status, to_status, note, created_by) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, current.status, newStatus, (body as any).note || null, user.id).run()

    if (current.email && ['shipped', 'delivered', 'processing'].includes(newStatus)) {
      sendShippingUpdateEmail({ email: current.email, orderId: id, status: newStatus }).catch(() => {})
    }

    await logAudit(env.DB, {
      actorType: "admin", actorId: user.id,
      action: `order.status:${newStatus}`,
      resourceType: "order", resourceId: id,
      metadata: { fromStatus: current.status, toStatus: newStatus },
      ipAddress: request.headers.get("CF-Connecting-IP"),
      userAgent: request.headers.get("User-Agent"),
    })

    return jsonOk({ success: true, status: newStatus })
  } catch (err: any) {
    console.error("Order PUT error:", err)
    return jsonError(400, err.message || 'Failed to update order')
  }
}
