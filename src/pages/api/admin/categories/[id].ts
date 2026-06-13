import type { APIRoute } from 'astro'
import { checkAdminAuth } from '../../../../lib/auth'

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  if (!(await checkAdminAuth(request))) return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response('Not found', { status: 404 })

  await env.DB.prepare('DELETE FROM product_categories WHERE category_id = ?').bind(params.id!).run()
  await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(params.id!).run()

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
}
