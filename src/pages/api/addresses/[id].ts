import type { APIRoute } from 'astro'
import { getAuthUser } from '../../../lib/auth'
import { jsonError, jsonOk, sanitizeString } from '../../../lib/validation'

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(404, 'Not found')

  const user = await getAuthUser(request, env.DB, 'customer')
  if (!user) return jsonError(401, 'Unauthorized')

  const addr = await env.DB.prepare(
    'SELECT * FROM addresses WHERE id = ? AND customer_id = ?'
  ).bind(params.id!, user.id).first()

  if (!addr) return jsonError(404, 'Not found')

  await env.DB.prepare('DELETE FROM addresses WHERE id = ?').bind(params.id!).run()
  return jsonOk({ ok: true })
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(404, 'Not found')

  const user = await getAuthUser(request, env.DB, 'customer')
  if (!user) return jsonError(401, 'Unauthorized')

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, 'Invalid request body')

    const isDefault = !!(body as any).isDefault
    if (isDefault) {
      await env.DB.prepare('UPDATE addresses SET is_default = 0 WHERE customer_id = ?').bind(user.id).run()
    }

    await env.DB.prepare(
      'UPDATE addresses SET label = ?, name = ?, phone = ?, line1 = ?, line2 = ?, city = ?, state = ?, postal_code = ?, country = ?, is_default = ? WHERE id = ? AND customer_id = ?'
    ).bind(
      sanitizeString((body as any).label, 50) || 'Home',
      sanitizeString((body as any).name, 100),
      sanitizeString((body as any).phone, 20) || null,
      sanitizeString((body as any).line1, 200),
      sanitizeString((body as any).line2, 200) || null,
      sanitizeString((body as any).city, 100),
      sanitizeString((body as any).state, 100),
      sanitizeString((body as any).postalCode, 20),
      sanitizeString((body as any).country, 2) || 'NP',
      isDefault ? 1 : 0,
      params.id!,
      user.id
    ).run()

    return jsonOk({ ok: true })
  } catch {
    return jsonError(400, 'Failed to update address')
  }
}
