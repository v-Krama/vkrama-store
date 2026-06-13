globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as defineMiddleware, s as sequence } from './chunks/render-context_RjDexUEQ.mjs';
import './chunks/astro-designed-error-pages_CS-aE2ZE.mjs';
import './chunks/astro/server_B3LaWqT_.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_ADMIN_SLUG": "portal", "PUBLIC_APP_NAME": "vkrama", "PUBLIC_APP_URL": "http://localhost:4321", "PUBLIC_R2_PUBLIC_URL": "https://pub-placeholder.r2.dev", "PUBLIC_STRIPE_KEY": "pk_test_placeholder", "SITE": "https://vkrama.com", "SSR": true};
function getAdminSlug() {
  return typeof process !== "undefined" && process.env?.["PUBLIC_ADMIN_SLUG"] || typeof import.meta !== "undefined" && Object.assign(__vite_import_meta_env__, { _: process.env._ })?.["PUBLIC_ADMIN_SLUG"] || "portal";
}
const onRequest$2 = defineMiddleware(async (context, next) => {
  const env = context.locals.runtime?.env;
  if (env) {
    for (const key of Object.keys(env)) {
      if (typeof env[key] === "string") {
        process.env[key] = env[key];
      }
    }
  }
  const url = new URL(context.request.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  if (pathParts[0] === "admin") {
    const adminSlug = getAdminSlug();
    if (!pathParts[1]) {
      return new Response(null, {
        status: 302,
        headers: { Location: `/admin/${adminSlug}/login` }
      });
    }
    if (pathParts[1] !== adminSlug) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/404" }
      });
    }
  }
  return next();
});

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	onRequest$2
	
);

export { onRequest };
