import type { APIRoute } from 'astro'
import { verifyPassword, createToken, generateId, getCustomerSessionExpiry, validateEmail } from '../../../lib/auth'
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

    const email = sanitizeString((body as any).email).toLowerCase()
    const password = (body as any).password || ''

    if (!email || !password) return jsonError(400, 'Email and password required')
    if (!validateEmail(email)) return jsonError(400, 'Invalid email format')

    const customer = await env.DB.prepare(
      'SELECT id, email, name, password_hash FROM customers WHERE email = ?'
    ).bind(email).first() as any

    if (!customer) return jsonError(401, 'Invalid email or password')

    const valid = await verifyPassword(password, customer.password_hash)
    if (!valid) return jsonError(401, 'Invalid email or password')

    const sessionId = generateId('sess')
    const token = await createToken({ userId: customer.id, userType: 'customer', sessionId }, 720)
    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, user_type, token, expires_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(sessionId, customer.id, 'customer', token, getCustomerSessionExpiry()).run()

    return jsonOk({ token, email: customer.email, name: customer.name, redirect: '/account/orders' })
  } catch {
    return jsonError(400, 'Invalid request')
  }
}