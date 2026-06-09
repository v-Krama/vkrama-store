globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DFXjdrHI.mjs';
import { $ as $$Base } from '../../chunks/Base_CghCu4Vd.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const $$Orders = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "My Orders", "description": "View your order history at vkrama." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-8"> <div class="max-w-4xl mx-auto"> <div class="flex items-center justify-between mb-8"> <div> <h1 class="text-2xl font-bold text-surface-900">My Orders</h1> <p class="text-sm text-surface-500 mt-1">View and track your orders</p> </div> <div class="flex items-center gap-3"> <a href="/account/profile" class="btn-secondary btn-sm">Profile</a> <a href="/auth/logout" class="btn-ghost btn-sm text-red-600 hover:text-red-700">Sign Out</a> </div> </div> <div id="orders-list"> <div class="card p-8 text-center text-surface-500"> <div class="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
Loading orders...
</div> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/account/orders.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/account/orders.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/account/orders.astro";
const $$url = "/account/orders";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Orders,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
