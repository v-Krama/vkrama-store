import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'
import { coupons } from '../../../db/schema'
import { eq, and, lte, gte, or } from 'drizzle-orm'
import { getAuthUser } from '../../../lib/auth'
import { jsonError, jsonOk } from '../../../lib/validation'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  try {
    const body = await request.json().catch(() => null)
    const code = (body as any)?.code?.toUpperCase().trim()
    const subtotalCents = (body as any)?.subtotalCents || 0

    if (!code) return jsonError(400, 'Coupon code required')

    const db = getDb(env.DB)
    const now = new Date().toISOString()
    const coupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code))
      .get()

    if (!coupon) return jsonError(404, 'Invalid coupon code')
    if (!coupon.isActive) return jsonError(400, 'This coupon is no longer active')

    if (coupon.startsAt && coupon.startsAt > now) {
      return jsonError(400, 'This coupon is not yet valid')
    }
    if (coupon.endsAt && coupon.endsAt < now) {
      return jsonError(400, 'This coupon has expired')
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return jsonError(400, 'This coupon has reached its usage limit')
    }

    if (coupon.minOrderCents && subtotalCents < coupon.minOrderCents) {
      return jsonError(400, `Minimum order of Rs. ${(coupon.minOrderCents / 100).toFixed(0)} required`)
    }

    if (coupon.perCustomerLimit) {
      const user = await getAuthUser(request, env.DB, 'customer')
      if (user) {
        const usageCount = await env.DB.prepare(
          'SELECT COUNT(*) as count FROM coupon_usages WHERE coupon_id = ? AND customer_id = ?'
        ).bind(coupon.id, user.id).first() as any
        if (usageCount && usageCount.count >= coupon.perCustomerLimit) {
          return jsonError(400, 'You have already used this coupon')
        }
      }
    }

    let discountCents = 0
    if (coupon.type === 'percent' && coupon.valuePercent) {
      discountCents = Math.round(subtotalCents * (coupon.valuePercent / 100))
    } else if (coupon.type === 'fixed' && coupon.valueCents) {
      discountCents = coupon.valueCents
    }

    if (coupon.maxDiscountCents && discountCents > coupon.maxDiscountCents) {
      discountCents = coupon.maxDiscountCents
    }

    discountCents = Math.min(discountCents, subtotalCents)

    return jsonOk({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      discountCents,
      description: coupon.description,
    })
  } catch {
    return jsonError(400, 'Failed to validate coupon')
  }
}
