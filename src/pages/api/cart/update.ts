import type { APIRoute } from "astro"
import { jsonError } from "../../../lib/validation"
import { getCartIdFromRequest } from "../../../lib/cart"

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")

  const cartId = getCartIdFromRequest(request)
  const body = await request.json().catch(() => null)
  if (!body) return jsonError(400, "Invalid request")

  const { variantId, action } = body as any
  if (!variantId) return jsonError(400, "Variant ID required")

  const id = env.CART_DO.idFromName(`cart:${cartId}`)
  const stub = env.CART_DO.get(id)

  let cart
  if (action === "remove") {
    cart = await stub.removeItem(variantId)
  } else if (action === "increment") {
    const current = await stub.getCart()
    const item = current.items.find((i: any) => i.variantId === variantId)
    if (!item) return jsonError(404, "Item not in cart")
    cart = await stub.updateQuantity(variantId, item.quantity + 1)
  } else if (action === "decrement") {
    const current = await stub.getCart()
    const item = current.items.find((i: any) => i.variantId === variantId)
    if (!item) return jsonError(404, "Item not in cart")
    if (item.quantity <= 1) {
      cart = await stub.removeItem(variantId)
    } else {
      cart = await stub.updateQuantity(variantId, item.quantity - 1)
    }
  } else if (action === "clear") {
    cart = await stub.clearCart()
  } else {
    return jsonError(400, "Invalid action")
  }

  return new Response(JSON.stringify(cart), {
    headers: { "Content-Type": "application/json" },
  })
}