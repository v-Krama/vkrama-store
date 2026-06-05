globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_B3LaWqT_.mjs';
import { $ as $$Admin } from '../../chunks/Admin_BIwReTne.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Admin", $$Admin, { "title": "Orders" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex gap-2 mb-6 flex-wrap" id="status-filters"> <a href="/admin/orders" class="btn-secondary btn-sm">All</a> <a href="/admin/orders?status=pending" class="btn-secondary btn-sm">Pending</a> <a href="/admin/orders?status=awaiting_payment" class="btn-secondary btn-sm">Awaiting Payment</a> <a href="/admin/orders?status=paid" class="btn-secondary btn-sm">Paid</a> <a href="/admin/orders?status=processing" class="btn-secondary btn-sm">Processing</a> <a href="/admin/orders?status=shipped" class="btn-secondary btn-sm">Shipped</a> <a href="/admin/orders?status=delivered" class="btn-secondary btn-sm">Delivered</a> <a href="/admin/orders?status=cancelled" class="btn-secondary btn-sm">Cancelled</a> </div> <div id="orders-table"> <div class="card p-8 text-center text-surface-500"> <div class="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
Loading...
</div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/admin/orders/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/admin/orders/index.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/admin/orders/index.astro";
const $$url = "/admin/orders";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
