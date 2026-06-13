import { defineMiddleware } from 'astro:middleware'

function getAdminSlug(): string {
  return (typeof process !== 'undefined' && process.env?.['PUBLIC_ADMIN_SLUG'])
    || (typeof import.meta !== 'undefined' && (import.meta as any).env?.['PUBLIC_ADMIN_SLUG'])
    || 'portal'
}

export const onRequest = defineMiddleware(async (context, next) => {
  const env = (context.locals as any).runtime?.env

  if (env) {
    for (const key of Object.keys(env)) {
      if (typeof env[key] === 'string') {
        process.env[key] = env[key]
      }
    }
  }

  const url = new URL(context.request.url)
  const pathParts = url.pathname.split('/').filter(Boolean)

  if (pathParts[0] === 'admin' && pathParts[1]) {
    const adminSlug = getAdminSlug()

    if (pathParts[1] !== adminSlug) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/404' },
      })
    }

    if (!pathParts[2]) {
      return new Response(null, {
        status: 302,
        headers: { Location: `/admin/${adminSlug}/login` },
      })
    }
  }

  return next()
})
