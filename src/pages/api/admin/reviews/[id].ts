import type { APIRoute } from "astro"
import { getAuthUser } from "../../../../lib/auth"
import { jsonError } from "../../../../lib/validation"
import { hasPermission, jsonForbidden } from "../../../../lib/admin-auth"

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  if (!hasPermission(user.role, "reviews:write")) return jsonForbidden()
  try {
    const b = await request.json() as any
    await env.DB.prepare(
      "UPDATE reviews SET is_approved = ? WHERE id = ?",
    ).bind(b.isApproved ? 1 : 0, params.id!).run()
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(400, "Failed to update review") }
}
