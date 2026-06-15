import type { APIRoute } from "astro"
import { jsonError } from "../../../lib/validation"
import { getDb } from "../../../lib/db"
import { productVariants, products } from "../../../db/schema"
import { eq } from "drizzle-orm"
import { getCartIdFromRequest, setCartCookie } from "../../../lib/cart"

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")

  const cartId = getCartIdFromRequest(request, env.DB)
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
      "Set-Cookie": setCartCookie(cartId),
    },
  })
}