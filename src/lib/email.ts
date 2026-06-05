import { APP_NAME, APP_URL } from './constants'

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
        from: `${APP_NAME} <orders@${APP_NAME}.com>`,
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

export function sendOrderConfirmationEmail(params: { email: string; orderId: string; totalCents: number }) {
  return sendEmail({
    to: params.email,
    subject: `Order Confirmed — ${params.orderId}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4c6ef5;">${APP_NAME}</h1>
        <h2>Thank you for your order!</h2>
        <p>Order <strong>#${params.orderId}</strong> has been confirmed.</p>
        <p>Total: $${(params.totalCents / 100).toFixed(2)}</p>
        <p>
          <a href="${APP_URL}/account/orders/${params.orderId}"
             style="background: #4c6ef5; color: white; padding: 12px 24px;
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            View Order
          </a>
        </p>
      </div>
    `,
  })
}
