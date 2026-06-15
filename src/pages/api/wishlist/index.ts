import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { wishlists, wishlistItems, products, productVariants } from '../../../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { getAuthUser, generateId } from '../../../lib/auth'
import { jsonError, jsonOk } from '../../../lib/validation'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'customer')
  if (!user) return jsonError(401, 'Unauthorized')

  const db = getDb(env.DB)
  try {
    const wishlist = await db
      .select()
      .from(wishlists)
      .where(eq(wishlists.customerId, user.id))
      .get()

    if (!wishlist) return jsonOk([])

    const items = await db
      .select({
        id: wishlistItems.id,
        productId: wishlistItems.productId,
        variantId: wishlistItems.variantId,
        createdAt: wishlistItems.createdAt,
        productName: products.name,
        productSlug: products.slug,
        productPrice: products.priceCents,
        productCompareAt: products.compareAtPriceCents,
        productImage: products.imageUrl,
        productStatus: products.status,
      })
      .from(wishlistItems)
      .innerJoin(products, eq(wishlistItems.productId, products.id))
      .where(eq(wishlistItems.wishlistId, wishlist.id))
      .orderBy(desc(wishlistItems.createdAt))
      .all()

    return jsonOk(items)
  } catch {
    return jsonError(500, 'Failed to load wishlist')
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'customer')
  if (!user) return jsonError(401, 'Unauthorized')

  const body = await request.json().catch(() => null)
  const productId = (body as any)?.productId
  if (!productId) return jsonError(400, 'Product ID required')

  const db = getDb(env.DB)
  try {
    let wishlist = await db
      .select()
      .from(wishlists)
      .where(eq(wishlists.customerId, user.id))
      .get()

    if (!wishlist) {
      const id = generateId('wish')
      await env.DB.prepare(
        'INSERT INTO wishlists (id, customer_id) VALUES (?, ?)'
      ).bind(id, user.id).run()
      wishlist = { id, customerId: user.id, name: 'Default', isPublic: false, createdAt: null, updatedAt: null }
    }

    const existing = await db
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.wishlistId, wishlist.id),
          eq(wishlistItems.productId, productId),
        )
      )
      .get()

    if (existing) {
      await env.DB.prepare(
        'DELETE FROM wishlist_items WHERE id = ?'
      ).bind(existing.id).run()
      return jsonOk({ removed: true })
    }

    const itemId = generateId('wish')
    await env.DB.prepare(
      'INSERT INTO wishlist_items (id, wishlist_id, product_id) VALUES (?, ?, ?)'
    ).bind(itemId, wishlist.id, productId).run()

    return jsonOk({ added: true, id: itemId })
  } catch {
    return jsonError(500, 'Failed to update wishlist')
  }
}
