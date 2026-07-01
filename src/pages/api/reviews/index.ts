import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { reviews, customers } from '../../../db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import { getAuthUser, generateId } from '../../../lib/auth'
import { rateLimitMiddleware } from '../../../lib/rate-limit'
import { jsonError, jsonOk } from '../../../lib/validation'

export const GET: APIRoute = async ({ url, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const productId = url.searchParams.get('productId')
  if (!productId) return jsonError(400, 'Product ID required')

  const db = getDb(env.DB)
  try {
    const reviewsList = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        body: reviews.body,
        isVerifiedPurchase: reviews.isVerifiedPurchase,
        helpfulCount: reviews.helpfulCount,
        createdAt: reviews.createdAt,
        customerName: customers.name,
      })
      .from(reviews)
      .innerJoin(customers, eq(reviews.customerId, customers.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt))
      .all()

    const stats = await db
      .select({
        avg: sql<number>`AVG(${reviews.rating})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .get()

    return jsonOk({
      reviews: reviewsList,
      stats: {
        average: Number(stats?.avg || 0).toFixed(1),
        count: Number(stats?.count || 0),
      },
    })
  } catch {
    return jsonError(500, 'Failed to load reviews')
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const rl = await rateLimitMiddleware(request, env, { maxRequests: 5, windowMs: 300_000 })
  if (rl) return rl

  const user = await getAuthUser(request, env.DB, 'customer')
  if (!user) return jsonError(401, 'Unauthorized')

  const body = await request.json().catch(() => null)
  const productId = (body as any)?.productId
  const rating = (body as any)?.rating
  const title = (body as any)?.title
  const bodyText = (body as any)?.body

  if (!productId || !rating) return jsonError(400, 'Product ID and rating required')
  if (rating < 1 || rating > 5) return jsonError(400, 'Rating must be 1-5')

  const db = getDb(env.DB)
  try {
    const existing = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.customerId, user.id)))
      .get()

    if (existing) return jsonError(409, 'You have already reviewed this product')

    const id = generateId('rev')
    await env.DB.prepare(
      'INSERT INTO reviews (id, product_id, customer_id, rating, title, body) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, productId, user.id, rating, title || null, bodyText || null).run()

    return jsonOk({ id, message: 'Review submitted' })
  } catch {
    return jsonError(500, 'Failed to submit review')
  }
}
