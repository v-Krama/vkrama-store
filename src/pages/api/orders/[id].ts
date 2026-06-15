import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { orders, orderItems, shipments } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { getAuthUser } from '../../../lib/auth'
import { jsonError } from '../../../lib/validation'

export const GET: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(404, 'Not found')

  const user = await getAuthUser(request, env.DB, 'customer')
  if (!user) return jsonError(401, 'Unauthorized')

  const db = getDb(env.DB)

  try {
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, params.id!))
      .get()

    if (!order || order.customerId !== user.id) return jsonError(404, 'Not found')

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id))
      .all()

    const shipmentsList = await db
      .select()
      .from(shipments)
      .where(eq(shipments.orderId, order.id))
      .all()

    return new Response(JSON.stringify({ ...order, items, shipments: shipmentsList }), { headers: { 'Content-Type': 'application/json' } })
  } catch {
    return jsonError(404, 'Not found')
  }
}
