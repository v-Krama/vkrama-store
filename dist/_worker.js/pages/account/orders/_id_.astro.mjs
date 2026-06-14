globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                           */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_Ce7Lw4RO.mjs';
import { $ as $$Base } from '../../../chunks/Base_CyiuoItI.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const $$id = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Order Detail" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-8"> <div class="max-w-3xl mx-auto"> <a href="/account/orders" class="text-sm text-brand-600 hover:underline mb-4 inline-block">&larr; Back to Orders</a> <div id="order-detail"> <div class="card p-6"> <div class="skeleton-cell w-48 h-6 mb-4"></div> <div class="skeleton-cell w-full h-24 rounded-xl mb-4"></div> <div class="space-y-2"><div class="skeleton-cell w-full h-12"></div><div class="skeleton-cell w-full h-12"></div><div class="skeleton-cell w-3/4 h-12"></div></div> <div class="mt-4 pt-4 border-t border-surface-200"><div class="skeleton-cell w-32 h-4 ml-auto"></div></div> </div> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/account/orders/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/account/orders/[id].astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/account/orders/[id].astro";
const $$url = "/account/orders/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
