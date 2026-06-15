interface EmailMessage {
  type: "order_confirmation" | "shipping_update" | "payment_receipt" | "password_reset" | "welcome" | "order_status_update"
  to: string
  subject?: string
  data: Record<string, unknown>
}

export async function processEmailQueue(
  batch: MessageBatch<EmailMessage>,
  env: Env,
) {
  for (const message of batch.messages) {
    const { type, to, data } = message.body

    try {
      await sendEmail(env, type, to, data)
      message.ack()
    } catch (error) {
      console.error(`Email sending failed for ${to}:`, error)
      message.retry({ delaySeconds: 30 })
    }
  }
}

async function sendEmail(
  env: Env,
  type: string,
  to: string,
  data: Record<string, unknown>,
) {
  const { subject, html, text } = buildEmail(type, data)

  const apiKey = (env as any).RESEND_API_KEY

  if (!apiKey) {
    console.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`)
    console.log(`[EMAIL MOCK] HTML: ${html.slice(0, 200)}...`)
    return
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Vkrama <noreply@vkrama.com.np>",
      to: [to],
      subject: subject || "Notification from Vkrama",
      html,
      text,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Resend API error: ${error}`)
  }
}

function buildEmail(type: string, data: Record<string, unknown>) {
  switch (type) {
    case "order_confirmation": {
      const items = (data.items as Array<{ name: string; variant?: string; qty: number; price: number }>) || []
      const itemsHtml = items.map(i =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}${i.variant ? ` (${i.variant})` : ''}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">Rs. ${((i.price * i.qty) / 100).toFixed(2)}</td></tr>`
      ).join('')
      return {
        subject: `Order Confirmed - #${data.orderNumber}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff">
            <div style="background:#1a1a2e;padding:32px;text-align:center">
              <h1 style="color:#e94560;margin:0;font-size:24px">Vkrama</h1>
            </div>
            <div style="padding:32px">
              <h2 style="color:#1a1a2e;margin:0 0 8px">Thank you for your order!</h2>
              <p style="color:#666;margin:0 0 24px">Hi ${data.customerName || 'Customer'}, your order <strong style="color:#1a1a2e">#${data.orderNumber}</strong> has been confirmed.</p>
              <table style="width:100%;border-collapse:collapse;margin:16px 0">
                <thead><tr style="border-bottom:2px solid #eee"><th style="padding:8px 0;text-align:left;color:#666;font-size:12px">ITEM</th><th style="padding:8px 0;text-align:center;color:#666;font-size:12px">QTY</th><th style="padding:8px 0;text-align:right;color:#666;font-size:12px">PRICE</th></tr></thead>
                <tbody>${itemsHtml}</tbody>
              </table>
              <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin:16px 0">
                <div style="display:flex;justify-content:space-between;padding:4px 0"><span style="color:#666">Subtotal</span><span>Rs. ${((data.subtotalCents as number || 0) / 100).toFixed(2)}</span></div>
                <div style="display:flex;justify-content:space-between;padding:4px 0"><span style="color:#666">Shipping</span><span>${(data.shippingCents as number || 0) === 0 ? '<span style="color:#059669">Free</span>' : 'Rs. ' + ((data.shippingCents as number || 0) / 100).toFixed(2)}</span></div>
                <div style="display:flex;justify-content:space-between;padding:4px 0"><span style="color:#666">Tax</span><span>Rs. ${((data.taxCents as number || 0) / 100).toFixed(2)}</span></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-top:2px solid #eee;margin-top:4px;font-weight:bold;font-size:16px"><span>Total</span><span>Rs. ${((data.totalCents as number || 0) / 100).toFixed(2)}</span></div>
              </div>
              ${data.shippingName ? `<div style="background:#f8f9fa;border-radius:8px;padding:16px;margin:16px 0"><p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase">Shipping To</p><p style="margin:0;font-weight:600">${data.shippingName}</p>${data.shippingCity ? `<p style="margin:4px 0 0;color:#666">${data.shippingCity}</p>` : ''}</div>` : ''}
              <div style="margin:24px 0;padding:16px;background:#eff6ff;border-radius:8px;border-left:4px solid #3b82f6">
                <p style="margin:0;color:#1e40af">We'll email you when your order ships. You can track your order anytime from your account.</p>
              </div>
            </div>
            <div style="background:#f1f3f5;padding:16px;text-align:center;color:#666;font-size:12px">
              <p style="margin:0">Vkrama Group Private Limited</p>
              <p style="margin:4px 0 0"><a href="https://vkrama.com.np" style="color:#e94560;text-decoration:none">vkrama.com.np</a></p>
            </div>
          </div>
        `,
        text: `Order Confirmed - #${data.orderNumber}\n\nHi ${data.customerName || 'Customer'}, your order #${data.orderNumber} has been confirmed.\n\nTotal: Rs. ${((data.totalCents as number || 0) / 100).toFixed(2)}\n\nWe'll email you when your order ships.\n\nVkrama Group Private Limited`,
      }
    }

    case "shipping_update":
      return {
        subject: `Shipping Update - #${data.orderNumber}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1a1a2e; padding: 32px; text-align: center;">
              <h1 style="color: #e94560; margin: 0;">Vkrama</h1>
            </div>
            <div style="padding: 32px;">
              <h2>Your order has been shipped!</h2>
              <p>Order <strong>#${data.orderNumber}</strong> is on its way.</p>
              ${data.trackingNumber ? `<p>Tracking: <strong>${data.trackingNumber}</strong></p>` : ""}
              ${data.trackingUrl ? `<p><a href="${data.trackingUrl}">Track your package</a></p>` : ""}
            </div>
          </div>
        `,
        text: `Shipping Update - #${data.orderNumber}\n\nYour order has been shipped!\nOrder #${data.orderNumber} is on its way.\n${data.trackingNumber ? `Tracking: ${data.trackingNumber}` : ""}\n${data.trackingUrl ? `Track your package: ${data.trackingUrl}` : ""}`,
      }

    case "payment_receipt":
      return {
        subject: `Payment Receipt - #${data.orderNumber}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1a1a2e; padding: 32px; text-align: center;">
              <h1 style="color: #e94560; margin: 0;">Vkrama</h1>
            </div>
            <div style="padding: 32px;">
              <h2>Payment Received</h2>
              <p>Payment of <strong>Rs. ${(data.amountCents as number / 100).toFixed(2)}</strong> for order <strong>#${data.orderNumber}</strong> has been received.</p>
            </div>
          </div>
        `,
        text: `Payment Receipt - #${data.orderNumber}\n\nPayment Received\nPayment of Rs. ${(data.amountCents as number / 100).toFixed(2)} for order #${data.orderNumber} has been received.`,
      }

    case "order_status_update": {
      const statusMessages: Record<string, { title: string; msg: string; color: string }> = {
        shipped: { title: 'Your order has been shipped!', msg: 'Your order is on its way to you. Track your package for updates.', color: '#3b82f6' },
        delivered: { title: 'Your order has been delivered!', msg: 'Your order has been successfully delivered. We hope you enjoy your purchase!', color: '#059669' },
        cancelled: { title: 'Your order has been cancelled', msg: 'Your order has been cancelled. If you have any questions, please contact support.', color: '#dc2626' },
        confirmed: { title: 'Your order has been confirmed', msg: 'Your order is being prepared for shipment.', color: '#8b5cf6' },
        processing: { title: 'Your order is being processed', msg: 'Your order is currently being prepared.', color: '#f59e0b' },
      }
      const s = statusMessages[data.status as string] || { title: 'Order Status Updated', msg: `Your order status has been updated to ${data.status}.`, color: '#6b7280' }
      return {
        subject: `${s.title} - #${data.orderNumber}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff">
            <div style="background:#1a1a2e;padding:32px;text-align:center">
              <h1 style="color:#e94560;margin:0;font-size:24px">Vkrama</h1>
            </div>
            <div style="padding:32px">
              <div style="text-align:center;margin-bottom:24px">
                <div style="width:48px;height:48px;border-radius:50%;background:${s.color}15;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
                  <span style="font-size:24px">${data.status === 'shipped' ? '🚚' : data.status === 'delivered' ? '📦' : data.status === 'cancelled' ? '❌' : '📋'}</span>
                </div>
                <h2 style="color:#1a1a2e;margin:0 0 8px">${s.title}</h2>
              </div>
              <p style="color:#666;margin:0 0 8px">Hi ${data.customerName || 'Customer'},</p>
              <p style="color:#666;margin:0 0 16px">${s.msg}</p>
              <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin:16px 0">
                <div style="display:flex;justify-content:space-between;padding:4px 0"><span style="color:#666">Order</span><span style="font-weight:600">#${data.orderNumber}</span></div>
                <div style="display:flex;justify-content:space-between;padding:4px 0"><span style="color:#666">Status</span><span style="font-weight:600;color:${s.color}">${(data.status as string || '').replace(/_/g, ' ').toUpperCase()}</span></div>
                <div style="display:flex;justify-content:space-between;padding:4px 0"><span style="color:#666">Total</span><span style="font-weight:600">Rs. ${((data.totalCents as number || 0) / 100).toFixed(2)}</span></div>
              </div>
              ${data.note ? `<div style="background:#eff6ff;border-radius:8px;padding:12px;margin:16px 0;border-left:4px solid #3b82f6"><p style="margin:0;color:#1e40af;font-size:14px">${data.note}</p></div>` : ''}
              <div style="margin:24px 0;text-align:center">
                <a href="https://vkrama.com.np/account/orders" style="display:inline-block;background:#1a1a2e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">View My Orders</a>
              </div>
            </div>
            <div style="background:#f1f3f5;padding:16px;text-align:center;color:#666;font-size:12px">
              <p style="margin:0">Vkrama Group Private Limited</p>
              <p style="margin:4px 0 0"><a href="https://vkrama.com.np" style="color:#e94560;text-decoration:none">vkrama.com.np</a></p>
            </div>
          </div>
        `,
        text: `${s.title} - #${data.orderNumber}\n\nHi ${data.customerName || 'Customer'},\n${s.msg}\n\nOrder: #${data.orderNumber}\nStatus: ${(data.status as string || '').replace(/_/g, ' ').toUpperCase()}\nTotal: Rs. ${((data.totalCents as number || 0) / 100).toFixed(2)}\n${data.note ? `\nNote: ${data.note}\n` : ''}\nView your orders: https://vkrama.com.np/account/orders\n\nVkrama Group Private Limited`,
      }
    }

    default:
      return {
        subject: "Notification from Vkrama",
        html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><div style="padding: 32px;"><p>${data.message || "You have a new notification from Vkrama."}</p></div></div>`,
        text: `${data.message || "You have a new notification from Vkrama."}`,
      }
  }
}