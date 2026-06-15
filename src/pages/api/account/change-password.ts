import type { APIRoute } from 'astro'
import { getAuthUser, verifyPassword, hashPassword, validatePassword } from '../../../lib/auth'
import { rateLimitMiddleware } from '../../../lib/rate-limit'
import { jsonError, jsonOk } from '../../../lib/validation'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  const rl = await rateLimitMiddleware(request, env, { maxRequests: 3, windowMs: 60_000 })
  if (rl) return rl

  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'customer')
  if (!user) return jsonError(401, 'Unauthorized')

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, 'Invalid request body')

    const currentPassword = String((body as any).currentPassword || '')
    const newPassword = String((body as any).newPassword || '')

    if (!currentPassword || !newPassword) {
      return jsonError(400, 'Current password and new password are required')
    }

    const pwError = validatePassword(newPassword)
    if (pwError) return jsonError(400, pwError)

    const customer = await env.DB.prepare(
      'SELECT password_hash FROM customers WHERE id = ?'
    ).bind(user.id).first() as any

    if (!customer?.password_hash) return jsonError(404, 'Account not found')

    const valid = await verifyPassword(currentPassword, customer.password_hash)
    if (!valid) return jsonError(400, 'Current password is incorrect')

    const newHash = await hashPassword(newPassword)
    await env.DB.prepare('UPDATE customers SET password_hash = ? WHERE id = ?').bind(newHash, user.id).run()

    return jsonOk({ ok: true })
  } catch {
    return jsonError(500, 'Failed to change password')
  }
}