import type { APIRoute } from 'astro'
import { verifyToken } from '../../../lib/auth'

export const GET: APIRoute = async ({ request, locals }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'customer') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({ user: null }), { status: 200 })

  const row = await env.DB.prepare('SELECT id, email, name, phone FROM customers WHERE id = ?').bind(payload.userId).first()

  return new Response(JSON.stringify({ user: row }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const PUT: APIRoute = async ({ request, locals }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'customer') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })

  try {
    const { name, phone } = await request.json()
    await env.DB.prepare('UPDATE customers SET name = ?, phone = ? WHERE id = ?').bind(name || null, phone || null, payload.userId).run()
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch {
    return new Response(JSON.stringify({ error: 'Update failed' }), { status: 400 })
  }
}
