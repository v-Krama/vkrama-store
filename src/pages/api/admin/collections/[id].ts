import type { APIRoute } from "astro"
import { getAuthUser } from "../../../../lib/auth"
import { jsonError } from "../../../../lib/validation"

export const GET: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const row = await env.DB.prepare("SELECT * FROM collections WHERE id = ?").bind(params.id!).first<any>()
    if (!row) return jsonError(404, "Not found")
    return new Response(JSON.stringify(row), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(500, "Failed to load collection") }
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const b = await request.json() as any
    await env.DB.prepare(
      "UPDATE collections SET name=?, slug=?, description=?, image_url=?, is_active=?, sort_order=?, updated_at=datetime('now') WHERE id=?",
    ).bind(b.name, b.slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), b.description || null, b.imageUrl || null, b.isActive ? 1 : 0, b.sortOrder || 0, params.id!).run()
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(400, "Failed to update collection") }
}
