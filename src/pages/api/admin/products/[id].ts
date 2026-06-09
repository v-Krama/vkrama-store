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
  if (!id) return new Response(JSON.stringify({ error: 'Product ID required' }), { status: 400 })

  try {
    const product = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()
    if (!product) return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 })
    return new Response(JSON.stringify(product), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Product GET error:', err)
    return new Response(JSON.stringify({ error: 'Failed to load product' }), { status: 500 })
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
  if (!id) return new Response(JSON.stringify({ error: 'Product ID required' }), { status: 400 })

  try {
    const body = await request.json()
    await env.DB.prepare(
      `UPDATE products SET name = ?, description = ?, price_cents = ?, compare_at_price_cents = ?, stock = ?, status = ?, image_url = ?, seo_title = ?, seo_description = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(
      body.name, body.description || null,
      Math.round(body.price * 100),
      body.compareAtPrice ? Math.round(body.compareAtPrice * 100) : null,
      body.stock || 0, body.status || 'draft',
      body.imageUrl || null,
      body.seoTitle || null, body.seoDescription || null,
      id
    ).run()
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to update product' }), { status: 400 })
  }
}

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return new Response('Unauthorized', { status: 401 })
  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'admin') return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })

  const id = params.id
  if (!id) return new Response(JSON.stringify({ error: 'Product ID required' }), { status: 400 })

  try {
    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to delete product' }), { status: 400 })
  }
}
