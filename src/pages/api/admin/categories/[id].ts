import type { APIRoute } from 'astro'
import { getAuthUser } from '../../../../lib/auth'
import { jsonError, jsonOk } from '../../../../lib/validation'
import { hasPermission, jsonForbidden } from '../../../../lib/admin-auth'

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(404, 'Not found')

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')
  if (!hasPermission(user.role, 'products:delete')) return jsonForbidden()

  await env.DB.prepare('DELETE FROM product_categories WHERE category_id = ?').bind(params.id!).run()
  await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(params.id!).run()

  return jsonOk({ ok: true })
}
