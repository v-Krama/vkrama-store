import type { APIRoute } from "astro"
import { getAuthUser } from "../../../lib/auth"
import { jsonError } from "../../../lib/validation"

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const rows = await env.DB.prepare(
      "SELECT * FROM settings ORDER BY key"
    ).all<any>()
    return new Response(JSON.stringify(rows.results), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(500, "Failed to load settings") }
}

export const PUT: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const body = await request.json() as Record<string, string>
    for (const [key, value] of Object.entries(body)) {
      await env.DB.prepare(
        "UPDATE settings SET value = ?, updated_at = datetime('now') WHERE key = ?"
      ).bind(String(value), key).run()
    }
    await env.CACHE.delete("settings:all").catch(() => {})
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(400, "Failed to update settings") }
}
