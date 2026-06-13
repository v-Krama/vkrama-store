globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Ce7Lw4RO.mjs';
import { $ as $$Base } from '../chunks/Base_UPGipB-W.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_CzUJxHa9.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Checkout" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-8"> <div class="max-w-4xl mx-auto"> <h1 class="text-2xl font-bold text-surface-900 mb-8">Checkout</h1> <div id="checkout-contents"> <div class="card p-8 text-center text-surface-500"> <div class="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
Loading...
</div> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/checkout/index.astro?astro&type=script&index=0&lang.ts")}`;
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
