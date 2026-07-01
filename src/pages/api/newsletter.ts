import type { APIRoute } from 'astro'
import { generateId } from '../../lib/auth'
import { rateLimitMiddleware } from '../../lib/rate-limit'
import { jsonError, jsonOk } from '../../lib/validation'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const rl = await rateLimitMiddleware(request, env, { maxRequests: 5, windowMs: 60_000 })
  if (rl) return rl

  try {
    const body = await request.json().catch(() => null)
    const email = (body as any)?.email?.toLowerCase().trim()
    if (!email) return jsonError(400, 'Email is required')

    const existing = await env.DB.prepare(
      'SELECT id FROM newsletter_subscribers WHERE email = ?'
    ).bind(email).first()

    if (existing) return jsonOk({ message: 'Already subscribed' })

    await env.DB.prepare(
      'INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)'
    ).bind(generateId('nws'), email).run()

    return jsonOk({ message: 'Subscribed successfully' })
  } catch {
    return jsonError(500, 'Failed to subscribe')
  }
}
