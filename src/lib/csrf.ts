const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"])
const TRUSTED_ORIGINS = [
  "https://vkrama.com.np",
  "https://vkrama-store.pages.dev",
  "http://localhost:4321",
]

export function verifyCsrf(request: Request): boolean {
  const method = request.method.toUpperCase()

  if (SAFE_METHODS.has(method)) return true

  const origin = request.headers.get("Origin")
  const referer = request.headers.get("Referer")

  if (origin) {
    try {
      const originUrl = new URL(origin)
      if (TRUSTED_ORIGINS.some(o => originUrl.origin === new URL(o).origin)) {
        return true
      }
    } catch {}
    return false
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer)
      if (TRUSTED_ORIGINS.some(o => refererUrl.origin === new URL(o).origin)) {
        return true
      }
    } catch {}
    return false
  }

  return false
}

export function csrfProtection(request: Request): Response | null {
  if (!verifyCsrf(request)) {
    return new Response(JSON.stringify({ error: "Invalid request origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }
  return null
}