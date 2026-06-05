globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                           */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_B3LaWqT_.mjs';
import { $ as $$Admin } from '../../../chunks/Admin_BIwReTne.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const $$New = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Admin", $$Admin, { "title": "Add Product" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-3xl"> <form id="product-form" class="card p-6 space-y-6"> <div class="grid grid-cols-2 gap-4"> <div class="col-span-2"> <label class="label" for="name">Name *</label> <input type="text" id="name" class="input" required> </div> <div class="col-span-2"> <label class="label" for="description">Description</label> <textarea id="description"${addAttribute(4, "rows")} class="input"></textarea> </div> <div> <label class="label" for="price">Price ($) *</label> <input type="number" id="price" step="0.01" min="0" class="input" required> </div> <div> <label class="label" for="compare_price">Compare at Price ($)</label> <input type="number" id="compare_price" step="0.01" min="0" class="input"> </div> <div> <label class="label" for="stock">Stock</label> <input type="number" id="stock" min="0" class="input" value="0"> </div> <div> <label class="label" for="status">Status</label> <select id="status" class="select"> <option value="draft">Draft</option> <option value="active">Active</option> <option value="archived">Archived</option> </select> </div> <div class="col-span-2"> <label class="label">Image URL</label> <div class="flex gap-2"> <input type="url" id="image_url" class="input flex-1" placeholder="https://..."> <button type="button" id="upload-btn" class="btn-secondary btn-sm">Upload</button> </div> <div id="image-preview" class="hidden mt-2"> <img src="" alt="Preview" class="h-32 rounded-lg object-cover" id="preview-img"> </div> </div> <div class="col-span-2"> <div class="border-t border-surface-200 pt-4"> <h3 class="font-semibold text-surface-900 mb-3">SEO</h3> <div class="grid grid-cols-2 gap-4"> <div class="col-span-2"> <label class="label">SEO Title</label> <input type="text" id="seo_title" class="input" placeholder="Product Name | vkrama"> </div> <div class="col-span-2"> <label class="label">SEO Description</label> <textarea id="seo_description"${addAttribute(2, "rows")} class="input" placeholder="Brief description for search engines"></textarea> </div> </div> </div> </div> </div> <div class="border-t border-surface-200 pt-4"> <h3 class="font-semibold text-surface-900 mb-3">Variants</h3> <div class="flex gap-2 mb-3"> <input type="text" placeholder="Group (e.g. Size)" class="input flex-1 variant-group"> <input type="text" placeholder="Value (e.g. Medium)" class="input flex-1 variant-value"> <button type="button" class="btn-secondary btn-sm add-option" id="add-option-btn">+ Add</button> </div> <div id="variant-list" class="space-y-2"> <p class="text-sm text-surface-400">Add variant options (e.g. Size: Small, Color: Red)</p> </div> </div> <p id="error-msg" class="text-sm text-red-600 hidden"></p> <div class="flex gap-3"> <button type="submit" class="btn-primary">Save Product</button> <a href="/admin/products" class="btn-secondary">Cancel</a> </div> </form> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/admin/products/new.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/admin/products/new.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/admin/products/new.astro";
const $$url = "/admin/products/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
