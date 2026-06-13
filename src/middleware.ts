import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const env = (context.locals as any).runtime?.env

  if (env) {
    for (const key of Object.keys(env)) {
      if (typeof env[key] === 'string') {
        process.env[key] = env[key]
      }
    }
  }

  return next()
})
