import { getAuthUser } from "./auth"

export type AdminRole = "superadmin" | "admin" | "manager" | "support"

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  superadmin: 4,
  admin: 3,
  manager: 2,
  support: 1,
}

const PERMISSIONS: Record<string, AdminRole[]> = {
  "products:write": ["superadmin", "admin", "manager"],
  "products:delete": ["superadmin", "admin"],
  "orders:write": ["superadmin", "admin", "manager"],
  "orders:delete": ["superadmin"],
  "customers:read": ["superadmin", "admin", "manager", "support"],
  "customers:write": ["superadmin", "admin"],
  "customers:delete": ["superadmin"],
  "coupons:write": ["superadmin", "admin"],
  "settings:write": ["superadmin"],
  "admins:write": ["superadmin"],
  "reviews:write": ["superadmin", "admin", "manager"],
  "inventory:write": ["superadmin", "admin", "manager"],
}

export async function getAdminUser(request: Request, db: D1Database) {
  return getAuthUser(request, db, "admin")
}

export function hasPermission(role: string | undefined, permission: string): boolean {
  if (!role) return false
  const allowedRoles = PERMISSIONS[permission]
  if (!allowedRoles) return false
  return allowedRoles.includes(role as AdminRole)
}

export function requireRole(minRole: AdminRole) {
  return (role: string | undefined): boolean => {
    if (!role) return false
    const userLevel = ROLE_HIERARCHY[role as AdminRole] || 0
    const requiredLevel = ROLE_HIERARCHY[minRole]
    return userLevel >= requiredLevel
  }
}

export function jsonForbidden(message = "Insufficient permissions"): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  })
}