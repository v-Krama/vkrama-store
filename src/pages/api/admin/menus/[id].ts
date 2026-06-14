import type { APIRoute } from "astro"
import { getAuthUser } from "../../../../lib/auth"
import { jsonError } from "../../../../lib/validation"

export const GET: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const menu = await env.DB.prepare("SELECT * FROM menus WHERE id = ?").bind(params.id!).first<any>()
    if (!menu) return jsonError(404, "Not found")
    const items = await env.DB.prepare(
      "SELECT * FROM menu_items WHERE menu_id = ? ORDER BY sort_order"
    ).bind(params.id!).all<any>()
    return new Response(JSON.stringify({ ...menu, items: items.results }), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(500, "Failed to load menu") }
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const b = await request.json() as any
    await env.DB.prepare(
      "UPDATE menus SET name=?, location=?, is_active=? WHERE id=?",
    ).bind(b.name, b.location || "header", b.isActive !== false ? 1 : 0, params.id!).run()
    await env.DB.prepare("DELETE FROM menu_items WHERE menu_id = ?").bind(params.id!).run()
    if (b.items?.length) {
      for (const item of b.items) {
        if (item.title && item.url) {
          await env.DB.prepare(
            "INSERT INTO menu_items (id, menu_id, title, url, type, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
          ).bind("mi_" + Math.random().toString(36).slice(2, 10), params.id!, item.title, item.url, item.type || "custom", item.sortOrder || 0).run()
        }
      }
    }
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(400, "Failed to update menu") }
}
