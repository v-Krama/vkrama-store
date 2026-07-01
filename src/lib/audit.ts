import { generateId } from "./auth"

export async function logAudit(
  db: D1Database,
  params: {
    actorType: "customer" | "admin" | "system"
    actorId?: string | null
    action: string
    resourceType: string
    resourceId?: string | null
    metadata?: Record<string, unknown> | null
    ipAddress?: string | null
    userAgent?: string | null
  },
): Promise<void> {
  try {
    await db.prepare(
      `INSERT INTO activity_log (id, actor_type, actor_id, action, resource_type, resource_id, metadata, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      generateId("log"),
      params.actorType,
      params.actorId || null,
      params.action,
      params.resourceType,
      params.resourceId || null,
      params.metadata ? JSON.stringify(params.metadata) : null,
      params.ipAddress || null,
      params.userAgent || null,
    ).run()
  } catch (err) {
    console.error("Audit log error:", err)
  }
}
