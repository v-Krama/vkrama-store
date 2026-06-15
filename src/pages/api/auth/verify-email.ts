import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { customers, verificationTokens } from '../../../db/schema'
import { eq, and, gt } from 'drizzle-orm'

export const GET: APIRoute = async ({ url, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response('Server error', { status: 500 })

  const token = url.searchParams.get('token')
  if (!token) return new Response('Invalid token', { status: 400 })

  try {
    const db = getDb(env.DB)
    const record = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, 'email_verify'),
        )
      )
      .get()

    if (!record) return new Response('Invalid or expired token', { status: 400 })

    if (record.usedAt) return new Response('Token already used', { status: 400 })

    if (new Date(record.expiresAt) < new Date()) {
      return new Response('Token expired', { status: 400 })
    }

    await env.DB.prepare(
      'UPDATE customers SET is_verified = 1 WHERE email = ?'
    ).bind(record.email).run()

    await env.DB.prepare(
      'UPDATE verification_tokens SET used_at = datetime(\'now\') WHERE id = ?'
    ).bind(record.id).run()

    return new Response(null, {
      status: 302,
      headers: { Location: '/account/orders?verified=1' },
    })
  } catch {
    return new Response('Verification failed', { status: 500 })
  }
}
