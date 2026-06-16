export function formatPrice(cents: number): string {
  return `Rs. ${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const CURRENCY = 'npr'
export const CURRENCY_SYMBOL = 'Rs.'

export function formatPriceSimple(cents: number): string {
  return `Rs. ${(cents / 100).toFixed(2)}`
}
