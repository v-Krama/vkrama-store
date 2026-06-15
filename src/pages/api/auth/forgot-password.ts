import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { customers, verificationTokens } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { generateId } from '../../../lib/auth'
import { rateLimitMiddleware } from '../../../lib/rate-limit'
import { jsonError, jsonOk } from '../../../lib/validation'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  const rl = await rateLimitMiddleware(request, env, { maxRequests: 3, windowMs: 60_000 })
  if (rl) return rl

  if (!env?.DB) return jsonError(500, 'Server error')

  try {
    const body = await request.json().catch(() => null)
    const email = (body as any)?.email?.toLowerCase().trim()
    if (!email) return jsonError(400, 'Email required')

    const db = getDb(env.DB)
    const customer = await db
      .select({ id: customers.id, email: customers.email })
      .from(customers)
      .where(eq(customers.email, email))
      .get()

    if (!customer) return jsonOk({ message: 'If an account exists, a reset email was sent.' })

    const resetToken = generateId('rst')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    await env.DB.prepare(
      'INSERT INTO verification_tokens (id, email, token, type, expires_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(generateId('vrf'), email, resetToken, 'password_reset', expiresAt).run()

    const siteUrl = env.SITE_URL || 'https://vkrama.com.np'
    const resetUrl = `${siteUrl}/account/reset-password?token=${resetToken}`

    await env.QUEUE.send('send-email', {
      to: email,
      subject: 'Reset your password - vkrama',
      html: `<p>Hi,</p><p>You requested a password reset. Click the link below to set a new password:</p><p><a href="${resetUrl}">Reset Password</a></p><p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>`,
    }).catch(() => {})

    return jsonOk({ message: 'If an account exists, a reset email was sent.' })
  } catch {
    return jsonError(400, 'Request failed')
  }
}
