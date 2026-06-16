import type { APIRoute } from 'astro'
import { jsonError } from '../../../lib/validation'
import { getAdminUser, hasPermission } from '../../../lib/admin-auth'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  const user = await getAdminUser(request, env.DB)
  if (!user) return jsonError(401, 'Unauthorized')
  if (!hasPermission(user.role, 'customers:read')) {
    return jsonError(403, 'Insufficient permissions')
  }

  try {
    const url = new URL(request.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50')))
    const offset = (page - 1) * limit

    const result = await env.DB.prepare(`
      SELECT c.id, c.email, c.name, c.phone, c.is_verified, c.is_active, c.accepts_marketing,
             c.tags, c.last_login_at, c.created_at, c.updated_at,
             (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) as order_count
      FROM customers c ORDER BY c.created_at DESC LIMIT ? OFFSET ?
    `).bind(limit, offset).all()

    return new Response(JSON.stringify(result.results), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Customers GET error:', err)
    return jsonError(500, 'Failed to load customers')
  }
}