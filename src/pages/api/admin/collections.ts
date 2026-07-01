import type { APIRoute } from "astro"
import { getAuthUser } from "../../../lib/auth"
import { jsonError } from "../../../lib/validation"
import { getDb } from "../../../lib/db"
import { collections, collectionProducts } from "../../../db/schema"
import { eq, desc, sql } from "drizzle-orm"
import { nanoid } from "nanoid"
import { hasPermission, jsonForbidden } from "../../../lib/admin-auth"

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const result = await getDb(env.DB).select({
      id: collections.id, name: collections.name, slug: collections.slug,
      description: collections.description, imageUrl: collections.imageUrl,
      isActive: collections.isActive, sortOrder: collections.sortOrder,
      createdAt: collections.createdAt,
      productCount: sql<number>`COUNT(${collectionProducts.productId})`,
    }).from(collections)
      .leftJoin(collectionProducts, eq(collections.id, collectionProducts.collectionId))
      .groupBy(collections.id).orderBy(collections.sortOrder).all()
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(500, "Failed to load collections") }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  if (!hasPermission(user.role, "products:write")) return jsonForbidden()
  try {
    const b = await request.json() as any
    const id = "coll_" + nanoid(24)
    const slug = b.slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    await env.DB.prepare(
      "INSERT INTO collections (id, name, slug, description, image_url, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).bind(id, b.name, slug, b.description || null, b.imageUrl || null, b.isActive ? 1 : 0, b.sortOrder || 0).run()
    return new Response(JSON.stringify({ id }), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(400, "Failed to create collection") }
}
