globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                           */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DUQEdt6X.mjs';
import { $ as $$Base } from '../../../chunks/Base_LuIWtNvf.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const $$id = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Order Detail" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative min-h-screen bg-surface-50/50"> <div class="container-page py-8 lg:py-12"> <div class="max-w-3xl mx-auto"> <a href="/account/orders" class="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium mb-6 transition-colors"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m7 7l-7-7 7-7"></path></svg>
Back to Orders
</a> <div id="order-detail"> <div class="rounded-2xl bg-white border border-surface-200 p-6"> <!-- Skeleton --> <div class="animate-pulse space-y-4"> <div class="flex justify-between"> <div class="space-y-2"> <div class="h-5 w-40 bg-surface-200 rounded-lg"></div> <div class="h-3 w-28 bg-surface-100 rounded-lg"></div> </div> <div class="h-6 w-20 bg-surface-200 rounded-full"></div> </div> <div class="h-20 bg-surface-100 rounded-xl"></div> <div class="space-y-3"> <div class="h-12 bg-surface-100 rounded-lg"></div> <div class="h-12 bg-surface-100 rounded-lg"></div> </div> <div class="flex justify-between pt-2 border-t border-surface-200"> <div class="h-4 w-24 bg-surface-200 rounded-lg"></div> <div class="h-4 w-20 bg-surface-200 rounded-lg"></div> </div> </div> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/account/orders/[id].astro?astro&type=script&index=0&lang.ts")}`;
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
