import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { products } from '../../../db/schema'
import { desc } from 'drizzle-orm'
import { checkAdminAuth, generateId } from '../../../lib/auth'

export const GET: APIRoute = async ({ request, locals }) => {
  if (!(await checkAdminAuth(request))) return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  try {
    const db = getDb(env.DB)
    const result = await db.select().from(products).orderBy(desc(products.createdAt)).all()
    return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Products GET error:', err)
    return new Response(JSON.stringify({ error: 'Failed to load products' }), { status: 500 })
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!(await checkAdminAuth(request))) return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })

  try {
    const body = await request.json()
    const id = generateId('prod')
    const slug = (body.name as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + id.slice(-6)

    await env.DB.prepare(
      `INSERT INTO products (id, name, slug, description, price_cents, compare_at_price_cents, stock, status, image_url, seo_title, seo_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, body.name, slug, body.description || null,
      Math.round(body.price * 100),
      body.compareAtPrice ? Math.round(body.compareAtPrice * 100) : null,
      body.stock || 0, body.status || 'draft',
      body.imageUrl || null,
      body.seoTitle || null, body.seoDescription || null
    ).run()

    if (body.variantOptions && body.variantOptions.length > 0) {
      for (const opt of body.variantOptions) {
        await env.DB.prepare(
          'INSERT INTO variant_options (product_id, group_name, value, sort_order) VALUES (?, ?, ?, ?)'
        ).bind(id, opt.group, opt.value, 0).run()
      }

      const groups = [...new Set(body.variantOptions.map((o: any) => o.group))] as string[]
      const valuesByGroup = groups.map((g) => body.variantOptions.filter((o: any) => o.group === g).map((o: any) => o.value))

      function cartesian(arrays: string[][]): string[][] {
        if (arrays.length === 0) return [[]]
        const [first, ...rest] = arrays
        const restCombos = cartesian(rest)
        return first.flatMap((v) => restCombos.map((combo) => [v, ...combo]))
      }

      const combinations = cartesian(valuesByGroup)
      for (const combo of combinations) {
        const variantName = combo.join(' / ')
        const variantId = generateId('var')
        await env.DB.prepare(
          'INSERT INTO product_variants (id, product_id, name, stock, price_cents) VALUES (?, ?, ?, ?, ?)'
        ).bind(variantId, id, variantName, body.stock || 0, body.price ? Math.round(body.price * 100) : null).run()
      }
    }

    return new Response(JSON.stringify({ id, slug }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to create product' }), { status: 400 })
  }
}
