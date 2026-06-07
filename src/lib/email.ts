import { APP_NAME, APP_URL } from './constants'
import { formatPrice } from './format'

const resendKey = import.meta.env.RESEND_API_KEY || ''

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  if (!resendKey) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${APP_NAME} <orders@${import.meta.env.PUBLIC_APP_DOMAIN || 'vkrama.com'}>`,
        to,
        subject,
        html,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
  .container { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
  .header { text-align: center; padding: 32px 0; }
  .logo { font-size: 28px; font-weight: 800; color: #2563EB; letter-spacing: -0.5px; }
  .card { background: white; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; }
  .btn { display: inline-block; background: #2563EB; color: white; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; }
  .footer { text-align: center; padding: 24px; color: #94a3b8; font-size: 13px; }
`

export function sendOrderConfirmationEmail(params: { email: string; orderId: string; totalCents: number }) {
  return sendEmail({
    to: params.email,
    subject: `Order Confirmed #${params.orderId.slice(-8)} — ${APP_NAME}`,
    html: `
      <html><head><style>${baseStyles}</style></head><body>
        <div class="container">
          <div class="header">
            <div class="logo">${APP_NAME}</div>
          </div>
          <div class="card">
            <h1 style="margin:0 0 8px; font-size:24px; color: #111827;">Thank you for your order!</h1>
            <p style="color: #64748b; margin:0 0 24px;">Your order has been confirmed and is being processed.</p>
            <table style="width:100%; margin-bottom:24px;">
              <tr><td style="color:#64748b; padding:8px 0;">Order</td><td style="font-weight:600; text-align:right;">#${params.orderId.slice(-8)}</td></tr>
              <tr><td style="color:#64748b; padding:8px 0;">Total</td><td style="font-weight:600; text-align:right;">${formatPrice(params.totalCents)}</td></tr>
            </table>
            <div style="text-align:center;">
              <a href="${APP_URL}/account/orders/${params.orderId}" class="btn">View Order</a>
            </div>
          </div>
          <div class="footer">
            <p>${APP_NAME} — Quality products, fair prices.</p>
            <p style="margin:4px 0 0;">${APP_URL}</p>
          </div>
        </div>
      </body></html>
    `,
  })
}

export function sendShippingUpdateEmail(params: { email: string; orderId: string; status: string }) {
  const statusLabels: Record<string, string> = {
    processing: 'is being processed',
    shipped: 'has been shipped',
    delivered: 'has been delivered',
  }

  return sendEmail({
    to: params.email,
    subject: `Order Update #${params.orderId.slice(-8)} — ${APP_NAME}`,
    html: `
      <html><head><style>${baseStyles}</style></head><body>
        <div class="container">
          <div class="header"><div class="logo">${APP_NAME}</div></div>
          <div class="card">
            <h1 style="margin:0 0 8px; font-size:24px; color:#111827;">Order Update</h1>
            <p style="color:#64748b; margin:0 0 24px;">Your order #${params.orderId.slice(-8)} ${statusLabels[params.status] || 'has been updated'}.</p>
            <div style="text-align:center;">
              <a href="${APP_URL}/account/orders/${params.orderId}" class="btn">View Order</a>
            </div>
          </div>
          <div class="footer">
            <p>${APP_NAME}</p>
          </div>
        </div>
      </body></html>
    `,
  })
}
