import { KVNamespace } from "@cloudflare/workers-types"

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export async function checkRateLimit(
  env: { CACHE: KVNamespace },
  key: string,
  config: RateLimitConfig = { maxRequests: 20, windowMs: 60_000 }
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowSec = Math.ceil(config.windowMs / 1000)
  const cacheKey = `ratelimit:${key}`

  const current = await env.CACHE.get(cacheKey, { type: "json" }) as { count: number; resetAt: number } | null

  if (!current || now > current.resetAt) {
    const resetAt = now + config.windowMs
    await env.CACHE.put(cacheKey, JSON.stringify({ count: 1, resetAt }), { expirationTtl: windowSec })
    return { allowed: true, remaining: config.maxRequests - 1, resetAt }
  }

  current.count++
  if (current.count > config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt }
  }

  await env.CACHE.put(cacheKey, JSON.stringify(current), { expirationTtl: windowSec })
  return { allowed: true, remaining: config.maxRequests - current.count, resetAt: current.resetAt }
}

export async function rateLimitMiddleware(
  request: Request,
  env: { CACHE?: KVNamespace },
  config?: RateLimitConfig
): Promise<Response | null> {
  if (!env?.CACHE) return null
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous"
  const key = `${request.method}:${new URL(request.url).pathname}:${ip}`
  const result = await checkRateLimit(env as { CACHE: KVNamespace }, key, config)

  if (!result.allowed) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
      },
    })
  }

  return null
}