globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                           */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_B3LaWqT_.mjs';
import { $ as $$Admin } from '../../../chunks/Admin_BIwReTne.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const $$id = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Admin", $$Admin, { "title": "Edit Product" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-3xl"> <div id="form-loading" class="card p-8 text-center text-surface-500"> <div class="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
Loading product...
</div> <form id="product-form" class="card p-6 space-y-6 hidden"> <div class="grid grid-cols-2 gap-4"> <div class="col-span-2"> <label class="label" for="name">Name *</label> <input type="text" id="name" class="input" required> </div> <div class="col-span-2"> <label class="label" for="description">Description</label> <textarea id="description"${addAttribute(4, "rows")} class="input"></textarea> </div> <div> <label class="label" for="price">Price (Rs.) *</label> <input type="number" id="price" step="0.01" min="0" class="input" required> </div> <div> <label class="label" for="compare_price">Compare at Price (Rs.)</label> <input type="number" id="compare_price" step="0.01" min="0" class="input"> </div> <div> <label class="label" for="stock">Stock</label> <input type="number" id="stock" min="0" class="input" value="0"> </div> <div> <label class="label" for="status">Status</label> <select id="status" class="select"> <option value="draft">Draft</option> <option value="active">Active</option> <option value="archived">Archived</option> </select> </div> <div class="col-span-2"> <label class="label">Image URL</label> <div class="flex gap-2"> <input type="url" id="image_url" class="input flex-1"> <button type="button" id="upload-btn" class="btn-secondary btn-sm">Upload</button> </div> <div id="image-preview" class="hidden mt-2"> <img src="" alt="Preview" class="h-32 rounded-lg object-cover" id="preview-img"> </div> </div> <div class="col-span-2"> <div class="border-t border-surface-200 pt-4"> <h3 class="font-semibold text-surface-900 mb-3">SEO</h3> <div class="grid grid-cols-2 gap-4"> <div class="col-span-2"> <label class="label">SEO Title</label> <input type="text" id="seo_title" class="input"> </div> <div class="col-span-2"> <label class="label">SEO Description</label> <textarea id="seo_description"${addAttribute(2, "rows")} class="input"></textarea> </div> </div> </div> </div> </div> <p id="error-msg" class="text-sm text-red-600 hidden"></p> <div class="flex gap-3"> <button type="submit" class="btn-primary">Update Product</button> <button type="button" id="delete-btn" class="btn-danger">Delete</button> <a href="/admin/products" class="btn-secondary">Cancel</a> </div> </form> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/admin/products/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/admin/products/[id].astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/admin/products/[id].astro";
const $$url = "/admin/products/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
