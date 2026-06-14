import { escapeHtml } from './escape'

export interface ValidationError {
  field: string
  message: string
}

export type ValidationResult<T> = { valid: true; data: T } | { valid: false; errors: ValidationError[] }

export function sanitizeString(input: unknown, maxLength = 5000): string {
  if (typeof input !== 'string') return ''
  return escapeHtml(input.trim().slice(0, maxLength))
}

export function sanitizeOptionalString(input: unknown, maxLength = 5000): string | null {
  if (typeof input !== 'string' || !input.trim()) return null
  return sanitizeString(input, maxLength)
}

export function validateRequiredString(input: unknown, field: string, maxLength = 5000): ValidationError | null {
  if (typeof input !== 'string' || !input.trim()) {
    return { field, message: `${field} is required` }
  }
  if (input.trim().length > maxLength) {
    return { field, message: `${field} must be ${maxLength} characters or less` }
  }
  return null
}

export function validateEmail(input: unknown): ValidationError | null {
  if (typeof input !== 'string' || !input.trim()) {
    return { field: 'email', message: 'Email is required' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim())) {
    return { field: 'email', message: 'Invalid email format' }
  }
  return null
}

export function validatePrice(input: unknown): ValidationError | null {
  if (typeof input !== 'number' || isNaN(input) || input < 0) {
    return { field: 'price', message: 'Price must be a positive number' }
  }
  if (input > 1_000_000_000) {
    return { field: 'price', message: 'Price is too high' }
  }
  return null
}

export function validateInteger(input: unknown, field: string, min = 0, max = 1_000_000): ValidationError | null {
  if (typeof input !== 'number' || !Number.isInteger(input) || input < min || input > max) {
    return { field, message: `${field} must be an integer between ${min} and ${max}` }
  }
  return null
}

export function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function jsonOk(data: Record<string, unknown>): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export function parseJsonBody(body: string | null): Record<string, unknown> | null {
  if (!body) return null
  try {
    return JSON.parse(body) as Record<string, unknown>
  } catch {
    return null
  }
}
