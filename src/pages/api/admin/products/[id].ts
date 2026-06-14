import type { APIRoute } from "astro"
import { getDb } from "../../../../lib/db"
import { products, productVariants } from "../../../../db/schema"
import { eq, sql } from "drizzle-orm"
import { getAuthUser } from "../../../../lib/auth"
import { jsonError, sanitizeString } from "../../../../lib/validation"
import { invalidateProductCache } from "../../../../services/cache"

export const GET: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")

  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")

  try {
    const db = getDb(env.DB)
    const product = await db.select().from(products).where(eq(products.id, params.id!)).get()
    if (!product) return jsonError(404, "Product not found")

    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, product.id))
      .orderBy(productVariants.sortOrder)
      .all()

    return new Response(JSON.stringify({ ...product, variants }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return jsonError(500, "Failed to load product")
  }
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")

  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, "Invalid request body")

    const b = body as any
    const productId = params.id!

    await env.DB.prepare(
      `UPDATE products SET name = ?, description = ?, brand = ?, tags = ?, is_featured = ?, is_physical = ?, status = ?, sort_order = ?, seo_title = ?, seo_description = ?, gtin = ?, hs_code = ?, origin_country = ?, weight = ?, weight_unit = ?, min_order_qty = ?, max_order_qty = ?, updated_at = datetime('now')
       WHERE id = ?`,
    )
      .bind(
        sanitizeString(b.name, 200),
        sanitizeString(b.description, 5000) || null,
        sanitizeString(b.brand, 100) || null,
        JSON.stringify(b.tags || []),
        b.isFeatured ? 1 : 0,
        b.isPhysical !== false ? 1 : 0,
        b.status || "draft",
        Math.max(0, Number(b.sortOrder) || 0),
        sanitizeString(b.seoTitle, 200) || null,
        sanitizeString(b.seoDescription, 300) || null,
        sanitizeString(b.gtin, 50) || null,
        sanitizeString(b.hsCode, 20) || null,
        sanitizeString(b.originCountry, 100) || null,
        b.weight ? Number(b.weight) : null,
        b.weightUnit || "kg",
        Math.max(1, Number(b.minOrderQty) || 1),
        b.maxOrderQty ? Math.max(1, Number(b.maxOrderQty)) : null,
        productId,
      )
      .run()

    const product = await getDb(env.DB).select().from(products).where(eq(products.id, productId)).get()
    if (product) {
      await invalidateProductCache(env.CACHE, product.slug)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err: any) {
    return jsonError(400, err.message || "Failed to update product")
  }
}

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")

  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")

  try {
    const product = await getDb(env.DB).select().from(products).where(eq(products.id, params.id!)).get()
    if (!product) return jsonError(404, "Product not found")

    await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(params.id!).run()
    await invalidateProductCache(env.CACHE, product.slug)

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return jsonError(500, "Failed to delete product")
  }
}
