import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { categories, productCategories } from '../../../db/schema'
import { eq, sql } from 'drizzle-orm'

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })
  const db = getDb(env.DB)

  try {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        imageUrl: categories.imageUrl,
        productCount: sql<number>`(SELECT COUNT(*) FROM ${productCategories} WHERE ${productCategories.categoryId} = ${categories.id})`,
      })
      .from(categories)
      .all()

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
    })
  } catch {
    return new Response(JSON.stringify([]), { status: 200 })
  }
}
