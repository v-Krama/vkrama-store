import type { APIRoute } from 'astro'
import { verifyToken } from '../../../lib/auth'

export const GET: APIRoute = async ({ request, locals }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const payload = await verifyToken(auth.slice(7))
  if (!payload) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const env = (locals as any).runtime?.env
  let user = null

  if (payload.userType === 'customer' && env?.DB) {
    const row = await env.DB.prepare('SELECT id, email, name FROM customers WHERE id = ?').bind(payload.userId).first()
    if (row) user = row
  }

  return new Response(JSON.stringify({ user, userType: payload.userType }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
