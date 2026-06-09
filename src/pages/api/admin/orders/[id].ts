import type { APIRoute } from 'astro'
import { verifyToken } from '../../../../lib/auth'

export const GET: APIRoute = async ({ params, request, locals }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return new Response('Unauthorized', { status: 401 })
  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'admin') return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })

  const id = params.id
  if (!id) return new Response(JSON.stringify({ error: 'Order ID required' }), { status: 400 })

  try {
    const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first()
    if (!order) return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })

    const items = await env.DB.prepare('SELECT * FROM order_items WHERE order_id = ?').bind(id).all()

    return new Response(JSON.stringify({ ...(order as any), items: items.results }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Order GET error:', err)
    return new Response(JSON.stringify({ error: 'Failed to load order' }), { status: 500 })
  }
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return new Response('Unauthorized', { status: 401 })
  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'admin') return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })

  const id = params.id
  if (!id) return new Response(JSON.stringify({ error: 'Order ID required' }), { status: 400 })

  try {
    const { status } = await request.json()
    if (!status) return new Response(JSON.stringify({ error: 'Status required' }), { status: 400 })

    await env.DB.prepare(
      "UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?"
    ).bind(status, id).run()
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to update order' }), { status: 400 })
  }
}
