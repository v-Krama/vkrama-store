import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { customers, verificationTokens } from '../../../db/schema'
import { eq, and } from 'drizzle-orm'
import { hashPassword, validatePassword } from '../../../lib/auth'
import { rateLimitMiddleware } from '../../../lib/rate-limit'
import { jsonError, jsonOk } from '../../../lib/validation'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  const rl = await rateLimitMiddleware(request, env, { maxRequests: 5, windowMs: 60_000 })
  if (rl) return rl

  if (!env?.DB) return jsonError(500, 'Server error')

  try {
    const body = await request.json().catch(() => null)
    const token = (body as any)?.token
    const password = (body as any)?.password || ''

    if (!token || !password) return jsonError(400, 'Token and password required')

    const pwError = validatePassword(password)
    if (pwError) return jsonError(400, pwError)

    const db = getDb(env.DB)
    const record = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, 'password_reset'),
        )
      )
      .get()

    if (!record) return jsonError(400, 'Invalid token')
    if (record.usedAt) return jsonError(400, 'Token already used')
    if (new Date(record.expiresAt) < new Date()) return jsonError(400, 'Token expired')

    const passwordHash = await hashPassword(password)
    await env.DB.prepare(
      'UPDATE customers SET password_hash = ? WHERE email = ?'
    ).bind(passwordHash, record.email).run()

    await env.DB.prepare(
      'UPDATE verification_tokens SET used_at = datetime(\'now\') WHERE id = ?'
    ).bind(record.id).run()

    await env.DB.prepare(
      'DELETE FROM sessions WHERE user_id = (SELECT id FROM customers WHERE email = ?) AND user_type = ?'
    ).bind(record.email, 'customer').run()

    return jsonOk({ message: 'Password reset successfully' })
  } catch {
    return jsonError(400, 'Reset failed')
  }
}
