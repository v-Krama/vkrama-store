import type { APIRoute } from 'astro'
import { verifyToken } from '../../../../lib/auth'

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return new Response('Unauthorized', { status: 401 })
  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'admin') return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response('Not found', { status: 404 })

  await env.DB.prepare('DELETE FROM product_categories WHERE category_id = ?').bind(params.id!).run()
  await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(params.id!).run()

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
}
