import type { APIRoute } from 'astro'
import { verifyToken, generateId } from '../../../lib/auth'

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
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  const result = await env.DB.prepare(
    'SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC'
  ).bind(payload.userId).all()

  return new Response(JSON.stringify(result.results), { headers: { 'Content-Type': 'application/json' } })
}

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'customer') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })

  try {
    const { label, name, phone, line1, line2, city, state, postalCode, country, isDefault } = await request.json()
    if (!name || !line1 || !city || !state || !postalCode) {
      return new Response(JSON.stringify({ error: 'Required fields missing' }), { status: 400 })
    }

    const id = generateId('addr')

    if (isDefault) {
      await env.DB.prepare('UPDATE addresses SET is_default = 0 WHERE customer_id = ?').bind(payload.userId).run()
    }

    await env.DB.prepare(
      'INSERT INTO addresses (id, customer_id, label, name, phone, line1, line2, city, state, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, payload.userId, label || 'Home', name, phone || null, line1, line2 || null, city, state, postalCode, country || 'US', isDefault ? 1 : 0).run()

    return new Response(JSON.stringify({ id }), { headers: { 'Content-Type': 'application/json' } })
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to create address' }), { status: 400 })
  }
}
