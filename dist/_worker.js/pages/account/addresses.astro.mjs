globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_B3LaWqT_.mjs';
import { $ as $$Base } from '../../chunks/Base_BDcr1WWm.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const $$Addresses = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "My Addresses" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-8"> <div class="max-w-3xl mx-auto"> <div class="flex items-center justify-between mb-8"> <div> <h1 class="text-2xl font-bold text-surface-900">My Addresses</h1> <p class="text-sm text-surface-500 mt-1">Manage your shipping addresses</p> </div> <div class="flex gap-3"> <a href="/account/orders" class="btn-secondary btn-sm">&larr; Orders</a> </div> </div> <div class="mb-6"> <button id="add-address-btn" class="btn-primary"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path> </svg>
Add Address
</button> </div> <div id="addresses-list"> <div class="card p-8 text-center text-surface-500"> <div class="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
Loading addresses...
</div> </div> </div> </div> <div id="address-modal" class="fixed inset-0 z-50 hidden"> <div class="absolute inset-0 bg-surface-900/50 backdrop-blur-sm" onclick="closeAddressModal()"></div> <div class="relative max-w-lg mx-auto mt-20 px-4"> <div class="bg-white rounded-xl shadow-2xl p-6 animate-slide-up"> <div class="flex items-center justify-between mb-6"> <h2 id="modal-title" class="text-lg font-semibold text-surface-900">Add Address</h2> <button onclick="closeAddressModal()" class="btn-ghost btn-icon"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <form id="address-form" class="space-y-3"> <input type="hidden" id="address-id"> <div class="grid grid-cols-2 gap-3"> <div class="col-span-2"> <label class="label">Address Label</label> <select id="addr-label" class="select"> <option value="Home">Home</option> <option value="Work">Work</option> <option value="Other">Other</option> </select> </div> <div class="col-span-2 sm:col-span-1"> <label class="label">Full Name *</label> <input type="text" id="addr-name" class="input" required> </div> <div class="col-span-2 sm:col-span-1"> <label class="label">Phone</label> <input type="tel" id="addr-phone" class="input"> </div> <div class="col-span-2"> <label class="label">Address Line 1 *</label> <input type="text" id="addr-line1" class="input" required> </div> <div class="col-span-2"> <label class="label">Address Line 2</label> <input type="text" id="addr-line2" class="input"> </div> <div> <label class="label">City *</label> <input type="text" id="addr-city" class="input" required> </div> <div> <label class="label">State *</label> <input type="text" id="addr-state" class="input" required> </div> <div> <label class="label">ZIP Code *</label> <input type="text" id="addr-zip" class="input" required> </div> <div> <label class="label">Country</label> <input type="text" id="addr-country" class="input" value="US"> </div> <div class="col-span-2"> <label class="flex items-center gap-2 cursor-pointer"> <input type="checkbox" id="addr-default" class="rounded border-surface-300 text-brand-600 focus:ring-brand-500"> <span class="text-sm text-surface-700">Set as default address</span> </label> </div> </div> <p id="addr-msg" class="text-sm hidden"></p> <div class="flex gap-3 pt-2"> <button type="submit" class="btn-primary flex-1">Save Address</button> <button type="button" onclick="closeAddressModal()" class="btn-secondary">Cancel</button> </div> </form> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/account/addresses.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/account/addresses.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/account/addresses.astro";
const $$url = "/account/addresses";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Addresses,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
