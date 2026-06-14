import type { APIRoute } from "astro"
import { getAuthUser } from "../../../lib/auth"
import { jsonError } from "../../../lib/validation"

function getCartId(request: Request): string {
  const cookie = request.headers.get("Cookie") || ""
  const match = cookie.match(/vkrama_cart_id=([^;]+)/)
  if (match) return match[1]
  const auth = request.headers.get("Authorization")
  if (auth?.startsWith("Bearer ")) return "auth-" + auth.slice(7, 32)
  return "anon"
}

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")

  const cartId = getCartId(request)
  const id = env.CART_DO.idFromName(`cart:${cartId}`)
  const stub = env.CART_DO.get(id)
  const cart = await stub.getCart()

  return new Response(JSON.stringify(cart), {
    headers: { "Content-Type": "application/json" },
  })
}
