interface Order {
  id: string
  order_number: string
  email: string | null
  customer_id: string | null
  total_cents: number
  subtotal_cents: number
  shipping_cents: number
  tax_cents: number
  discount_cents: number
  payment_method: string | null
  shipping_name: string | null
  shipping_city: string | null
  status: string
  created_at: string
}

interface OrderProcessingMessage {
  type: "validate" | "process_payment" | "reserve_inventory" | "send_confirmation" | "fulfill"
  orderId: string
  data?: Record<string, unknown>
}

export async function processOrderQueue(
  batch: MessageBatch<OrderProcessingMessage>,
  env: Env,
  ctx: ExecutionContext,
) {
  for (const message of batch.messages) {
    const { type, orderId } = message.body

    try {
      switch (type) {
        case "validate":
          await validateOrder(orderId, env)
          break
        case "process_payment":
          await processPayment(orderId, env)
          break
        case "reserve_inventory":
          await reserveInventory(orderId, env)
          break
        case "send_confirmation":
          await sendConfirmation(orderId, env)
          break
        case "fulfill":
          await fulfillOrder(orderId, env)
          break
      }
      message.ack()
    } catch (error) {
      console.error(`Order processing failed for ${orderId}:`, error)
      message.retry({ delaySeconds: 10 })
    }
  }
}

async function validateOrder(orderId: string, env: Env) {
  const result = await env.DB.prepare(
    "SELECT id, status, total_cents FROM orders WHERE id = ?",
  ).bind(orderId).first<{ id: string; status: string; total_cents: number }>()

  if (!result) throw new Error(`Order ${orderId} not found`)
  if (result.status !== "pending") throw new Error(`Order ${orderId} is not in pending state`)

  await env.DB.prepare(
    "UPDATE orders SET status = 'confirmed', updated_at = datetime('now') WHERE id = ?",
  ).bind(orderId).run()

  await logActivity(env, {
    actor_type: "system",
    action: "order.validated",
    resource_type: "order",
    resource_id: orderId,
  })
}

async function processPayment(orderId: string, env: Env) {
  const result = await env.DB.prepare(
    "SELECT id, payment_method, total_cents, currency FROM orders WHERE id = ?",
  ).bind(orderId).first<{ id: string; payment_method: string; total_cents: number; currency: string }>()

  if (!result) throw new Error(`Order ${orderId} not found`)

  if (result.payment_method === "cash" || result.payment_method === "qr") {
    await env.DB.prepare(
      `INSERT INTO payments (order_id, method, amount_cents, currency, status, paid_at)
       VALUES (?, ?, ?, ?, 'pending', datetime('now'))`,
    ).bind(orderId, result.payment_method, result.total_cents, result.currency).run()
  }
}

async function reserveInventory(orderId: string, env: Env) {
  const items = await env.DB.prepare(
    `SELECT oi.variant_id, oi.quantity, pv.stock
     FROM order_items oi
     JOIN product_variants pv ON oi.variant_id = pv.id
     WHERE oi.order_id = ? AND oi.variant_id IS NOT NULL`,
  ).bind(orderId).all<{ variant_id: string; quantity: number; stock: number }>()

  for (const item of items.results) {
    if (item.stock < item.quantity) {
      throw new Error(`Insufficient stock for variant ${item.variant_id}`)
    }
  }
}

async function sendConfirmation(orderId: string, env: Env) {
  const order = await env.DB.prepare(
    `SELECT o.*, c.name as customer_name, c.email as customer_email
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     WHERE o.id = ?`,
  ).bind(orderId).first<Order & { customer_name: string; customer_email: string }>()

  if (!order) throw new Error(`Order ${orderId} not found`)

  const items = await env.DB.prepare(
    "SELECT name, variant_name, quantity, price_cents, image_url FROM order_items WHERE order_id = ?",
  ).bind(orderId).all<{ name: string; variant_name: string; quantity: number; price_cents: number; image_url: string }>()

  const itemsData = items.results.map(i => ({
    name: i.name,
    variant: i.variant_name,
    qty: i.quantity,
    price: i.price_cents,
    image: i.image_url,
  }))

  await env.EMAIL_QUEUE.send({
    type: "order_confirmation",
    to: order.email || order.customer_email,
    data: {
      orderNumber: order.order_number,
      totalCents: order.total_cents,
      customerName: order.customer_name || "Customer",
      items: itemsData,
      shippingName: order.shipping_name,
      shippingCity: order.shipping_city,
      paymentMethod: order.payment_method,
    },
  })

  await logActivity(env, {
    actor_type: "system",
    action: "order.confirmation_sent",
    resource_type: "order",
    resource_id: orderId,
  })
}

async function fulfillOrder(orderId: string, env: Env) {
  await env.DB.prepare(
    "UPDATE orders SET status = 'processing', updated_at = datetime('now') WHERE id = ?",
  ).bind(orderId).run()

  await logActivity(env, {
    actor_type: "system",
    action: "order.fulfillment_started",
    resource_type: "order",
    resource_id: orderId,
  })
}

async function logActivity(
  env: Env,
  entry: { actor_type: string; action: string; resource_type: string; resource_id?: string },
) {
  await env.DB.prepare(
    `INSERT INTO activity_log (actor_type, action, resource_type, resource_id, created_at)
     VALUES (?, ?, ?, ?, datetime('now'))`,
  ).bind(entry.actor_type, entry.action, entry.resource_type, entry.resource_id || null).run()
}
