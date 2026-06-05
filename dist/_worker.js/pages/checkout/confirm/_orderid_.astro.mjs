globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                           */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_B3LaWqT_.mjs';
import { j as jsxRuntimeExports, $ as $$Base } from '../../../chunks/Base_BDcr1WWm.mjs';
import { P as PAYMENT_QR_IMAGE_URL } from '../../../chunks/payment_hs3NJwIU.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

function OrderQR({ imageUrl }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: imageUrl,
        alt: "Payment QR",
        className: "w-64 h-64 rounded-xl shadow-sm object-contain bg-white"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 text-center max-w-xs", children: "Scan this QR code with your payment app to complete the payment" })
  ] });
}

const $$Astro = createAstro("https://vkrama.com");
async function getStaticPaths() {
  return [];
}
const $$orderId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$orderId;
  const orderId = Astro2.params.orderId;
  let order = null;
  let items = [];
  try {
    const env = Astro2.locals.runtime?.env;
    if (env?.DB) {
      const row = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
      if (row) {
        order = row;
        const result = await env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(orderId).all();
        items = result.results;
      }
    }
  } catch {
  }
  const qrImageUrl = PAYMENT_QR_IMAGE_URL;
  const isCod = order?.payment_method === "cod" || order?.status === "pending";
  const isQr = order?.payment_method === "qr" || (!order?.payment_method || order?.payment_method === "qr") && !isCod;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": order ? "Order Placed" : "Order Not Found" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-8"> ${order ? renderTemplate`<div class="max-w-2xl mx-auto"> <div class="text-center mb-8 animate-slide-up"> <div${addAttribute(`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isCod ? "bg-emerald-100" : "bg-brand-100"}`, "class")}> ${isCod ? renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg>` : renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path> </svg>`} </div> <h1 class="text-2xl md:text-3xl font-bold text-surface-900"> ${isCod ? "Order Placed!" : "Complete Your Payment"} </h1> <p class="text-surface-500 mt-2"> ${isCod ? "Your order has been placed successfully. Pay when you receive your items." : "Scan the QR code below to complete your payment."} </p> <p class="font-mono text-sm text-surface-400 mt-1">Order #${order.id}</p> </div> <div class="grid md:grid-cols-2 gap-6 mb-8"> ${isQr && renderTemplate`<div class="card p-6 flex flex-col items-center"> <h2 class="font-semibold text-surface-900 mb-4">Scan & Pay</h2> ${renderComponent($$result2, "OrderQR", OrderQR, { "client:load": true, "imageUrl": qrImageUrl, "client:component-hydration": "load", "client:component-path": "/home/v-krama/vkrama-store/src/components/payment/OrderQR.tsx", "client:component-export": "default" })} </div>`} ${isCod && renderTemplate`<div class="card p-8 text-center flex flex-col items-center justify-center"> <div class="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path> </svg> </div> <p class="text-surface-700 font-medium text-lg mb-1">Pay on Delivery</p> <p class="text-surface-500 text-sm">Have cash or card ready when your order arrives.</p> </div>`} <div class="space-y-4"> <div class="card p-6"> <h2 class="font-semibold text-surface-900 mb-4">Order Summary</h2> <div class="space-y-3 divide-y divide-surface-100"> ${items.map((item) => renderTemplate`<div class="flex justify-between text-sm pt-3 first:pt-0"> <span class="text-surface-600"> ${item.name} &times; ${item.quantity} </span> <span class="font-medium text-surface-900">$${(item.price_cents * item.quantity / 100).toFixed(2)}</span> </div>`)} </div> <div class="border-t border-surface-200 mt-4 pt-4 flex justify-between font-bold text-lg text-surface-900"> <span>Total</span> <span>$${(order.total_cents / 100).toFixed(2)}</span> </div> </div> ${order.shipping_name && renderTemplate`<div class="card p-6"> <h2 class="font-semibold text-surface-900 mb-3">Shipping Address</h2> <div class="text-sm text-surface-600 space-y-0.5"> <p class="font-medium text-surface-900">${order.shipping_name}</p> ${order.shipping_phone && renderTemplate`<p>${order.shipping_phone}</p>`} <p>${order.shipping_line1}</p> ${order.shipping_line2 && renderTemplate`<p>${order.shipping_line2}</p>`} <p>${order.shipping_city}, ${order.shipping_state} ${order.shipping_postal_code}</p> </div> </div>`} ${isQr && renderTemplate`<div class="card p-4 bg-amber-50 border-amber-200"> <h3 class="font-semibold text-amber-800 text-sm mb-2 flex items-center gap-1.5"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
Payment Instructions
</h3> <ol class="text-sm text-amber-700 space-y-1 list-decimal list-inside"> <li>Open your payment app</li> <li>Scan the QR code</li> <li>Complete the payment</li> <li>Order will be processed once confirmed</li> </ol> </div>`} </div> </div> <div class="text-center"> <a href="/account/orders" class="btn-primary">View My Orders</a> </div> </div>` : renderTemplate`<div class="max-w-md mx-auto text-center py-16"> <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-surface-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <h1 class="text-xl font-bold text-surface-900 mb-2">Order Not Found</h1> <p class="text-surface-500 mb-6">We couldn't find this order.</p> <a href="/cart" class="btn-primary">Back to Cart</a> </div>`} </div> ` })}`;
}, "/home/v-krama/vkrama-store/src/pages/checkout/confirm/[orderId].astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/checkout/confirm/[orderId].astro";
const $$url = "/checkout/confirm/[orderId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$orderId,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
