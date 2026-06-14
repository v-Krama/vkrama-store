globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DUQEdt6X.mjs';
import { $ as $$Base } from '../chunks/Base_LuIWtNvf.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Checkout" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative min-h-screen bg-surface-50/50"> <div class="container-page py-6 lg:py-10"> <div class="max-w-6xl mx-auto"> <!-- Header --> <div class="flex items-center gap-3 mb-8"> <a href="/cart" class="btn-ghost btn-icon -ml-2" aria-label="Back"> <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m7 7l-7-7 7-7"></path></svg> </a> <div> <h1 class="text-xl lg:text-2xl font-bold text-surface-900">Checkout</h1> <p class="text-sm text-surface-500">Complete your order</p> </div> </div> <div id="checkout-contents"> <div class="rounded-2xl bg-white border border-surface-200 p-8 sm:p-12 text-center text-surface-500"> <div class="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div> <p class="text-sm">Loading checkout...</p> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/checkout/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/checkout/index.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/checkout/index.astro";
const $$url = "/checkout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
