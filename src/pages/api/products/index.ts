import type { APIRoute } from "astro"
import { getDb } from "../../../lib/db"
import { products, productCategories, categories, productVariants } from "../../../db/schema"
import { eq, and, like, desc, asc, sql } from "drizzle-orm"
import { cacheGetOrSet, CacheKeys } from "../../../services/cache"

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })
  const db = getDb(env.DB)

  const url = new URL(request.url)
  const categorySlug = url.searchParams.get("category")
  const search = url.searchParams.get("q")
  const sort = url.searchParams.get("sort") || "newest"
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50)
  const featured = url.searchParams.get("featured")

  const cacheKey = CacheKeys.productList(JSON.stringify({ categorySlug, search, sort, limit, featured }))

  try {
    return new Response(
      await cacheGetOrSet(env.CACHE, cacheKey, async () => {
        let orderBy = desc(products.createdAt)
        if (sort === "price-asc") orderBy = asc(productVariants.priceCents)
        else if (sort === "price-desc") orderBy = desc(productVariants.priceCents)
        else if (sort === "name") orderBy = asc(products.name)

        const conditions = [eq(products.status, "active")]

        if (featured === "true") conditions.push(eq(products.isFeatured, true as any))
        if (search) conditions.push(like(products.name, `%${search}%`))

        let result: any[]

        if (categorySlug) {
          const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)).get()
          if (!cat) return "[]"

          conditions.push(eq(productCategories.categoryId, cat.id))

          result = await db
            .select({
              id: products.id,
              name: products.name,
              slug: products.slug,
              description: products.description,
              brand: products.brand,
              tags: products.tags,
              isFeatured: products.isFeatured,
              status: products.status,
              createdAt: products.createdAt,
              variantId: productVariants.id,
              variantName: productVariants.name,
              priceCents: productVariants.priceCents,
              compareAtPriceCents: productVariants.compareAtPriceCents,
              stock: productVariants.stock,
              imageUrl: productVariants.imageUrl,
              sortOrder: productVariants.sortOrder,
              minPrice: sql<number>`MIN(${productVariants.priceCents})`,
              maxPrice: sql<number>`MAX(${productVariants.priceCents})`,
              variantCount: sql<number>`COUNT(${productVariants.id})`,
              totalStock: sql<number>`SUM(${productVariants.stock})`,
            })
            .from(products)
            .innerJoin(productCategories, eq(products.id, productCategories.productId))
            .innerJoin(productVariants, eq(products.id, productVariants.productId))
            .where(and(...conditions))
            .groupBy(products.id)
            .orderBy(orderBy)
            .limit(limit)
            .all()
        } else {
          result = await db
            .select({
              id: products.id,
              name: products.name,
              slug: products.slug,
              description: products.description,
              brand: products.brand,
              tags: products.tags,
              isFeatured: products.isFeatured,
              status: products.status,
              createdAt: products.createdAt,
              minPrice: sql<number>`MIN(${productVariants.priceCents})`,
              maxPrice: sql<number>`MAX(${productVariants.priceCents})`,
              variantCount: sql<number>`COUNT(${productVariants.id})`,
              totalStock: sql<number>`SUM(${productVariants.stock})`,
              imageUrl: sql<string>`MIN(${productVariants.imageUrl})`,
            })
            .from(products)
            .innerJoin(productVariants, eq(products.id, productVariants.productId))
            .where(and(...conditions))
            .groupBy(products.id)
            .orderBy(orderBy)
            .limit(limit)
            .all()
        }

        return JSON.stringify(result)
      }, 60),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
        },
      },
    )
  } catch (error) {
    console.error("Products API error:", error)
    return new Response(JSON.stringify([]), { status: 200 })
  }
}
