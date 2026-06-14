import { SignJWT, jwtVerify } from 'jose'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import { SESSION_EXPIRY_DAYS, ADMIN_SESSION_EXPIRY_HOURS } from './constants'

let jwtSecretBytes: Uint8Array | null = null

function getJwtSecretBytes(): Uint8Array {
  if (jwtSecretBytes) return jwtSecretBytes
  const key = typeof process !== 'undefined' && process.env?.JWT_SECRET
    || typeof import.meta !== 'undefined' && (import.meta as any).env?.JWT_SECRET
  if (!key) throw new Error('JWT_SECRET environment variable is required')
  jwtSecretBytes = new TextEncoder().encode(key)
  return jwtSecretBytes
}

export function clearJwtCache(): void {
  jwtSecretBytes = null
}

export interface SessionPayload {
  userId: string
  userType: 'customer' | 'admin'
  sessionId: string
}

export interface AuthUser {
  id: string
  email: string
  name: string | null
  userType: 'customer' | 'admin'
  role?: string
}

export async function createToken(payload: SessionPayload, expiresInHours: number): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${expiresInHours}h`)
    .setJti(payload.sessionId)
    .sign(getJwtSecretBytes())
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretBytes())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function verifySession(db: D1Database, sessionId: string): Promise<boolean> {
  if (!sessionId) return false
  const row = await db.prepare(
    'SELECT id FROM sessions WHERE id = ? AND expires_at > datetime(\'now\')'
  ).bind(sessionId).first()
  return !!row
}

export async function getAuthUser(
  request: Request,
  db: D1Database,
  expectedType?: 'customer' | 'admin'
): Promise<AuthUser | null> {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null

  const payload = await verifyToken(auth.slice(7))
  if (!payload) return null
  if (expectedType && payload.userType !== expectedType) return null

  const valid = await verifySession(db, payload.sessionId)
  if (!valid) return null

  if (payload.userType === 'customer') {
    const row = await db.prepare(
      'SELECT id, email, name FROM customers WHERE id = ?'
    ).bind(payload.userId).first() as any
    if (!row) return null
    return { id: row.id, email: row.email, name: row.name, userType: 'customer' }
  }

  if (payload.userType === 'admin') {
    const row = await db.prepare(
      'SELECT id, email, name, role FROM admins WHERE id = ?'
    ).bind(payload.userId).first() as any
    if (!row) return null
    return { id: row.id, email: row.email, name: row.name, userType: 'admin', role: row.role }
  }

  return null
}

export function generateId(prefix?: string): string {
  const id = nanoid(24)
  return prefix ? `${prefix}_${id}` : id
}

export function createSessionId(): string {
  return nanoid(48)
}

export function getSessionExpiry(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export function getAdminSessionExpiry(): string {
  const date = new Date()
  date.setHours(date.getHours() + ADMIN_SESSION_EXPIRY_HOURS)
  return date.toISOString()
}

export function getCustomerSessionExpiry(): string {
  const date = new Date()
  date.setDate(date.getDate() + SESSION_EXPIRY_DAYS)
  return date.toISOString()
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function getEnv(key: string, fallback = ''): string {
  if (typeof process !== 'undefined' && process.env?.[key]) return process.env[key]
  if (typeof import.meta !== 'undefined') {
    const meta = import.meta as any
    if (meta.env?.[key]) return meta.env[key]
  }
  return fallback
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter'
  if (!/[0-9]/.test(password)) return 'Password must contain a number'
  if (password.length > 128) return 'Password is too long'
  return null
}
