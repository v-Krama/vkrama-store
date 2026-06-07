import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { customers } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword, createToken, generateId, getCustomerSessionExpiry } from '../../../lib/auth'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  const db = getDb(env.DB)

  try {
    const { name, email, password } = await request.json()
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Name, email, and password required' }), { status: 400 })
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters with uppercase, lowercase, and a number' }), { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existing = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.email, normalizedEmail))
      .get()

    if (existing) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), { status: 409 })
    }

    const customerId = generateId('cust')
    const passwordHash = await hashPassword(password)

    await env.DB.prepare(
      'INSERT INTO customers (id, email, name, password_hash) VALUES (?, ?, ?, ?)'
    ).bind(customerId, normalizedEmail, name || null, passwordHash).run()

    const sessionId = generateId('sess')
    await env.DB.prepare(
      'INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)'
    ).bind(sessionId, customerId, 'customer', getCustomerSessionExpiry()).run()

    const token = await createToken({ userId: customerId, userType: 'customer', sessionId }, 24)

    return new Response(JSON.stringify({ token, email: normalizedEmail, name: name || '', redirect: '/account/orders' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Registration failed' }), { status: 400 })
  }
}
