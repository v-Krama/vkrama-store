import type { APIRoute } from "astro"
import { getDb } from "../../../lib/db"
import { products, productVariants } from "../../../db/schema"
import { desc, eq, sql } from "drizzle-orm"
import { generateId } from "../../../lib/auth"
import { jsonError, sanitizeString } from "../../../lib/validation"
import { invalidateProductCache } from "../../../services/cache"
import { getAdminUser, hasPermission, jsonForbidden } from "../../../lib/admin-auth"

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 })

  const user = await getAdminUser(request, env.DB)
  if (!user) return jsonError(401, "Unauthorized")

  try {
    const db = getDb(env.DB)
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        brand: products.brand,
        tags: products.tags,
        isFeatured: products.isFeatured,
        isPhysical: products.isPhysical,
        status: products.status,
        sortOrder: products.sortOrder,
        seoTitle: products.seoTitle,
        seoDescription: products.seoDescription,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        minPrice: sql<number>`MIN(${productVariants.priceCents})`,
        maxPrice: sql<number>`MAX(${productVariants.priceCents})`,
        variantCount: sql<number>`COUNT(${productVariants.id})`,
        totalStock: sql<number>`COALESCE(SUM(${productVariants.stock}), 0)`,
        defaultImage: sql<string>`MIN(${productVariants.imageUrl})`,
      })
      .from(products)
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .groupBy(products.id)
      .orderBy(desc(products.createdAt))
      .all()

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("Products GET error:", err)
    return jsonError(500, "Failed to load products")
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")

  const user = await getAdminUser(request, env.DB)
  if (!user) return jsonError(401, "Unauthorized")
  if (!hasPermission(user.role, "products:write")) return jsonForbidden()

  try {
    const body = await request.json().catch(() => null)
    if (!body) return jsonError(400, "Invalid request body")

    const b = body as any
    const name = sanitizeString(b.name, 200)
    if (!name) return jsonError(400, "Product name is required")

    const id = generateId("prod")
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + id.slice(-6)

    await env.DB.prepare(
      `INSERT INTO products (id, name, slug, description, brand, tags, is_featured, is_physical, status, sort_order, gtin, hs_code, origin_country, seo_title, seo_description, weight, weight_unit, min_order_qty, max_order_qty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        name,
        slug,
        sanitizeString(b.description, 5000) || null,
        sanitizeString(b.brand, 100) || null,
        JSON.stringify(b.tags || []),
        b.isFeatured ? 1 : 0,
        b.isPhysical !== false ? 1 : 0,
        b.status || "draft",
        Math.max(0, Number(b.sortOrder) || 0),
        sanitizeString(b.gtin, 50) || null,
        sanitizeString(b.hsCode, 20) || null,
        sanitizeString(b.originCountry, 100) || null,
        sanitizeString(b.seoTitle, 200) || null,
        sanitizeString(b.seoDescription, 300) || null,
        b.weight ? Number(b.weight) : null,
        b.weightUnit || "kg",
        Math.max(1, Number(b.minOrderQty) || 1),
        b.maxOrderQty ? Math.max(1, Number(b.maxOrderQty)) : null,
      )
      .run()

    const priceCents = b.priceCents || (b.price ? Math.round(Number(b.price) * 100) : 0)
    const stock = Math.min(Math.max(0, Number(b.stock) || 0), 999999)

    if (b.variants && Array.isArray(b.variants) && b.variants.length > 0) {
      for (const v of b.variants) {
        const variantId = generateId("var")
        await env.DB.prepare(
          `INSERT INTO product_variants (id, product_id, name, sku, barcode, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            variantId,
            id,
            sanitizeString(v.name, 200) || "Default",
            sanitizeString(v.sku, 100) || null,
            sanitizeString(v.barcode, 100) || null,
            v.priceCents || priceCents,
            v.compareAtPriceCents || null,
            v.costCents || null,
            Math.min(Math.max(0, Number(v.stock) || stock), 999999),
            v.weight || null,
            sanitizeString(v.imageUrl, 500) || null,
            v.isActive !== false ? 1 : 0,
            Math.max(0, Number(v.sortOrder) || 0),
          )
          .run()
      }
    } else {
      const variantId = generateId("var")
      await env.DB.prepare(
        `INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, image_url, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          variantId,
          id,
          "Default",
          sanitizeString(b.sku, 100) || null,
          priceCents,
          b.compareAtPriceCents || null,
          b.costCents || null,
          stock,
          sanitizeString(b.imageUrl, 500) || null,
          1,
        )
        .run()
    }

    if (b.variantOptions && Array.isArray(b.variantOptions)) {
      for (let i = 0; i < b.variantOptions.length; i++) {
        const opt = b.variantOptions[i]
        await env.DB.prepare(
          "INSERT INTO variant_options (product_id, group_name, value, sort_order) VALUES (?, ?, ?, ?)",
        )
          .bind(id, sanitizeString(opt.group, 50), sanitizeString(opt.value, 100), i)
          .run()
      }
    }

    return new Response(JSON.stringify({ id, slug }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err: any) {
    console.error("Product create error:", err)
    return jsonError(400, err.message || "Failed to create product")
  }
}
