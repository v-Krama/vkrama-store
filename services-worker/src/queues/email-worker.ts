interface EmailMessage {
  type: "order_confirmation" | "shipping_update" | "payment_receipt" | "password_reset" | "welcome"
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
    case "order_confirmation":
      return {
        subject: `Order Confirmed - #${data.orderNumber}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1a1a2e; padding: 32px; text-align: center;">
              <h1 style="color: #e94560; margin: 0;">Vkrama</h1>
            </div>
            <div style="padding: 32px;">
              <h2>Thank you for your order!</h2>
              <p>Your order <strong>#${data.orderNumber}</strong> has been confirmed.</p>
              <p>Order Total: <strong>Rs. ${(data.totalCents as number / 100).toFixed(2)}</strong></p>
              <div style="margin: 24px 0; padding: 16px; background: #f8f9fa; border-radius: 8px;">
                <p style="margin: 0;">We'll notify you when your order ships.</p>
              </div>
            </div>
            <div style="background: #f1f3f5; padding: 16px; text-align: center; color: #666; font-size: 12px;">
              <p>Vkrama Group Private Limited</p>
            </div>
          </div>
        `,
        text: `Order Confirmed - #${data.orderNumber}\n\nThank you for your order!\nYour order #${data.orderNumber} has been confirmed.\nOrder Total: Rs. ${(data.totalCents as number / 100).toFixed(2)}\n\nWe'll notify you when your order ships.\n\nVkrama Group Private Limited`,
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

    default:
      return {
        subject: "Notification from Vkrama",
        html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><div style="padding: 32px;"><p>${data.message || "You have a new notification from Vkrama."}</p></div></div>`,
        text: `${data.message || "You have a new notification from Vkrama."}`,
      }
  }
}