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
  const { subject, html } = buildEmail(type, data)

  try {
    await env.EMAIL.send({
      from: "Vkrama <noreply@vkrama.com.np>",
      to,
      subject: subject || "Notification from Vkrama",
      html,
    })
  } catch (error) {
    console.error(`Failed to send email via Cloudflare Email Sending:`, error)
    throw error
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
      }

    default:
      return {
        subject: "Notification from Vkrama",
        html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><div style="padding: 32px;"><p>${data.message || "You have a new notification from Vkrama."}</p></div></div>`,
      }
  }
}
