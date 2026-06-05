export const PAYMENT_QR_IMAGE_URL = import.meta.env.PAYMENT_QR_IMAGE_URL || '/images/sample-qr.svg'

export async function calculateTax(amountCents: number): Promise<number> {
  return Math.round(amountCents * 0.08)
}

export async function calculateShipping(amountCents: number): Promise<number> {
  return amountCents >= 5000 ? 0 : 599
}

// Stripe sample stubs — replace with real Stripe integration when ready
export async function createPaymentIntent(_params: {
  amountCents: number
  currency?: string
  customerEmail?: string
  customerName?: string
  metadata?: Record<string, string>
}): Promise<{ client_secret: string; id: string }> {
  throw new Error('Stripe is not configured. Use QR or COD payment instead.')
}

export async function retrievePaymentIntent(_id: string): Promise<{ status: string; id: string; amount_received?: number; receipt_email?: string | null }> {
  throw new Error('Stripe is not configured.')
}

export async function constructWebhookEvent(_body: string | Buffer, _signature: string, _secret: string): Promise<{ type: string; data: { object: any } }> {
  throw new Error('Stripe is not configured.')
}
