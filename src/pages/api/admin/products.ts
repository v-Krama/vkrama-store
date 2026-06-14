import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { products } from '../../../db/schema'
import { desc } from 'drizzle-orm'
import { getAuthUser, generateId } from '../../../lib/auth'
import { jsonError, sanitizeString, validatePrice, validateInteger } from '../../../lib/validation'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')

  try {
    const db = getDb(env.DB)
    const result = await db.select().from(products).orderBy(desc(products.createdAt)).all()
    return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Products GET error:', err)
    return jsonError(500, 'Failed to load products')
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, 'Invalid request body')

    const name = sanitizeString((body as any).name, 200)
    if (!name) return jsonError(400, 'Product name is required')

    const price = Number((body as any).price) || 0
    const priceErr = validatePrice(price)
    if (priceErr) return jsonError(400, priceErr.message)

    const id = generateId('prod')
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + id.slice(-6)

    await env.DB.prepare(
      `INSERT INTO products (id, name, slug, description, price_cents, compare_at_price_cents, stock, status, image_url, seo_title, seo_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, name, slug,
      sanitizeString((body as any).description, 5000) || null,
      Math.round(price * 100),
      (body as any).compareAtPrice ? Math.round(Number((body as any).compareAtPrice) * 100) : null,
      Math.min(Math.max(0, Number((body as any).stock) || 0), 999999),
      (body as any).status || 'draft',
      sanitizeString((body as any).imageUrl, 500) || null,
      sanitizeString((body as any).seoTitle, 200) || null,
      sanitizeString((body as any).seoDescription, 300) || null
    ).run()

    if ((body as any).variantOptions && Array.isArray((body as any).variantOptions)) {
      const variantOptions = (body as any).variantOptions as Array<{ group: string; value: string }>
      for (const opt of variantOptions) {
        await env.DB.prepare(
          'INSERT INTO variant_options (product_id, group_name, value, sort_order) VALUES (?, ?, ?, ?)'
        ).bind(id, sanitizeString(opt.group, 50), sanitizeString(opt.value, 100), 0).run()
      }

      const groups = [...new Set(variantOptions.map((o) => o.group))]
      const valuesByGroup = groups.map((g) => variantOptions.filter((o) => o.group === g).map((o) => o.value))

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
        ).bind(variantId, id, variantName, Math.min(Math.max(0, Number((body as any).stock) || 0), 999999), Math.round(price * 100)).run()
      }
    }

    return new Response(JSON.stringify({ id, slug }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return jsonError(400, err.message || 'Failed to create product')
  }
}
