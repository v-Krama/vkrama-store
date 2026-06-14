import type { APIRoute } from 'astro'
import { getAuthUser } from '../../../lib/auth'
import { jsonOk, jsonError } from '../../../lib/validation'

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, 'Server error')

  const user = await getAuthUser(request, env.DB, 'customer')
  if (!user) return jsonError(401, 'Unauthorized')

  return jsonOk({ user, userType: user.userType })
}
