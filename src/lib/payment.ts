export const PAYMENT_QR_IMAGE_URL = import.meta.env.PAYMENT_QR_IMAGE_URL || '/images/sample-qr.svg'

export async function calculateTax(amountCents: number): Promise<number> {
  return Math.round(amountCents * 0.08)
}

export async function calculateShipping(amountCents: number): Promise<number> {
  return amountCents >= 5000 ? 0 : 599
}
