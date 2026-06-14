import type { APIRoute } from 'astro'
import { getAuthUser, generateId } from '../../../../lib/auth'
import { jsonError, sanitizeString, validatePrice } from '../../../../lib/validation'

export const GET: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')

  const id = params.id
  if (!id) return jsonError(400, 'Product ID required')

  try {
    const product = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()
    if (!product) return jsonError(404, 'Product not found')

    const variantOptions = await env.DB.prepare(
      'SELECT * FROM variant_options WHERE product_id = ? ORDER BY sort_order, id'
    ).bind(id).all()
    const productVariants = await env.DB.prepare(
      'SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order, id'
    ).bind(id).all()

    return new Response(
      JSON.stringify({ ...product, variantOptions: variantOptions.results, productVariants: productVariants.results }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Product GET error:', err)
    return jsonError(500, 'Failed to load product')
  }
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')

  const id = params.id
  if (!id) return jsonError(400, 'Product ID required')

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, 'Invalid request body')

    const price = Number((body as any).price) || 0
    await env.DB.prepare(
      `UPDATE products SET name = ?, description = ?, price_cents = ?, compare_at_price_cents = ?, stock = ?, status = ?, image_url = ?, seo_title = ?, seo_description = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(
      sanitizeString((body as any).name, 200),
      sanitizeString((body as any).description, 5000) || null,
      Math.round(price * 100),
      (body as any).compareAtPrice ? Math.round(Number((body as any).compareAtPrice) * 100) : null,
      Math.min(Math.max(0, Number((body as any).stock) || 0), 999999),
      (body as any).status || 'draft',
      sanitizeString((body as any).imageUrl, 500) || null,
      sanitizeString((body as any).seoTitle, 200) || null,
      sanitizeString((body as any).seoDescription, 300) || null,
      id
    ).run()

    if ((body as any).variantOptions) {
      await env.DB.prepare('DELETE FROM variant_options WHERE product_id = ?').bind(id).run()
      await env.DB.prepare('DELETE FROM product_variants WHERE product_id = ?').bind(id).run()

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

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return jsonError(400, err.message || 'Failed to update product')
  }
}

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'admin')
  if (!user) return jsonError(401, 'Unauthorized')

  const id = params.id
  if (!id) return jsonError(400, 'Product ID required')

  try {
    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return jsonError(400, err.message || 'Failed to delete product')
  }
}
