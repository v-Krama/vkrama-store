import type { APIRoute } from 'astro'
import { verifyToken } from '../../../lib/auth'
import { nanoid } from 'nanoid'

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return new Response('Unauthorized', { status: 401 })
  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.userType !== 'admin') return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.R2_STORE) return new Response(JSON.stringify({ error: 'Storage not configured' }), { status: 500 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'products'

    if (!file) return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 })

    const ext = file.name.split('.').pop() || 'jpg'
    const key = `${folder}/${nanoid(16)}.${ext}`
    const buffer = await file.arrayBuffer()

    await env.R2_STORE.put(key, buffer, {
      httpMetadata: { contentType: file.type },
    })

    return new Response(JSON.stringify({ url: `/api/image/${key}`, key }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 400 })
  }
}
