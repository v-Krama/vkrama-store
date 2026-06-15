import type { APIRoute } from 'astro'
import { verifyPassword, createToken, generateId, getAdminSessionExpiry, validateEmail } from '../../../lib/auth'
import { rateLimitMiddleware } from '../../../lib/rate-limit'
import { jsonError, jsonOk, sanitizeString } from '../../../lib/validation'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  const rl = await rateLimitMiddleware(request, env, { maxRequests: 5, windowMs: 60_000 })
  if (rl) return rl

  if (!env?.DB) return jsonError(500, 'Server error')

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, 'Invalid request body')

    const email = sanitizeString((body as any).email).toLowerCase().trim()
    const password = (body as any).password || ''

    if (!email || !password) return jsonError(400, 'Email and password required')
    if (!validateEmail(email)) return jsonError(400, 'Invalid email format')

    const admin = await env.DB.prepare(
      'SELECT id, email, name, password_hash, role FROM admins WHERE email = ?'
    ).bind(email).first() as any

    if (!admin) return jsonError(401, 'Invalid credentials')

    const valid = await verifyPassword(password, admin.password_hash)
    if (!valid) return jsonError(401, 'Invalid credentials')

    const sessionId = generateId('sess')
    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)'
    ).bind(sessionId, admin.id, 'admin', getAdminSessionExpiry()).run()

    const token = await createToken({ userId: admin.id, userType: 'admin', sessionId }, 12)

    return jsonOk({ token, email: admin.email, name: admin.name })
  } catch {
    return jsonError(500, 'An unexpected error occurred')
  }
}