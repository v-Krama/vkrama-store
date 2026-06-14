import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { products, productCategories, categories } from '../../../db/schema'
import { eq, and, like, desc, asc } from 'drizzle-orm'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })
  const db = getDb(env.DB)

  const url = new URL(request.url)
  const categorySlug = url.searchParams.get('category')
  const search = url.searchParams.get('q')
  const sort = url.searchParams.get('sort') || 'newest'
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50)

  try {
    let orderBy = desc(products.createdAt)
    if (sort === 'price-asc') orderBy = asc(products.priceCents)
    else if (sort === 'price-desc') orderBy = desc(products.priceCents)
    else if (sort === 'name') orderBy = asc(products.name)

    const selectFields = {
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
    }

    if (categorySlug) {
      const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)).get()
      if (cat) {
        const conditions = [eq(products.status, 'active'), eq(productCategories.categoryId, cat.id)]
        if (search) conditions.push(like(products.name, `%${search}%`))

        const result = await db
          .select(selectFields)
          .from(products)
          .innerJoin(productCategories, eq(products.id, productCategories.productId))
          .where(and(...conditions))
          .orderBy(orderBy)
          .limit(limit)
          .all()

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
        })
      }
    }

    const conditions = [eq(products.status, 'active')]
    if (search) conditions.push(like(products.name, `%${search}%`))

    const result = await db
      .select(selectFields)
      .from(products)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .all()

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
    })
  } catch {
    return new Response(JSON.stringify([]), { status: 200 })
  }
}
