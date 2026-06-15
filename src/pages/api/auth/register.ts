import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { customers, verificationTokens } from '../../../db/schema'
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
    const token = await createToken({ userId: customerId, userType: 'customer', sessionId }, 24)
    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, user_type, token, expires_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(sessionId, customerId, 'customer', token, getCustomerSessionExpiry()).run()

    const verifyToken = generateId('vrf')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    await env.DB.prepare(
      'INSERT INTO verification_tokens (id, email, token, type, expires_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(generateId('vrf'), email, verifyToken, 'email_verify', expiresAt).run()

    const siteUrl = env.SITE_URL || 'https://vkrama.com.np'
    const verifyUrl = `${siteUrl}/api/auth/verify-email?token=${verifyToken}`

    await env.QUEUE.send('send-email', {
      to: email,
      subject: 'Verify your email - vkrama',
      html: `<p>Hi ${name || 'there'},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">Verify Email</a></p><p>This link expires in 24 hours.</p>`,
    }).catch(() => {})

    return jsonOk({ token, email, name, redirect: '/account/orders' })
  } catch {
    return jsonError(400, 'Registration failed')
  }
}