import Stripe from 'stripe'
import { APP_NAME } from './constants'

let stripeClient: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeClient) {
    const key = import.meta.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    stripeClient = new Stripe(key, {
      apiVersion: '2025-02-24.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    })
  }
  return stripeClient
}

export async function createPaymentIntent(params: {
  amountCents: number
  currency?: string
  customerEmail?: string
  customerName?: string
  metadata?: Record<string, string>
}) {
  const stripe = getStripe()
  return stripe.paymentIntents.create({
    amount: params.amountCents,
    currency: params.currency || 'usd',
    receipt_email: params.customerEmail,
    metadata: params.metadata || {},
    automatic_payment_methods: { enabled: true },
  })
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  const stripe = getStripe()
  return stripe.paymentIntents.retrieve(paymentIntentId)
}

export async function constructWebhookEvent(
  body: string | Buffer,
  signature: string,
  secret: string
) {
  const stripe = getStripe()
  return stripe.webhooks.constructEvent(body, signature, secret)
}

export async function createCustomer(params: {
  email: string
  name?: string
}) {
  const stripe = getStripe()
  return stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: { app: APP_NAME },
  })
}

export async function calculateTax(amountCents: number): Promise<number> {
  return Math.round(amountCents * 0.08)
}

export async function calculateShipping(amountCents: number): Promise<number> {
  return amountCents >= 5000 ? 0 : 599
}
