import type { APIRoute } from 'astro'
import { checkAdminAuth } from '../../../lib/auth'

export const GET: APIRoute = async ({ request, locals }) => {
  if (!(await checkAdminAuth(request))) return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  try {
    const result = await env.DB.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) as order_count
      FROM customers c ORDER BY c.created_at DESC
    `).all()

    return new Response(JSON.stringify(result.results), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Customers GET error:', err)
    return new Response(JSON.stringify({ error: 'Failed to load customers' }), { status: 500 })
  }
}
