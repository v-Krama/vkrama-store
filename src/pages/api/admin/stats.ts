import type { APIRoute } from 'astro'
import { checkAdminAuth } from '../../../lib/auth'

export const GET: APIRoute = async ({ request, locals }) => {
  if (!(await checkAdminAuth(request))) return new Response('Unauthorized', { status: 401 })

  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({}), { status: 200 })

  try {
    const totalRevenue = await env.DB.prepare("SELECT COALESCE(SUM(total_cents), 0) as total FROM orders WHERE status IN ('paid','processing','shipped','delivered')").first() as any
    const totalOrders = await env.DB.prepare('SELECT COUNT(*) as count FROM orders').first() as any
    const totalProducts = await env.DB.prepare('SELECT COUNT(*) as count FROM products').first() as any
    const activeProducts = await env.DB.prepare("SELECT COUNT(*) as count FROM products WHERE status = 'active'").first() as any
    const totalCustomers = await env.DB.prepare('SELECT COUNT(*) as count FROM customers').first() as any
    const pendingOrders = await env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").first() as any
    const recentOrders = await env.DB.prepare('SELECT id, total_cents, status, created_at, email FROM orders ORDER BY created_at DESC LIMIT 5').all()

    return new Response(JSON.stringify({
      totalRevenueCents: totalRevenue?.total || 0,
      totalOrders: totalOrders?.count || 0,
      totalProducts: totalProducts?.count || 0,
      activeProducts: activeProducts?.count || 0,
      totalCustomers: totalCustomers?.count || 0,
      pendingOrders: pendingOrders?.count || 0,
      recentOrders: recentOrders.results,
    }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Stats API error:', err)
    return new Response(JSON.stringify({ error: 'Failed to load dashboard stats' }), { status: 500 })
  }
}
