import type { APIRoute } from "astro"
import { getAuthUser } from "../../../lib/auth"
import { jsonError } from "../../../lib/validation"
import { hasPermission, jsonForbidden } from "../../../lib/admin-auth"
import { nanoid } from "nanoid"

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const rows = await env.DB.prepare(
      `SELECT m.*, (SELECT COUNT(*) FROM menu_items WHERE menu_id = m.id) as item_count
       FROM menus m ORDER BY m.name`
    ).all<any>()
    return new Response(JSON.stringify(rows.results), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(500, "Failed to load menus") }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  if (!hasPermission(user.role, "products:write")) return jsonForbidden()
  try {
    const b = await request.json() as any
    const menuId = "menu_" + nanoid(24)
    await env.DB.prepare(
      "INSERT INTO menus (id, name, location, is_active) VALUES (?, ?, ?, ?)",
    ).bind(menuId, b.name, b.location || "header", b.isActive !== false ? 1 : 0).run()
    if (b.items?.length) {
      for (const item of b.items) {
        if (item.title && item.url) {
          await env.DB.prepare(
            "INSERT INTO menu_items (id, menu_id, title, url, type, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
          ).bind("mi_" + nanoid(16), menuId, item.title, item.url, item.type || "custom", item.sortOrder || 0).run()
        }
      }
    }
    return new Response(JSON.stringify({ id: menuId }), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(400, "Failed to create menu") }
}
