import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { orders, orderItems } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { verifyToken } from '../../../lib/auth'

export const GET: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response('Not found', { status: 404 })
  const db = getDb(env.DB)

  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'customer') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, params.id!))
      .get()

    if (!order || order.customerId !== payload.userId) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id))
      .all()

    return new Response(JSON.stringify({ ...order, items }), { headers: { 'Content-Type': 'application/json' } })
  } catch {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  }
}
