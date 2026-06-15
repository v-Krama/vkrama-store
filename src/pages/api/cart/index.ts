import type { APIRoute } from "astro"
import { jsonError } from "../../../lib/validation"
import { getCartIdFromRequest } from "../../../lib/cart"

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")

  const cartId = getCartIdFromRequest(request)
  const id = env.CART_DO.idFromName(`cart:${cartId}`)
  const stub = env.CART_DO.get(id)
  const cart = await stub.getCart()

  return new Response(JSON.stringify(cart), {
    headers: { "Content-Type": "application/json" },
  })
}