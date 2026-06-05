import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.R2_STORE) return new Response('Not found', { status: 404 })

  const key = params.key
  if (!key) return new Response('Not found', { status: 404 })

  try {
    const object = await env.R2_STORE.get(key)
    if (!object) return new Response('Not found', { status: 404 })

    const headers: Record<string, string> = {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
    }

    return new Response(object.body, { headers })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
