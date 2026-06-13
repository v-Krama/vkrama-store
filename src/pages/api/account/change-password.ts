import type { APIRoute } from 'astro'
import { verifyToken, verifyPassword, hashPassword } from '../../../lib/auth'

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'customer') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: 'Current password and new password are required' }), { status: 400 })
    }
    if (newPassword.length < 8) {
      return new Response(JSON.stringify({ error: 'New password must be at least 8 characters' }), { status: 400 })
    }

    const customer = await env.DB.prepare('SELECT password_hash FROM customers WHERE id = ?').bind(payload.userId).first() as any
    if (!customer?.password_hash) {
      return new Response(JSON.stringify({ error: 'Account not found' }), { status: 404 })
    }

    const valid = await verifyPassword(currentPassword, customer.password_hash)
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Current password is incorrect' }), { status: 400 })
    }

    const newHash = await hashPassword(newPassword)
    await env.DB.prepare('UPDATE customers SET password_hash = ? WHERE id = ?').bind(newHash, payload.userId).run()

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to change password' }), { status: 500 })
  }
}
