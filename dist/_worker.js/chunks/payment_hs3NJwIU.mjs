globalThis.process ??= {}; globalThis.process.env ??= {};
const PAYMENT_QR_IMAGE_URL = "/images/sample-qr.svg";
async function calculateTax(amountCents) {
  return Math.round(amountCents * 0.08);
}
async function calculateShipping(amountCents) {
  return amountCents >= 5e3 ? 0 : 599;
}
async function createPaymentIntent(_params) {
  throw new Error("Stripe is not configured. Use QR or COD payment instead.");
}
async function retrievePaymentIntent(_id) {
  throw new Error("Stripe is not configured.");
}

export { PAYMENT_QR_IMAGE_URL as P, calculateTax as a, createPaymentIntent as b, calculateShipping as c, retrievePaymentIntent as r };
