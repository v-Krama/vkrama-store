import type { APIRoute } from 'astro'
import { getAuthUser } from '../../../lib/auth'
import { jsonError } from '../../../lib/validation'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')

  try {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?'
    let params: any[] = [limit, offset]

    if (status) {
      query = 'SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
      params = [status, limit, offset]
    }

    const result = await env.DB.prepare(query).bind(...params).all()
    return new Response(JSON.stringify(result.results), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Orders GET error:', err)
    return jsonError(500, 'Failed to load orders')
  }
}
