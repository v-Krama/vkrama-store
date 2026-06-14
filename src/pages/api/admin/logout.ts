import type { APIRoute } from 'astro'
import { verifyToken } from '../../../lib/auth'
import { jsonOk } from '../../../lib/validation'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonOk({ ok: true })

  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (token) {
    const payload = await verifyToken(token)
    if (payload?.sessionId) {
      await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(payload.sessionId).run()
    }
  }

  return jsonOk({ ok: true })
}
