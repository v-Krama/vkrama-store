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
      `SELECT inv.*, pv.name as variant_name, pv.sku, p.name as product_name, il.name as location_name
       FROM inventory inv
       LEFT JOIN product_variants pv ON inv.variant_id = pv.id
       LEFT JOIN products p ON pv.product_id = p.id
       LEFT JOIN inventory_locations il ON inv.location_id = il.id
       ORDER BY p.name, pv.name`
    ).all<any>()
    return new Response(JSON.stringify(rows.results), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(500, "Failed to load inventory") }
}
