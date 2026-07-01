import type { APIRoute } from 'astro'
import { getAuthUser, generateId } from '../../../lib/auth'
import { jsonError, jsonOk, sanitizeString } from '../../../lib/validation'
import { hasPermission, jsonForbidden } from '../../../lib/admin-auth'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')

  try {
    const all = await env.DB.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM product_categories pc WHERE pc.category_id = c.id) as product_count
      FROM categories c ORDER BY c.sort_order
    `).all()

    return new Response(JSON.stringify(all.results), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Categories GET error:', err)
    return jsonError(500, 'Failed to load categories')
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')
  if (!hasPermission(user.role, 'products:write')) return jsonForbidden()

  const body = await request.json().catch(() => null)
  if (!body) return jsonError(400, 'Invalid request body')

  const name = sanitizeString((body as any).name, 100)
  if (!name) return jsonError(400, 'Name required')

  const id = generateId('cat')
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  await env.DB.prepare('INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)').bind(id, name, slug).run()

  return jsonOk({ id })
}
