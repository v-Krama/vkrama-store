import { CartDO } from "./durable-objects/CartDO"
import { InventoryDO } from "./durable-objects/InventoryDO"
import { NotificationDO } from "./durable-objects/NotificationDO"
import { processOrderQueue } from "./queues/order-processor"
import { processEmailQueue } from "./queues/email-worker"

export { CartDO, InventoryDO, NotificationDO }

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok", service: "vkrama-services" }), {
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response("Not found", { status: 404 })
  },

  async queue(batch: MessageBatch, env: Env): Promise<void> {
    switch (batch.queue) {
      case "vkrama-order-processor":
        await processOrderQueue(batch as any, env as any, {} as ExecutionContext)
        break
      case "vkrama-email":
        await processEmailQueue(batch as any, env as any)
        break
      case "vkrama-analytics":
        for (const msg of batch.messages) {
          msg.ack()
        }
        break
      default:
        for (const msg of batch.messages) {
          msg.ack()
        }
    }
  },
}
