import type { APIRoute } from 'astro'
import { getAuthUser } from '../../../lib/auth'
import { jsonError } from '../../../lib/validation'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')

  try {
    const result = await env.DB.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) as order_count
      FROM customers c ORDER BY c.created_at DESC
    `).all()

    return new Response(JSON.stringify(result.results), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Customers GET error:', err)
    return jsonError(500, 'Failed to load customers')
  }
}
