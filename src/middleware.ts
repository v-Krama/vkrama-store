import { defineMiddleware } from 'astro:middleware'
import { csrfProtection } from './lib/csrf'

function getCsp(env: Record<string, unknown> | undefined) {
  const r2PublicUrl = env?.PUBLIC_R2_PUBLIC_URL as string | undefined
  const r2Domain = r2PublicUrl ? new URL(r2PublicUrl).hostname : ""

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.stripe.com https://m.stripe.network https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "frame-src 'self' https://js.stripe.com https://m.stripe.network",
    `img-src 'self' data: blob: https:${r2Domain ? ` ${r2Domain}` : ""}`,
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com https://m.stripe.network https://api.resend.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ")
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith('/api/') && !context.url.pathname.startsWith('/api/auth/')) {
    const csrfResult = csrfProtection(context.request)
    if (csrfResult) return csrfResult
  }

  const response = await next()

  const env = (context.locals as any).runtime?.env
  const securityHeaders: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
  }

  if (!context.url.pathname.startsWith('/api/')) {
    securityHeaders['Content-Security-Policy'] = getCsp(env)
  } else {
    securityHeaders['Content-Security-Policy'] = "default-src 'none'; frame-ancestors 'none'"
  }
  securityHeaders['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'

  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }

  return response
})
