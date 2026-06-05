globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_B3LaWqT_.mjs';
import { $ as $$Admin } from '../../chunks/Admin_BIwReTne.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const $$Customers = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Admin", $$Admin, { "title": "Customers" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="customers-table"> <div class="card p-8 text-center text-surface-500"> <div class="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
Loading...
</div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/admin/customers.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/admin/customers.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/admin/customers.astro";
const $$url = "/admin/customers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Customers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
