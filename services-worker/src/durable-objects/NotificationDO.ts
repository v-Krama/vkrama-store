import { DurableObject } from "cloudflare:workers"

interface Notification {
  id: string
  type: "order_update" | "payment" | "shipping" | "promotion" | "system"
  title: string
  body: string
  data: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
}

interface UserSession {
  ws: WebSocket
  customerId: string | null
}

export class NotificationDO extends DurableObject<{ notifications: Notification[] }> {
  private notifications: Notification[] = []
  private sessions: Map<string, UserSession> = new Map()
  private alarmScheduled = false

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    ctx.blockConcurrencyWhile(async () => {
      const stored = await ctx.storage.get<Notification[]>("notifications")
      if (stored) this.notifications = stored
    })
  }

  private async persist() {
    await this.ctx.storage.put("notifications", this.notifications.slice(-100))
  }

  private async scheduleAlarm() {
    if (!this.alarmScheduled) {
      await this.ctx.storage.setAlarm(Date.now() + 60000)
      this.alarmScheduled = true
    }
  }

  async alarm() {
    this.alarmScheduled = false
    for (const [userId, session] of this.sessions) {
      try {
        session.ws.ping()
      } catch {
        this.sessions.delete(userId)
      }
    }
    if (this.sessions.size > 0) {
      await this.scheduleAlarm()
    }
  }

  async connect(userId: string, customerId: string | null): Promise<WebSocket> {
    const pair = new WebSocketPair()
    const [client, server] = Object.values(pair)

    this.sessions.set(userId, { ws: server, customerId })

    server.accept()
    server.addEventListener("close", () => {
      this.sessions.delete(userId)
    })

    const unread = this.notifications.filter((n) => !n.isRead).slice(-10)
    if (unread.length > 0) {
      server.send(JSON.stringify({ type: "unread", notifications: unread }))
    }

    await this.scheduleAlarm()
    return client
  }

  async notify(notification: Omit<Notification, "isRead" | "createdAt">) {
    const full: Notification = {
      ...notification,
      isRead: false,
      createdAt: new Date().toISOString(),
    }
    this.notifications.push(full)
    await this.persist()

    for (const [userId, session] of this.sessions) {
      try {
        session.ws.send(JSON.stringify({ type: "notification", notification: full }))
      } catch {
        this.sessions.delete(userId)
      }
    }
  }

  async getNotifications(customerId: string | null, limit = 20): Promise<Notification[]> {
    let filtered = this.notifications
    if (customerId) {
      filtered = filtered.filter(
        (n) => n.data?.customerId === customerId || n.type === "promotion" || n.type === "system",
      )
    }
    return filtered.slice(-limit).reverse()
  }

  async markAsRead(notificationId: string) {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.isRead = true
      await this.persist()
    }
  }

  async markAllAsRead() {
    for (const n of this.notifications) {
      n.isRead = true
    }
    await this.persist()
  }

  async getUnreadCount(): Promise<number> {
    return this.notifications.filter((n) => !n.isRead).length
  }
}
