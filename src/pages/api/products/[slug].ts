import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { products, productVariants, variantOptions, productCategories, categories } from '../../../db/schema'
import { eq, asc } from 'drizzle-orm'

export const GET: APIRoute = async ({ params, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response('Not found', { status: 404 })

  const db = getDb(env.DB)

  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, params.slug!))
      .get()

    if (!product || product.status !== 'active') {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
    }

    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, product.id))
      .orderBy(asc(productVariants.sortOrder))
      .all()

    const opts = await db
      .select()
      .from(variantOptions)
      .where(eq(variantOptions.productId, product.id))
      .orderBy(asc(variantOptions.sortOrder))
      .all()

    const cats = await db
      .select({ name: categories.name, slug: categories.slug })
      .from(categories)
      .innerJoin(productCategories, eq(categories.id, productCategories.categoryId))
      .where(eq(productCategories.productId, product.id))
      .all()

    return new Response(JSON.stringify({ ...product, variants, variantOptions: opts, categories: cats }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  }
}
