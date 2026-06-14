import type { APIRoute } from "astro"
import { getAuthUser } from "../../../lib/auth"
import { jsonError } from "../../../lib/validation"

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")

  const customer = await getAuthUser(request, env.DB, "customer")
  if (!customer) return jsonError(401, "Authentication required")

  const body = await request.json().catch(() => null)
  if (!body) return jsonError(400, "Invalid request")

  const { sessionItems } = body as any
  if (!sessionItems || !Array.isArray(sessionItems)) return jsonError(400, "Session items required")

  const userCartId = `user:${customer.id}`
  const id = env.CART_DO.idFromName(`cart:${userCartId}`)
  const stub = env.CART_DO.get(id)

  await stub.setCustomer(customer.id)
  await stub.mergeCarts(sessionItems)
  const cart = await stub.getCart()

  return new Response(JSON.stringify(cart), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `vkrama_cart_id=${userCartId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7776000`,
    },
  })
}
