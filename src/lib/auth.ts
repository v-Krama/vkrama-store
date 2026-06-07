import { SignJWT, jwtVerify } from 'jose'
import { nanoid } from 'nanoid'
import { SESSION_EXPIRY_DAYS, ADMIN_SESSION_EXPIRY_HOURS } from './constants'

let _jwtSecret: Uint8Array | null = null
function getJwtSecretBytes(): Uint8Array {
  if (_jwtSecret) return _jwtSecret
  const key = process.env?.JWT_SECRET
  if (!key) throw new Error('JWT_SECRET environment variable is required')
  _jwtSecret = new TextEncoder().encode(key)
  return _jwtSecret
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
