import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { customers } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword, createToken, generateId, getCustomerSessionExpiry, validateEmail } from '../../../lib/auth'
import { rateLimitMiddleware } from '../../../lib/rate-limit'
import { jsonError, jsonOk, sanitizeString } from '../../../lib/validation'

export const POST: APIRoute = async ({ request, locals }) => {
  const rl = rateLimitMiddleware(request, { maxRequests: 5, windowMs: 60_000 })
  if (rl) return rl

  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, 'Invalid request body')

    const email = sanitizeString((body as any).email).toLowerCase()
    const password = (body as any).password || ''

    if (!email || !password) return jsonError(400, 'Email and password required')
    if (!validateEmail(email)) return jsonError(400, 'Invalid email format')

    const db = getDb(env.DB)
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .get()

    if (!customer) return jsonError(401, 'Invalid email or password')

    const valid = await verifyPassword(password, customer.passwordHash)
    if (!valid) return jsonError(401, 'Invalid email or password')

    const sessionId = generateId('sess')
    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)'
    ).bind(sessionId, customer.id, 'customer', getCustomerSessionExpiry()).run()

    const token = await createToken({ userId: customer.id, userType: 'customer', sessionId }, 720)

    return jsonOk({ token, email: customer.email, name: customer.name, redirect: '/account/orders' })
  } catch {
    return jsonError(400, 'Invalid request')
  }
}
