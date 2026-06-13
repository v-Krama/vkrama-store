import type { APIRoute } from 'astro'
import { checkAdminAuth } from '../../../lib/auth'

export const GET: APIRoute = async ({ request, locals }) => {
  if (!(await checkAdminAuth(request))) return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  try {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    let query = 'SELECT * FROM orders ORDER BY created_at DESC'
    let params: any[] = []

    if (status) {
      query = 'SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC'
      params = [status]
    }

    const result = await env.DB.prepare(query).bind(...params).all()
    return new Response(JSON.stringify(result.results), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Orders GET error:', err)
    return new Response(JSON.stringify({ error: 'Failed to load orders' }), { status: 500 })
  }
}
