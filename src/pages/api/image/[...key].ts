import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params, locals }) => {
  const key = params.key
  if (!key) return new Response('Not found', { status: 404 })

  const env = (locals as any).runtime?.env
  if (!env?.R2_STORE) return new Response('Storage not configured', { status: 500 })

  try {
    const object = await env.R2_STORE.get(key)
    if (!object) return new Response('Not found', { status: 404 })

    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
