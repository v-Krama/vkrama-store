globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, l as renderScript, r as renderTemplate, k as renderComponent, o as renderSlot, n as renderHead, u as unescapeHTML, h as addAttribute } from './astro/server_B3LaWqT_.mjs';
/* empty css                              */
import { a as reactExports } from './_@astro-renderers_Drbtiq9T.mjs';

const $$Astro$1 = createAstro("https://vkrama.com");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Header;
  const { pathname } = Astro2.url;
  return renderTemplate`${maybeRenderHead()}<header class="bg-white border-b border-surface-200 sticky top-0 z-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex items-center justify-between h-16 md:h-20"> <div class="flex items-center gap-8"> <button id="mobile-menu-btn" class="md:hidden btn-ghost btn-icon -ml-2" aria-label="Menu"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> <a href="/" class="text-xl md:text-2xl font-extrabold text-brand-600 tracking-tight">
vkrama
</a> <nav class="hidden md:flex items-center gap-1"> <a href="/products" class="px-3 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-50 rounded-lg transition-colors">
Products
</a> <a href="/products?category=electronics" class="px-3 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-50 rounded-lg transition-colors">
Electronics
</a> <a href="/products?category=clothing" class="px-3 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-50 rounded-lg transition-colors">
Clothing
</a> </nav> </div> <div class="flex items-center gap-2 md:gap-3"> <button id="search-btn" class="btn-ghost btn-icon hidden sm:flex" aria-label="Search"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </button> <a href="/account/orders" class="btn-ghost btn-icon hidden sm:flex" aria-label="My Account"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </a> <button id="cart-btn" class="btn-ghost btn-icon relative" aria-label="Cart"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path> </svg> <span id="cart-count" class="absolute -top-1 -right-1 bg-brand-600 text-white text-2xs font-bold rounded-full h-4 min-w-[1rem] px-1 flex items-center justify-center hidden">0</span> </button> </div> </div> </div> <div id="mobile-menu" class="hidden md:hidden border-t border-surface-200 bg-white animate-slide-down"> <nav class="px-4 py-3 space-y-1"> <a href="/products" class="block px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 rounded-lg">Products</a> <a href="/products?category=electronics" class="block px-3 py-2.5 text-sm text-surface-600 hover:bg-surface-50 rounded-lg">Electronics</a> <a href="/products?category=clothing" class="block px-3 py-2.5 text-sm text-surface-600 hover:bg-surface-50 rounded-lg">Clothing</a> <a href="/products?category=home-living" class="block px-3 py-2.5 text-sm text-surface-600 hover:bg-surface-50 rounded-lg">Home & Living</a> <hr class="my-2 border-surface-200"> <a href="/account/orders" class="block px-3 py-2.5 text-sm text-surface-600 hover:bg-surface-50 rounded-lg">My Account</a> <a href="/search" class="block px-3 py-2.5 text-sm text-surface-600 hover:bg-surface-50 rounded-lg">Search</a> </nav> </div> <div id="search-overlay" class="hidden fixed inset-0 z-50"> <div class="absolute inset-0 bg-surface-900/50 backdrop-blur-sm" id="search-overlay-bg"></div> <div class="relative max-w-2xl mx-auto px-4 pt-20"> <div class="bg-white rounded-xl shadow-2xl border border-surface-200 p-4 animate-slide-up"> <div class="relative"> <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> <input type="text" id="search-input" placeholder="Search products..." class="w-full pl-10 pr-4 py-3 text-sm border border-surface-300 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500" autofocus> </div> <div id="search-results" class="mt-4 hidden"> <div class="space-y-2" id="search-results-list"></div> </div> <div id="search-empty" class="hidden text-center py-8 text-surface-400 text-sm">
Start typing to search products...
</div> </div> </div> </div> </header> ${renderScript($$result, "/home/v-krama/vkrama-store/src/components/layout/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/components/layout/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-surface-900 text-surface-300 mt-auto"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"> <div class="lg:col-span-2"> <a href="/" class="text-2xl font-extrabold text-white tracking-tight">vkrama</a> <p class="mt-3 text-sm text-surface-400 max-w-md leading-relaxed">
Curated collection of premium products. Quality you can trust, prices you'll love.
          Shop with confidence at vkrama.
</p> <div class="mt-6"> <p class="text-sm font-medium text-white mb-3">Subscribe for deals & new arrivals</p> <form id="newsletter-form" class="flex gap-2 max-w-sm"> <input type="email" placeholder="Enter your email" class="flex-1 px-3.5 py-2.5 text-sm rounded-lg bg-surface-800 border border-surface-700 text-white placeholder-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500" required> <button type="submit" class="btn-primary btn-sm shrink-0">Subscribe</button> </form> <p id="newsletter-msg" class="text-xs text-surface-400 mt-2 hidden"></p> </div> </div> <div> <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h4> <ul class="space-y-2.5"> <li><a href="/products" class="text-sm text-surface-400 hover:text-white transition-colors">All Products</a></li> <li><a href="/products?category=electronics" class="text-sm text-surface-400 hover:text-white transition-colors">Electronics</a></li> <li><a href="/products?category=clothing" class="text-sm text-surface-400 hover:text-white transition-colors">Clothing</a></li> <li><a href="/products?category=home-living" class="text-sm text-surface-400 hover:text-white transition-colors">Home & Living</a></li> </ul> </div> <div> <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4> <ul class="space-y-2.5"> <li><a href="/account/orders" class="text-sm text-surface-400 hover:text-white transition-colors">My Orders</a></li> <li><a href="/cart" class="text-sm text-surface-400 hover:text-white transition-colors">Shopping Cart</a></li> <li><a href="/auth/login" class="text-sm text-surface-400 hover:text-white transition-colors">Sign In</a></li> <li><a href="/admin/login" class="text-sm text-surface-400 hover:text-white transition-colors">Admin</a></li> </ul> </div> </div> <div class="mt-10 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4"> <p class="text-xs text-surface-500">
&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} vkrama. All rights reserved.
</p> <div class="flex items-center gap-4"> <span class="text-xs text-surface-500">Secure payments powered by Stripe</span> <svg class="h-6 w-auto text-surface-500" viewBox="0 0 48 16" fill="currentColor"><path d="M6.5 0C3.5 0 1.5 2 1.5 5c0 2.5 1.5 4 4 4 1.5 0 2.5-.5 3.5-1.5l-1-1c-.5.5-1.5 1-2.5 1-1.5 0-2.5-1-2.5-2.5h7V4C10.5 1.5 8.5 0 6.5 0zm-3 4c0-1.5 1-2.5 2.5-2.5s2 1 2 2.5h-4.5zM13 8V2h1.5v6H13zm0-8h1.5v1.5H13V0zm4 8c-1.5 0-2.5-1-2.5-2.5V2h1.5v3.5c0 1 .5 1.5 1.5 1.5s1.5-.5 1.5-1.5V2h1.5v3.5C19 7 18 8 17 8zm7-6c-1 0-2 .5-2.5 1.5h0V8h-1.5V2H21v1.2c.5-.8 1.5-1.2 2.5-1.2 2 0 3 1.5 3 3.5V8h-1.5V5.5c0-1.5-.5-2.5-2-2.5h0zM5 12c-2 0-3.5 1.5-3.5 3.5C1.5 18 3 19.5 5 19.5s3.5-1.5 3.5-3.5C8.5 13.5 7 12 5 12zm0 6c-1.5 0-2.5-1-2.5-2.5S3.5 13 5 13s2.5 1 2.5 2.5S6.5 18 5 18zm4.5-6H11v7H9.5v-7zm11 0H22l-2 5-2-5h1.5l1 3 1-3z"></path></svg> </div> </div> </div> </footer> ${renderScript($$result, "/home/v-krama/vkrama-store/src/components/layout/Footer.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/components/layout/Footer.astro", void 0);

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;
	{
	  jsxRuntime.exports = requireReactJsxRuntime_production();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

function CartDrawer() {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [cart, setCart] = reactExports.useState([]);
  const [animating, setAnimating] = reactExports.useState(false);
  const [checkingOut, setCheckingOut] = reactExports.useState(false);
  const loadCart = reactExports.useCallback(() => {
    setCart(JSON.parse(localStorage.getItem("vkrama_cart") || "[]"));
  }, []);
  reactExports.useEffect(() => {
    loadCart();
    const handler = () => loadCart();
    window.addEventListener("cart-updated", handler);
    window.addEventListener("storage", handler);
    const openHandler = () => setIsOpen(true);
    window.addEventListener("open-cart", openHandler);
    return () => {
      window.removeEventListener("cart-updated", handler);
      window.removeEventListener("storage", handler);
      window.removeEventListener("open-cart", openHandler);
    };
  }, [loadCart]);
  function close() {
    setAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setAnimating(false);
    }, 200);
  }
  function updateQty(id, delta) {
    const newCart = [...cart];
    const item = newCart.find((i) => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      const idx = newCart.indexOf(item);
      newCart.splice(idx, 1);
    }
    setCart(newCart);
    localStorage.setItem("vkrama_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
  }
  function removeItem(id) {
    const newCart = cart.filter((i) => i.id !== id);
    setCart(newCart);
    localStorage.setItem("vkrama_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
  }
  const total = cart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (!isOpen && !animating) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-50 transition-opacity",
        style: { opacity: animating ? 0 : 1 },
        onClick: close
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-200 ${animating ? "translate-x-full" : "translate-x-0"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-4 border-b border-surface-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-surface-900", children: "Shopping Cart" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-surface-500", children: [
                itemCount,
                " item",
                itemCount !== 1 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: close, className: "btn-ghost btn-icon", "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M6 18L18 6M6 6l12 12" }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-4 space-y-3", children: cart.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center py-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-surface-300 mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1", d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-surface-500 font-medium", children: "Your cart is empty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-surface-400 text-sm mt-1", children: "Add some products to get started" })
          ] }) : cart.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3 rounded-xl bg-surface-50 animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-surface-100 rounded-lg overflow-hidden shrink-0", children: item.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.imageUrl, alt: item.name, className: "w-full h-full object-cover", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-surface-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-surface-900 truncate", children: item.name }),
              item.variantName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-surface-500", children: item.variantName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-surface-900 mt-1", children: [
                "$",
                (item.priceCents / 100).toFixed(2)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => updateQty(item.id, -1),
                    className: "w-7 h-7 flex items-center justify-center rounded-md border border-surface-300 text-surface-600 hover:bg-surface-100 text-sm",
                    children: "-"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-center text-sm font-medium", children: item.quantity }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => updateQty(item.id, 1),
                    className: "w-7 h-7 flex items-center justify-center rounded-md border border-surface-300 text-surface-600 hover:bg-surface-100 text-sm",
                    children: "+"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => removeItem(item.id),
                    className: "ml-auto text-xs text-red-500 hover:text-red-600 font-medium",
                    children: "Remove"
                  }
                )
              ] })
            ] })
          ] }, item.id)) }),
          cart.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-surface-200 px-4 py-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-surface-600", children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-surface-900", children: [
                "$",
                (total / 100).toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-surface-400", children: "Shipping & taxes calculated at checkout" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "/checkout",
                className: "btn-primary w-full btn-lg",
                onClick: close,
                children: "Checkout →"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: close, className: "btn-secondary w-full text-sm", children: "Continue Shopping" })
          ] })
        ]
      }
    )
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://vkrama.com");
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const {
    title,
    description = "Shop at vkrama \u2014 quality products, fair prices. Free shipping on orders over $50.",
    image = "/og-image.png",
    slug = "/"
  } = Astro2.props;
  const canonical = slug === "/" ? "https://vkrama.com" : `https://vkrama.com${slug}`;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', '><link rel="canonical"', '><meta property="og:type" content="website"><meta property="og:site_name" content="vkrama"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:image"', '><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><script type="application/ld+json">', "<\/script><title>", " \u2014 vkrama</title>", '</head> <body class="flex flex-col min-h-screen"> ', ' <main class="flex-1"> ', " </main> ", " ", " </body></html>"])), addAttribute(description, "content"), addAttribute(canonical, "href"), addAttribute(`${title} \u2014 vkrama`, "content"), addAttribute(description, "content"), addAttribute(canonical, "content"), addAttribute(`https://vkrama.com${image}`, "content"), addAttribute(`${title} \u2014 vkrama`, "content"), addAttribute(description, "content"), addAttribute(`https://vkrama.com${image}`, "content"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": slug === "/" ? "Store" : "WebPage",
    name: "vkrama",
    url: canonical,
    description,
    "@id": canonical,
    potentialAction: slug === "/" ? {
      "@type": "SearchAction",
      target: "https://vkrama.com/products?q={search_term_string}",
      "query-input": "required name=search_term_string"
    } : void 0
  })), title, renderHead(), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}), renderComponent($$result, "CartDrawer", CartDrawer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/v-krama/vkrama-store/src/components/cart/CartDrawer.tsx", "client:component-export": "default" }));
}, "/home/v-krama/vkrama-store/src/layouts/Base.astro", void 0);

export { $$Base as $, jsxRuntimeExports as j };
