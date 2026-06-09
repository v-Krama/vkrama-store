globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as defineMiddleware, s as sequence } from './chunks/render-context_XB0x_eiV.mjs';
import './chunks/astro-designed-error-pages_BlQuCbak.mjs';
import './chunks/astro/server_DFXjdrHI.mjs';

const onRequest$2 = defineMiddleware((context, next) => {
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
