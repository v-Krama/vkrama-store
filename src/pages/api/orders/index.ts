import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { orders } from '../../../db/schema'
import { eq, desc } from 'drizzle-orm'
import { getAuthUser } from '../../../lib/auth'
import { jsonError } from '../../../lib/validation'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  const user = await getAuthUser(request, env.DB, 'customer')
  if (!user) return jsonError(401, 'Unauthorized')

  const db = getDb(env.DB)

  try {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, user.id))
      .orderBy(desc(orders.createdAt))
      .all()

    return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } })
  } catch {
    return new Response(JSON.stringify([]), { status: 200 })
  }
}
