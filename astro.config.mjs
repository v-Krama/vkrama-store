import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

const messageChannelPolyfill = `if (typeof globalThis.MessageChannel === 'undefined') {
  globalThis.MessageChannel = class {
    constructor() {
      let onmessage = null;
      this.port1 = {
        set onmessage(fn) { onmessage = fn; },
        get onmessage() { return onmessage; },
        postMessage() {},
        close() {},
        start() {},
      };
      this.port2 = {
        postMessage(...args) {
          queueMicrotask(() => {
            if (typeof onmessage === 'function') onmessage({ data: args[0] });
          });
        },
        close() {},
        start() {},
      };
    }
  };
}`

export default defineConfig({
  site: 'https://vkrama.com.np',
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    session: false,
  }),
  integrations: [
    tailwind(),
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin/') && !page.includes('/api/') && !page.includes('/auth/'),
    }),
  ],
  vite: {
    plugins: [
      {
        name: 'message-channel-polyfill',
        enforce: 'post',
        apply: 'build',
        renderChunk(code, chunk) {
          if (chunk.fileName.includes('_@astro-renderers')) {
            return messageChannelPolyfill + '\n' + code
          }
          return null
        },
      },
    ],
    resolve: {
      conditions: ['workerd', 'worker'],
    },
  },
})
