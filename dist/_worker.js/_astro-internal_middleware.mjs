globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as defineMiddleware, s as sequence } from './chunks/render-context_CJMX2Z6i.mjs';
import './chunks/astro-designed-error-pages_Bes8WqkV.mjs';
import './chunks/astro/server_Ce7Lw4RO.mjs';

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "frame-src 'self' https://js.stripe.com https://m.stripe.network",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://api.stripe.com https://m.stripe.network https://api.resend.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join("; ");
const onRequest$2 = defineMiddleware(async (context, next) => {
  const env = context.locals.runtime?.env;
  if (env) {
    for (const key of Object.keys(env)) {
      if (typeof env[key] === "string") {
        process.env[key] = env[key];
      }
    }
  }
  const response = await next();
  const securityHeaders = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "X-XSS-Protection": "1; mode=block"
  };
  if (!context.url.pathname.startsWith("/api/")) {
    securityHeaders["Content-Security-Policy"] = CSP;
    securityHeaders["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
  }
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
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
