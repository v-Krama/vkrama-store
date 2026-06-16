export interface RequiredEnv {
  JWT_SECRET: string
  PUBLIC_APP_URL: string
  RESEND_API_KEY?: string
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
  PUBLIC_STRIPE_KEY?: string
  PUBLIC_R2_PUBLIC_URL?: string
  PUBLIC_ADMIN_SLUG?: string
}

export function validateEnv(env: Record<string, string | undefined>): { valid: boolean; missing: string[] } {
  const required: Array<keyof RequiredEnv> = ['JWT_SECRET', 'PUBLIC_APP_URL']
  const missing = required.filter((key) => !env[key])

  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`)
  }

  if (env.JWT_SECRET && env.JWT_SECRET.length < 32) {
    console.warn('JWT_SECRET should be at least 32 characters for security')
  }

  return { valid: missing.length === 0, missing }
}

export function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env?.[key]) return process.env[key]
  if (typeof import.meta !== 'undefined') {
    const meta = import.meta as any
    if (meta.env?.[key]) return meta.env[key]
  }
  return undefined
}

export function getRuntimeEnv(locals: Record<string, unknown>): Env | undefined {
  return (locals as Record<string, unknown>).runtime as any
}
