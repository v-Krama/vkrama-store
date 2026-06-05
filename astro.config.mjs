import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'

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
        postMessage: function(...args) {
          queueMicrotask(function() {
            if (typeof onmessage === 'function') onmessage({ data: args[0] });
          });
        },
        close() {},
        start() {},
      };
    }
  };
}
`

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    tailwind(),
    react(),
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
