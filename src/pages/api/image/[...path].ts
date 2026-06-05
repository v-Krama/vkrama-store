import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.R2_STORE) return new Response('Not found', { status: 404 })

  const path = params.path as string
  if (!path) return new Response('Not found', { status: 404 })

  try {
    const object = await env.R2_STORE.get(path)
    if (!object) return new Response('Not found', { status: 404 })

    const headers = new Headers()
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream')
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    return new Response(object.body, { headers })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
