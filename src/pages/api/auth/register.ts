import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { customers } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword, createToken, generateId, getCustomerSessionExpiry, validateEmail, validatePassword } from '../../../lib/auth'
import { rateLimitMiddleware } from '../../../lib/rate-limit'
import { jsonError, jsonOk, sanitizeString } from '../../../lib/validation'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  const rl = await rateLimitMiddleware(request, env, { maxRequests: 3, windowMs: 60_000 })
  if (rl) return rl

  if (!env?.DB) return jsonError(500, 'Server error')

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, 'Invalid request body')

    const name = sanitizeString((body as any).name, 100)
    const email = sanitizeString((body as any).email).toLowerCase().trim()
    const password = (body as any).password || ''

    if (!email || !password) return jsonError(400, 'Name, email, and password required')
    if (!validateEmail(email)) return jsonError(400, 'Invalid email format')

    const pwError = validatePassword(password)
    if (pwError) return jsonError(400, pwError)

    const db = getDb(env.DB)
    const existing = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.email, email))
      .get()

    if (existing) return jsonError(409, 'Email already registered')

    const customerId = generateId('cust')
    const passwordHash = await hashPassword(password)

    await env.DB.prepare(
      'INSERT INTO customers (id, email, name, password_hash) VALUES (?, ?, ?, ?)'
    ).bind(customerId, email, name || null, passwordHash).run()

    const sessionId = generateId('sess')
    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)'
    ).bind(sessionId, customerId, 'customer', getCustomerSessionExpiry()).run()

    const token = await createToken({ userId: customerId, userType: 'customer', sessionId }, 24)

    return jsonOk({ token, email, name, redirect: '/account/orders' })
  } catch {
    return jsonError(400, 'Registration failed')
  }
}