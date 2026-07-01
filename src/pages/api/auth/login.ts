import type { APIRoute } from 'astro'
import { verifyPassword, createToken, generateId, getCustomerSessionExpiry, validateEmail, checkAccountLockout, recordFailedAttempt, clearAccountLockout } from '../../../lib/auth'
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
    if (password.length > 128) return jsonError(400, 'Password too long')

    const lockout = await checkAccountLockout(env, `login:${email}`)
    if (lockout?.locked) return jsonError(429, `Too many attempts. Try again in ${lockout.remainingMinutes} minutes.`)

    const customer = await env.DB.prepare(
      'SELECT id, email, name, password_hash, is_active FROM customers WHERE email = ?'
    ).bind(email).first() as any

    if (!customer) {
      await recordFailedAttempt(env, `login:${email}`)
      return jsonError(401, 'Invalid email or password')
    }

    const valid = await verifyPassword(password, customer.password_hash)
    if (!valid) {
      await recordFailedAttempt(env, `login:${email}`)
      return jsonError(401, 'Invalid email or password')
    }

    if (customer.is_active === 0) {
      return jsonError(403, 'Account is disabled. Please contact support.')
    }

    await clearAccountLockout(env, `login:${email}`)

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