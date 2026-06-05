import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { products, productCategories, categories } from '../../../db/schema'
import { eq, and, like } from 'drizzle-orm'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })
  const db = getDb(env.DB)

  const url = new URL(request.url)
  const categorySlug = url.searchParams.get('category')
  const search = url.searchParams.get('q')
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50)

  try {
    let query = db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        priceCents: products.priceCents,
        compareAtPriceCents: products.compareAtPriceCents,
        stock: products.stock,
        imageUrl: products.imageUrl,
        status: products.status,
        description: products.description,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(and(eq(products.status, 'active'), ...(search ? [like(products.name, `%${search}%`)] : [])))
      .limit(limit)

    if (categorySlug) {
      const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)).get()
      if (cat) {
        query = db
          .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            priceCents: products.priceCents,
            compareAtPriceCents: products.compareAtPriceCents,
            stock: products.stock,
            imageUrl: products.imageUrl,
            status: products.status,
            description: products.description,
            createdAt: products.createdAt,
          })
          .from(products)
          .innerJoin(productCategories, eq(products.id, productCategories.productId))
          .where(and(eq(products.status, 'active'), eq(productCategories.categoryId, cat.id), ...(search ? [like(products.name, `%${search}%`)] : [])))
          .limit(limit)
      }
    }

    const result = await query.all()
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
    })
  } catch {
    return new Response(JSON.stringify([]), { status: 200 })
  }
}
