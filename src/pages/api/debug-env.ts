import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env
  const keys = env ? Object.keys(env) : []
  const types = keys.map(k => `${k}: ${typeof env[k]} = ${env[k] === null ? 'null' : env[k] === undefined ? 'undefined' : typeof env[k] === 'object' ? Object.keys(env[k] || {}).join(',') : String(env[k]).slice(0, 50)}`)
  return new Response(JSON.stringify({
    hasEnv: !!env,
    runtimeExists: !!(locals as any).runtime,
    keyCount: keys.length,
    types,
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const POST: APIRoute = async ({ locals, request }) => {
  const env = (locals as any).runtime?.env
  const keys = env ? Object.keys(env) : []
  return new Response(JSON.stringify({
    hasEnv: !!env,
    hasDB: !!env?.DB,
    keys,
    method: request.method,
  }), {
    headers: { 'Content-Type': 'application/json' },
  })
}