import type { APIRoute } from 'astro'
import { verifyToken, generateId } from '../../../lib/auth'

async function checkAdmin(request: Request): Promise<boolean> {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return false
  const payload = await verifyToken(auth.slice(7))
  return !!payload && payload.userType === 'admin'
}

export const GET: APIRoute = async ({ request, locals }) => {
  if (!(await checkAdmin(request))) return new Response('Unauthorized', { status: 401 })
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  const all = await env.DB.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM product_categories pc WHERE pc.category_id = c.id) as product_count
    FROM categories c ORDER BY c.sort_order
  `).all()

  return new Response(JSON.stringify(all.results), { headers: { 'Content-Type': 'application/json' } })
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!(await checkAdmin(request))) return new Response('Unauthorized', { status: 401 })
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })

  const { name } = await request.json()
  if (!name) return new Response(JSON.stringify({ error: 'Name required' }), { status: 400 })

  const id = generateId('cat')
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  await env.DB.prepare('INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)').bind(id, name, slug).run()

  return new Response(JSON.stringify({ id }), { headers: { 'Content-Type': 'application/json' } })
}
