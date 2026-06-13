globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DFXjdrHI.mjs';
import { $ as $$Base } from '../chunks/Base_K6G6gUWu.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_C3QtnHAK.mjs';

const $$Cart = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Shopping Cart" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-8"> <div class="max-w-4xl mx-auto"> <div class="flex items-center justify-between mb-8"> <div> <h1 class="text-2xl font-bold text-surface-900">Shopping Cart</h1> <p id="cart-count-label" class="text-sm text-surface-500 mt-1">Loading...</p> </div> <a href="/products" class="text-sm text-brand-600 hover:text-brand-700 font-medium">
Continue Shopping &rarr;
</a> </div> <div id="cart-contents"> <div class="card p-8 text-center text-surface-500"> <div class="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
Loading cart...
</div> </div> <div id="checkout-block" class="hidden mt-6"> <div class="card p-6"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"> <div> <p class="text-sm text-surface-500">Subtotal</p> <p id="cart-total" class="text-2xl font-bold text-surface-900">Rs. 0.00</p> <p class="text-xs text-surface-400 mt-0.5">Shipping & taxes calculated at checkout</p> </div> <a href="/checkout" class="btn-primary btn-lg">
Checkout &rarr;
</a> </div> </div> </div> <div id="empty-cart" class="hidden text-center py-20"> <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto text-surface-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path> </svg> <h2 class="text-xl font-semibold text-surface-900 mb-2">Your cart is empty</h2> <p class="text-surface-500 mb-6">Looks like you haven't added anything yet</p> <a href="/products" class="btn-primary btn-lg">Browse Products</a> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/cart.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/cart.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/cart.astro";
const $$url = "/cart";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cart,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
