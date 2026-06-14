import type { APIRoute } from "astro"
import { getAuthUser } from "../../../lib/auth"
import { jsonError } from "../../../lib/validation"
import { getDb } from "../../../lib/db"
import { productVariants, products } from "../../../db/schema"
import { eq } from "drizzle-orm"

function getCartId(request: Request): string {
  const cookie = request.headers.get("Cookie") || ""
  const match = cookie.match(/vkrama_cart_id=([^;]+)/)
  if (match) return match[1]
  const auth = request.headers.get("Authorization")
  if (auth?.startsWith("Bearer ")) return "auth-" + auth.slice(7, 32)
  return "anon"
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")

  const cartId = getCartId(request)
  const body = await request.json().catch(() => null)
  if (!body) return jsonError(400, "Invalid request")

  const { variantId, quantity = 1 } = body as any
  if (!variantId) return jsonError(400, "Variant ID required")

  const qty = Math.min(Math.max(1, Number(quantity) || 1), 100)

  const variant = await getDb(env.DB)
    .select({
      id: productVariants.id,
      productId: productVariants.productId,
      name: productVariants.name,
      priceCents: productVariants.priceCents,
      stock: productVariants.stock,
      imageUrl: productVariants.imageUrl,
      sku: productVariants.sku,
      productName: products.name,
      productSlug: products.slug,
    })
    .from(productVariants)
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(eq(productVariants.id, variantId))
    .get()

  if (!variant) return jsonError(404, "Product not found")
  if (variant.stock < qty) return jsonError(400, "Insufficient stock")

  const id = env.CART_DO.idFromName(`cart:${cartId}`)
  const stub = env.CART_DO.get(id)

  const cart = await stub.addItem({
    variantId: variant.id,
    productId: variant.productId,
    name: variant.productName,
    variantName: variant.name,
    imageUrl: variant.imageUrl,
    priceCents: variant.priceCents,
    quantity: qty,
    maxQuantity: Math.min(variant.stock, 100),
    sku: variant.sku,
  })

  return new Response(JSON.stringify(cart), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `vkrama_cart_id=${cartId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7776000`,
    },
  })
}
