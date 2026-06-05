import { APP_NAME } from './constants'

export const PAYMENT_UPI_ID = import.meta.env.PAYMENT_UPI_ID || 'store@upi'
export const PAYMENT_PAYEE_NAME = import.meta.env.PAYMENT_PAYEE_NAME || APP_NAME

export function buildUpiLink(params: { amountCents: number; orderId: string }): string {
  const amount = (params.amountCents / 100).toFixed(2)
  const upi = `upi://pay?pa=${encodeURIComponent(PAYMENT_UPI_ID)}&pn=${encodeURIComponent(PAYMENT_PAYEE_NAME)}&am=${amount}&tn=${encodeURIComponent(`Order ${params.orderId}`)}&cu=INR`
  return upi
}
