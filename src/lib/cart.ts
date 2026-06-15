import { nanoid } from "nanoid"
import { getAuthUser } from "./auth"

const CART_COOKIE = "vkrama_cart_id"
const COOKIE_MAX_AGE = 90 * 24 * 60 * 60 // 90 days

export function generateCartId(): string {
  return `cart_${nanoid(24)}`
}

export function getCartIdFromRequest(request: Request, db?: D1Database): string {
  const cookie = request.headers.get("Cookie") || ""
  const match = cookie.match(new RegExp(`${CART_COOKIE}=([^;]+)`))
  if (match) return match[1]

  const sessionHeader = request.headers.get("X-Cart-Session")
  if (sessionHeader) return sessionHeader

  return generateCartId()
}

export async function getCartIdForAuth(request: Request, db: D1Database): Promise<string> {
  const user = await getAuthUser(request, db, "customer")
  if (user) return `user:${user.id}`

  return getCartIdFromRequest(request, db)
}

export function setCartCookie(cartId: string): string {
  return `${CART_COOKIE}=${cartId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`
}

export function clearCartCookie(): string {
  return `${CART_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}