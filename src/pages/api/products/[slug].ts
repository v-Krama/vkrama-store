import type { APIRoute } from "astro"
import { getDb } from "../../../lib/db"
import { products, categories, productCategories, productVariants, variantOptions, variantOptionLinks, reviews } from "../../../db/schema"
import { eq, desc } from "drizzle-orm"
import { cacheGetOrSet, CacheKeys } from "../../../services/cache"

export const GET: APIRoute = async ({ params, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response("Not found", { status: 404 })
  const db = getDb(env.DB)

  const { slug } = params
  if (!slug) return new Response("Not found", { status: 404 })

  try {
    const data = await cacheGetOrSet(env.CACHE, CacheKeys.product(slug), async () => {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug))
        .get()

      if (!product || product.status !== "active") return null

      const cats = await db
        .select({ id: categories.id, name: categories.name, slug: categories.slug })
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

      const vOptionLinks = await db
        .select()
        .from(variantOptionLinks)
        .innerJoin(variantOptions, eq(variantOptionLinks.optionId, variantOptions.id))
        .where(eq(variantOptions.productId, product.id))
        .all()

      const productReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, product.id))
        .orderBy(desc(reviews.createdAt))
        .all()

      const avgRating = productReviews.length
        ? Math.round(productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length * 10) / 10
        : null

      return JSON.stringify({
        ...product,
        categories: cats,
        variants,
        variantOptions: vOptions,
        variantOptionLinks: vOptionLinks,
        reviews: productReviews,
        avgRating,
        reviewCount: productReviews.length,
      })
    }, 120)

    if (!data) return new Response("Not found", { status: 404 })

    return new Response(data, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}
