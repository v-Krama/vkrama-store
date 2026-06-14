import type { APIRoute } from "astro"
import { getAuthUser } from "../../../lib/auth"
import { jsonError } from "../../../lib/validation"
import { nanoid } from "nanoid"

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const rows = await env.DB.prepare("SELECT * FROM pages ORDER BY updated_at DESC").all<any>()
    return new Response(JSON.stringify(rows.results), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(500, "Failed to load pages") }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const b = await request.json() as any
    const id = "page_" + nanoid(24)
    await env.DB.prepare(
      `INSERT INTO pages (id, title, slug, content, meta_title, meta_description, is_published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CASE WHEN ? THEN datetime('now') ELSE NULL END)`,
    ).bind(id, b.title, b.slug, b.content || null, b.metaTitle || null, b.metaDescription || null, b.isPublished ? 1 : 0, b.isPublished ? 1 : 0).run()
    return new Response(JSON.stringify({ id }), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(400, "Failed to create page") }
}
