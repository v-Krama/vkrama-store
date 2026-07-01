import type { APIRoute } from "astro"
import { getAuthUser } from "../../../../lib/auth"
import { jsonError } from "../../../../lib/validation"
import { hasPermission, jsonForbidden } from "../../../../lib/admin-auth"

export const GET: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const row = await env.DB.prepare("SELECT * FROM pages WHERE id = ?").bind(params.id!).first<any>()
    if (!row) return jsonError(404, "Not found")
    return new Response(JSON.stringify(row), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(500, "Failed to load page") }
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  if (!hasPermission(user.role, "products:write")) return jsonForbidden()
  try {
    const b = await request.json() as any
    await env.DB.prepare(
      `UPDATE pages SET title=?, slug=?, content=?, meta_title=?, meta_description=?, is_published=?, published_at=CASE WHEN ? THEN COALESCE(published_at, datetime('now')) ELSE NULL END, updated_at=datetime('now') WHERE id=?`,
    ).bind(b.title, b.slug, b.content || null, b.metaTitle || null, b.metaDescription || null, b.isPublished ? 1 : 0, b.isPublished ? 1 : 0, params.id!).run()
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(400, "Failed to update page") }
}
