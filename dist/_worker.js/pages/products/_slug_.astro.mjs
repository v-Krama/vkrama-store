globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, v as Fragment, h as addAttribute } from '../../chunks/astro/server_DFXjdrHI.mjs';
import { j as jsxRuntimeExports, $ as $$Base } from '../../chunks/Base_CVb1R01W.mjs';
import { a as reactExports } from '../../chunks/_@astro-renderers_C3QtnHAK.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C3QtnHAK.mjs';

function VariantSelector({ options, variants, basePriceCents, onVariantChange }) {
  const groups = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const opt of [...options].sort((a, b) => a.sortOrder - b.sortOrder)) {
      const list = map.get(opt.groupName) || [];
      if (!list.includes(opt.value)) list.push(opt.value);
      map.set(opt.groupName, list);
    }
    return Array.from(map.entries());
  }, [options]);
  const [selected, setSelected] = reactExports.useState({});
  const matchedVariant = reactExports.useMemo(() => {
    const values = Object.values(selected).filter(Boolean);
    if (values.length === 0) return null;
    const name = values.join(" / ");
    return variants.find((v) => v.name === name) || null;
  }, [selected, variants]);
  reactExports.useEffect(() => {
    const el = document.getElementById("variant-data");
    if (el) {
      if (matchedVariant) {
        el.dataset.variantId = matchedVariant.id;
        el.dataset.variantName = matchedVariant.name;
        el.dataset.variantPrice = String(matchedVariant.priceCents ?? basePriceCents);
        el.dataset.variantStock = String(matchedVariant.stock);
        el.dataset.variantInStock = matchedVariant.stock > 0 ? "true" : "false";
      } else {
        delete el.dataset.variantId;
        delete el.dataset.variantName;
        delete el.dataset.variantPrice;
        delete el.dataset.variantStock;
        delete el.dataset.variantInStock;
      }
    }
    if (onVariantChange) {
      onVariantChange(
        matchedVariant ? { id: matchedVariant.id, name: matchedVariant.name, priceCents: matchedVariant.priceCents ?? basePriceCents, inStock: matchedVariant.stock > 0 } : null
      );
    }
  }, [matchedVariant, basePriceCents, onVariantChange]);
  function select(group, value) {
    setSelected((prev) => ({ ...prev, [group]: value }));
  }
  const displayPrice = matchedVariant?.priceCents ?? basePriceCents;
  groups.length === 0 || Object.keys(selected).length === groups.length;
  matchedVariant ? matchedVariant.stock > 0 : variants.length === 0 || variants.some((v) => v.stock > 0);
  const showOutOfStock = matchedVariant && matchedVariant.stock <= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-bold text-surface-900", children: [
        "$",
        (displayPrice / 100).toFixed(2)
      ] }),
      showOutOfStock && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-red", children: "Out of Stock" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "variant-data", "data-has-variants": variants.length > 0 ? "true" : "false" }),
    groups.length === 1 && groups[0][1].length <= 4 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: groups[0][0] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: groups[0][1].map((value) => {
        const isSelected = selected[groups[0][0]] === value;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: `px-4 py-2.5 text-sm rounded-lg border font-medium transition-all ${isSelected ? "border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600" : "border-surface-300 text-surface-700 hover:border-surface-400 bg-white"}`,
            onClick: () => select(groups[0][0], value),
            children: value
          },
          value
        );
      }) })
    ] }) : groups.map(([group, values]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: group }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: values.map((value) => {
        const isSelected = selected[group] === value;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: `px-3 py-2 text-sm rounded-lg border transition-all ${isSelected ? "border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600" : "border-surface-300 text-surface-700 hover:border-surface-400 bg-white"}`,
            onClick: () => select(group, value),
            children: value
          },
          value
        );
      }) })
    ] }, group))
  ] });
}

function ProductGallery({ images, name }) {
  const [selected, setSelected] = reactExports.useState(0);
  const displayImages = images.length > 0 ? images : [""];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-surface-100 rounded-2xl overflow-hidden", children: displayImages[selected] ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: displayImages[selected],
        alt: `${name} - Image ${selected + 1}`,
        className: "w-full h-full object-cover"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-surface-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-24 w-24", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }) }),
    displayImages.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto scrollbar-hide", children: displayImages.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setSelected(i),
        className: `w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${i === selected ? "border-brand-600 ring-1 ring-brand-600" : "border-transparent hover:border-surface-300"}`,
        children: img ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: `${name} thumbnail ${i + 1}`, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-surface-100" })
      },
      i
    )) })
  ] });
}

const $$Astro = createAstro("https://vkrama.com");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const product = await (async () => {
    try {
      const res = await fetch(`${Astro2.url.origin}/api/products/${slug}`);
      if (res.ok) return await res.json();
    } catch {
    }
    return null;
  })();
  if (!product) {
    return Astro2.redirect("/404");
  }
  const images = [product.imageUrl, ...JSON.parse(product.images || "[]")].filter(Boolean);
  product.seoTitle || product.name;
  const seoDesc = product.seoDescription || product.description?.slice(0, 160) || `Shop ${product.name} at vkrama`;
  const hasDiscount = product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents;
  const discountPercent = hasDiscount ? Math.round((1 - product.priceCents / product.compareAtPriceCents) * 100) : 0;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": product.name, "description": seoDesc, "image": product.imageUrl || "/og-image.png" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-8"> <!-- Breadcrumb --> <nav class="flex items-center gap-2 text-sm text-surface-500 mb-6"> <a href="/" class="hover:text-brand-600 transition-colors">Home</a> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> <a href="/products" class="hover:text-brand-600 transition-colors">Products</a> ${product.categories?.length > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> <a${addAttribute(`/products?category=${product.categories[0].slug}`, "href")} class="hover:text-brand-600 transition-colors"> ${product.categories[0].name} </a> ` })}`} <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> <span class="text-surface-900 truncate max-w-[200px]">${product.name}</span> </nav> <div class="grid md:grid-cols-2 gap-8 lg:gap-12"> <!-- Left: Gallery --> ${renderComponent($$result2, "ProductGallery", ProductGallery, { "client:load": true, "images": images, "name": product.name, "client:component-hydration": "load", "client:component-path": "/home/v-krama/vkrama-store/src/components/product/ProductGallery.tsx", "client:component-export": "default" })} <!-- Right: Details --> <div class="md:sticky md:top-24 md:self-start"> ${hasDiscount && renderTemplate`<span class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 mb-4">
Save ${discountPercent}% — Limited time offer
</span>`} <h1 class="text-2xl md:text-3xl font-bold text-surface-900 leading-tight">${product.name}</h1> <div class="mt-6"> ${renderComponent($$result2, "VariantSelector", VariantSelector, { "client:load": true, "options": product.variantOptions || [], "variants": product.variants || [], "basePriceCents": product.priceCents, "client:component-hydration": "load", "client:component-path": "/home/v-krama/vkrama-store/src/components/product/VariantSelector.tsx", "client:component-export": "default" })} </div> <div class="mt-6 prose-custom text-sm"> <p>${product.description || "No description available."}</p> </div> <div class="mt-6 flex items-center gap-3 text-sm text-surface-500"> <span class="flex items-center gap-1.5"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> ${product.stock > 0 ? `${product.stock} in stock` : "Out of stock"} </span> ${hasDiscount && renderTemplate`<span class="flex items-center gap-1.5"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
Compare at Rs. $${(product.compareAtPriceCents / 100).toFixed(2)} </span>`} </div> <button id="add-to-cart"${addAttribute(product.slug, "data-slug")}${addAttribute(product.name, "data-name")}${addAttribute(product.priceCents, "data-price")}${addAttribute(product.imageUrl || "", "data-image")} class="btn-primary btn-lg w-full mt-8 text-base">
Add to Cart
</button> <div class="mt-6 grid grid-cols-2 gap-3 text-center text-xs text-surface-500"> <div class="p-3 rounded-lg bg-surface-50"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mx-auto mb-1 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path> </svg>
Free shipping over Rs. 5,000
</div> <div class="p-3 rounded-lg bg-surface-50"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mx-auto mb-1 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path> </svg>
30-day returns
</div> </div> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/products/[slug].astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/products/[slug].astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/products/[slug].astro";
const $$url = "/products/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
