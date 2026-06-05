import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { orders } from '../../../db/schema'
import { eq, desc } from 'drizzle-orm'
import { verifyToken } from '../../../lib/auth'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })
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
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, payload.userId))
      .orderBy(desc(orders.createdAt))
      .all()

    return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } })
  } catch {
    return new Response(JSON.stringify([]), { status: 200 })
  }
}
