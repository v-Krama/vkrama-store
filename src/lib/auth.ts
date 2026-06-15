import { SignJWT, jwtVerify } from 'jose'
import { nanoid } from 'nanoid'
import { SESSION_EXPIRY_DAYS, ADMIN_SESSION_EXPIRY_HOURS } from './constants'

const PBKDF2_ITERATIONS = 100_000
const PBKDF2_KEYLEN = 64
const PBKDF2_DIGEST = 'SHA-256'

function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

function fromBase64(str: string): Uint8Array {
  const bin = atob(str)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(32))
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: PBKDF2_DIGEST },
    keyMaterial,
    PBKDF2_KEYLEN * 8
  )
  return `pbkdf2:${PBKDF2_ITERATIONS}:${toBase64(salt)}:${toBase64(derivedBits)}`
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith('pbkdf2:')) {
    const [, iterationsStr, saltB64, hashB64] = storedHash.split(':')
    const iterations = parseInt(iterationsStr, 10)
    const salt = fromBase64(saltB64)
    const expectedHash = fromBase64(hashB64)

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    )
    const derivedBits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations, hash: PBKDF2_DIGEST },
      keyMaterial,
      expectedHash.length * 8
    )
    const computed = new Uint8Array(derivedBits)
    if (computed.length !== expectedHash.length) return false
    let diff = 0
    for (let i = 0; i < computed.length; i++) diff |= computed[i] ^ expectedHash[i]
    return diff === 0
  }
  return false
}

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
