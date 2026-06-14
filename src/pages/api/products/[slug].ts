import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { products, categories, productCategories, productVariants, variantOptions } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export const GET: APIRoute = async ({ params, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response('Not found', { status: 404 })
  const db = getDb(env.DB)

  const { slug } = params
  if (!slug) return new Response('Not found', { status: 404 })

  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .get()

    if (!product || product.status !== 'active') {
      return new Response('Not found', { status: 404 })
    }

    const cats = await db
      .select({
        id: categories.id, name: categories.name, slug: categories.slug,
      })
      .from(categories)
      .innerJoin(productCategories, eq(categories.id, productCategories.categoryId))
      .where(eq(productCategories.productId, product.id))
      .all()

    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, product.id))
      .orderBy(productVariants.sortOrder)
      .all()

    const vOptions = await db
      .select()
      .from(variantOptions)
      .where(eq(variantOptions.productId, product.id))
      .orderBy(variantOptions.sortOrder)
      .all()

    return new Response(JSON.stringify({ ...product, categories: cats, variants, variantOptions: vOptions }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
