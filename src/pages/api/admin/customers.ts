import type { APIRoute } from 'astro'
import { verifyToken } from '../../../lib/auth'

export const GET: APIRoute = async ({ request, locals }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return new Response('Unauthorized', { status: 401 })
  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'admin') return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  const result = await env.DB.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) as order_count
    FROM customers c ORDER BY c.created_at DESC
  `).all()

  return new Response(JSON.stringify(result.results), { headers: { 'Content-Type': 'application/json' } })
}
