globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as defineMiddleware, s as sequence } from './chunks/render-context_CJMX2Z6i.mjs';
import './chunks/astro-designed-error-pages_Bes8WqkV.mjs';
import './chunks/astro/server_Ce7Lw4RO.mjs';

const onRequest$2 = defineMiddleware(async (context, next) => {
  const env = context.locals.runtime?.env;
  if (env) {
    for (const key of Object.keys(env)) {
      if (typeof env[key] === "string") {
        process.env[key] = env[key];
      }
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
