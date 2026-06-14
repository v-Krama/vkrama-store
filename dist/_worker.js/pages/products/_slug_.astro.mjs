globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, q as Fragment, h as addAttribute } from '../../chunks/astro/server_DUQEdt6X.mjs';
import { j as jsxRuntimeExports, $ as $$Base } from '../../chunks/Base_LuIWtNvf.mjs';
import { a as reactExports } from '../../chunks/_@astro-renderers_eNrc7DJ3.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_eNrc7DJ3.mjs';
import { $ as $$ProductCard } from '../../chunks/ProductCard_BsYlTPCN.mjs';
import { g as getDb } from '../../chunks/db_DcVNGvRk.mjs';
import { p as products, e as eq, L as categories, K as productCategories, f as productVariants, R as variantOptions, s as sql } from '../../chunks/schema_na8qKZKe.mjs';

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

const $$Astro = createAstro("https://vkrama.com.np");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const env = Astro2.locals.runtime?.env;
  let product = null;
  let relatedProducts = [];
  if (env?.DB && slug) {
    const db = getDb(env.DB);
    try {
      product = await db.select().from(products).where(eq(products.slug, slug)).get();
      if (product) {
        const cats = await db.select({ id: categories.id, name: categories.name, slug: categories.slug }).from(categories).innerJoin(productCategories, eq(categories.id, productCategories.categoryId)).where(eq(productCategories.productId, product.id)).all();
        const variants = await db.select().from(productVariants).where(eq(productVariants.productId, product.id)).orderBy(productVariants.sortOrder).all();
        const options = await db.select().from(variantOptions).where(eq(variantOptions.productId, product.id)).orderBy(variantOptions.sortOrder).all();
        product.categories = cats;
        product.variants = variants;
        product.variantOptions = options;
        if (cats.length > 0) {
          relatedProducts = await db.select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            priceCents: products.priceCents,
            compareAtPriceCents: products.compareAtPriceCents,
            stock: products.stock,
            imageUrl: products.imageUrl,
            status: products.status
          }).from(products).innerJoin(productCategories, eq(products.id, productCategories.productId)).where(sql`${productCategories.categoryId} IN (${sql.join(cats.map((c) => c.id), sql`, `)}) AND ${products.id} != ${product.id}`).groupBy(products.id).limit(4).all();
        }
      }
    } catch {
    }
  }
  if (!product) {
    return Astro2.redirect("/404");
  }
  const images = [product.imageUrl, ...JSON.parse(product.images || "[]")].filter(Boolean);
  product.seoTitle || product.name;
  const seoDesc = product.seoDescription || product.description?.slice(0, 160) || `Shop ${product.name} at vkrama`;
  const hasDiscount = product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents;
  const discountPercent = hasDiscount ? Math.round((1 - product.priceCents / product.compareAtPriceCents) * 100) : 0;
  const hasRelated = relatedProducts.length > 0;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": product.name, "description": seoDesc, "image": product.imageUrl || "/og-image.png" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-6 lg:py-8"> <!-- Breadcrumb --> <nav class="flex items-center gap-2 text-sm text-surface-500 mb-6 flex-wrap"> <a href="/" class="hover:text-brand-600 transition-colors">Home</a> <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg> <a href="/products" class="hover:text-brand-600 transition-colors">Products</a> ${product.categories?.length > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg> <a${addAttribute(`/products?category=${product.categories[0].slug}`, "href")} class="hover:text-brand-600 transition-colors">${product.categories[0].name}</a> ` })}`} <svg class="w-3.5 h-3.5 shrink-0 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg> <span class="text-surface-900 font-medium truncate max-w-[200px] hidden sm:block">${product.name}</span> </nav> <!-- Product Main --> <div class="grid lg:grid-cols-2 gap-8 lg:gap-14"> <!-- Gallery --> <div class="lg:sticky lg:top-24 lg:self-start"> ${renderComponent($$result2, "ProductGallery", ProductGallery, { "client:load": true, "images": images, "name": product.name, "client:component-hydration": "load", "client:component-path": "/home/v-krama/vkrama-store/src/components/product/ProductGallery.tsx", "client:component-export": "default" })} </div> <!-- Product Info --> <div class="flex flex-col"> <!-- Badge --> ${hasDiscount && renderTemplate`<span class="inline-flex items-center gap-1.5 rounded-full bg-accent-50 text-accent-700 px-3.5 py-1 text-xs font-semibold border border-accent-200/50 mb-4 w-fit"> <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
Save ${discountPercent}% — Limited time offer
</span>`} <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-surface-900 leading-tight tracking-tight">${product.name}</h1> <!-- Rating placeholder --> <div class="flex items-center gap-2 mt-3"> <div class="flex items-center"> ${[1, 2, 3, 4, 5].map((s) => renderTemplate`<svg${addAttribute(s, "key")}${addAttribute(`w-4 h-4 ${s <= 4 ? "text-amber-400" : "text-surface-200"}`, "class")} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`)} </div> <span class="text-sm text-surface-400">(12 reviews)</span> </div> <!-- Price --> <div class="flex items-baseline gap-3 mt-5"> <span class="text-3xl md:text-4xl font-bold text-surface-900 tracking-tight">Rs. ${(product.priceCents / 100).toFixed(2)}</span> ${hasDiscount && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <span class="text-xl text-surface-400 line-through">Rs. ${(product.compareAtPriceCents / 100).toFixed(2)}</span> <span class="badge-red text-xs font-bold">-${discountPercent}%</span> ` })}`} </div>  <p class="text-xs text-surface-400 mt-1">Inclusive of all taxes. Free shipping over Rs. 5,000.</p>  <div class="mt-7"> ${renderComponent($$result2, "VariantSelector", VariantSelector, { "client:load": true, "options": product.variantOptions || [], "variants": product.variants || [], "basePriceCents": product.priceCents, "client:component-hydration": "load", "client:component-path": "/home/v-krama/vkrama-store/src/components/product/VariantSelector.tsx", "client:component-export": "default" })} </div>  <div class="mt-7"> <p class="text-surface-600 leading-relaxed text-sm">${product.description || "No description available."}</p> </div>  <div class="flex items-center gap-4 mt-5 text-sm"> <span class="flex items-center gap-1.5"> <span${addAttribute(`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`, "class")}></span> <span class="text-surface-600">${product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}</span> </span> ${hasDiscount && renderTemplate`<span class="text-surface-400">Was <span class="line-through">Rs. ${(product.compareAtPriceCents / 100).toFixed(2)}</span></span>`} </div>  <div class="mt-7 flex gap-3"> <div class="flex items-center rounded-xl bg-surface-100 border border-surface-200 overflow-hidden shrink-0"> <button id="qty-minus" class="p-3 hover:bg-surface-200 transition-colors disabled:opacity-30" disabled> <svg class="w-4 h-4 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg> </button> <span id="qty-display" class="px-4 py-3 text-sm font-semibold text-surface-900 min-w-[3rem] text-center select-none">1</span> <button id="qty-plus" class="p-3 hover:bg-surface-200 transition-colors"> <svg class="w-4 h-4 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> </button> </div> <button id="add-to-cart"${addAttribute(product.slug, "data-slug")}${addAttribute(product.name, "data-name")}${addAttribute(product.priceCents, "data-price")}${addAttribute(product.imageUrl || "", "data-image")} class="flex-1 inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-brand-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"> <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
Add to Cart
</button> </div>  <div class="mt-7 grid grid-cols-3 gap-3"> <div class="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface-50 border border-surface-100"> <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg> <span class="text-2xs text-surface-500 text-center leading-tight">Free Shipping<br>Over Rs. 5K</span> </div> <div class="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface-50 border border-surface-100"> <svg class="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span class="text-2xs text-surface-500 text-center leading-tight">Secure<br>Checkout</span> </div> <div class="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface-50 border border-surface-100"> <svg class="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> <span class="text-2xs text-surface-500 text-center leading-tight">30-Day<br>Returns</span> </div> </div> </div> </div> <!-- Product details tabs --> <div class="mt-14 lg:mt-20"> <div class="border-b border-surface-200"> <div class="flex gap-0 -mb-px"> <button class="tab-btn active px-5 py-3.5 text-sm font-semibold text-brand-600 border-b-2 border-brand-600 transition-colors" data-tab="details">Details</button> <button class="tab-btn px-5 py-3.5 text-sm font-semibold text-surface-400 hover:text-surface-700 border-b-2 border-transparent transition-colors" data-tab="reviews">Reviews (12)</button> <button class="tab-btn px-5 py-3.5 text-sm font-semibold text-surface-400 hover:text-surface-700 border-b-2 border-transparent transition-colors" data-tab="shipping">Shipping Info</button> </div> </div> <div class="py-8"> <div id="tab-details" class="tab-content"> <div class="prose prose-sm max-w-none text-surface-600 leading-relaxed"> <p>${product.description || "No details available for this product."}</p> ${product.brand && renderTemplate`<p class="mt-4"><strong>Brand:</strong> ${product.brand}</p>`} ${product.gtin && renderTemplate`<p><strong>GTIN:</strong> ${product.gtin}</p>`} ${product.hsCode && renderTemplate`<p><strong>HS Code:</strong> ${product.hsCode}</p>`} ${product.weight && renderTemplate`<p><strong>Weight:</strong> ${product.weight}g</p>`} ${product.tags && renderTemplate`<p class="mt-3"><strong>Tags:</strong> ${product.tags.split(",").map((t) => t.trim()).filter(Boolean).join(", ")}</p>`} </div> </div> <div id="tab-reviews" class="tab-content hidden"> <div class="text-center py-12 text-surface-400"> <svg class="w-12 h-12 mx-auto mb-3 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg> <p class="text-sm">Reviews coming soon. Be the first to review!</p> </div> </div> <div id="tab-shipping" class="tab-content hidden"> <div class="max-w-prose text-sm text-surface-600 leading-relaxed space-y-3"> <div class="flex items-start gap-3 p-4 rounded-xl bg-surface-50"> <svg class="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg> <div><strong>Free Shipping</strong> on all orders over Rs. 5,000 within Nepal.</div> </div> <div class="flex items-start gap-3 p-4 rounded-xl bg-surface-50"> <svg class="w-5 h-5 text-accent-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <div><strong>Delivery Time:</strong> 3-7 business days across Nepal. Same-day delivery within Kathmandu Valley for orders placed before 2 PM.</div> </div> <div class="flex items-start gap-3 p-4 rounded-xl bg-surface-50"> <svg class="w-5 h-5 text-purple-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> <div><strong>Easy Returns:</strong> 30-day return policy. Items must be unused and in original packaging.</div> </div> </div> </div> </div> </div> <!-- Related Products --> ${hasRelated && renderTemplate`<section class="mt-14 lg:mt-20 pt-10 lg:pt-14 border-t border-surface-200"> <div class="flex items-end justify-between gap-4 mb-8"> <div> <span class="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 mb-3">You May Also Like</span> <h2 class="text-2xl md:text-3xl font-bold text-surface-900 tracking-tight">Related Products</h2> </div> <a href="/products" class="btn-secondary btn-sm shrink-0 hidden sm:flex">
View All
<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg> </a> </div> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"> ${relatedProducts.map((rp) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "slug": rp.slug, "name": rp.name, "priceCents": rp.priceCents, "compareAtPriceCents": rp.compareAtPriceCents, "imageUrl": rp.imageUrl, "status": rp.status })}`)} </div> </section>`} </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/products/[slug].astro?astro&type=script&index=0&lang.ts")}`;
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
