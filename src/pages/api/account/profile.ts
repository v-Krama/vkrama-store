import type { APIRoute } from 'astro'
import { getAuthUser } from '../../../lib/auth'
import { jsonError, jsonOk, sanitizeString } from '../../../lib/validation'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'customer')
  if (!user) return jsonError(401, 'Unauthorized')

  const row = await env.DB.prepare(
    'SELECT id, email, name, phone FROM customers WHERE id = ?'
  ).bind(user.id).first()

  return jsonOk({ user: row })
}

export const PUT: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'customer')
  if (!user) return jsonError(401, 'Unauthorized')

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, 'Invalid request body')

    const name = sanitizeString((body as any).name, 100)
    const phone = sanitizeString((body as any).phone, 20) || null

    await env.DB.prepare('UPDATE customers SET name = ?, phone = ? WHERE id = ?').bind(name, phone, user.id).run()
    return jsonOk({ ok: true })
  } catch {
    return jsonError(400, 'Update failed')
  }
}
