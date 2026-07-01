const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"])
const TRUSTED_ORIGINS = [
  "https://vkrama.com.np",
  "https://www.vkrama.com.np",
  "https://shop.vkrama.com.np",
  "https://vkrama-store.pages.dev",
  "http://localhost:4321",
]

function isTrustedOrigin(origin: string): boolean {
  try {
    const url = new URL(origin)
    const hostname = url.hostname
    if (TRUSTED_ORIGINS.some(o => url.origin === new URL(o).origin)) return true
    return false
  } catch {
    return false
  }
}

export function verifyCsrf(request: Request): boolean {
  const method = request.method.toUpperCase()

  if (SAFE_METHODS.has(method)) return true

  const origin = request.headers.get("Origin")

  if (origin) return isTrustedOrigin(origin)

  const referer = request.headers.get("Referer")
  if (referer) return isTrustedOrigin(referer)

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