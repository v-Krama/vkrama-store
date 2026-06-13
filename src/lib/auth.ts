import { SignJWT, jwtVerify } from 'jose'
import { nanoid } from 'nanoid'
import { SESSION_EXPIRY_DAYS, ADMIN_SESSION_EXPIRY_HOURS } from './constants'

const _envJwtKey = 'JWT_SECRET'
function getJwtSecretBytes(): Uint8Array {
  const key = typeof process !== 'undefined' && process.env?.[_envJwtKey]
    || typeof import.meta !== 'undefined' && (import.meta as any).env?.[_envJwtKey]
  if (!key) throw new Error('JWT_SECRET environment variable is required')
  return new TextEncoder().encode(key)
}

interface SessionPayload {
  userId: string
  userType: 'customer' | 'admin'
  sessionId: string
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

import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function checkAdminAuth(request: Request): Promise<boolean> {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return false
  const payload = await verifyToken(auth.slice(7))
  return !!payload && payload.userType === 'admin'
}

export function getEnv(key: string, fallback = ''): string {
  if (typeof process !== 'undefined' && process.env?.[key]) return process.env[key]
  if (typeof import.meta !== 'undefined') {
    const meta = import.meta as any
    if (meta.env?.[key]) return meta.env[key]
  }
  return fallback
}
