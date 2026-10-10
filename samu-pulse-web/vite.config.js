import {defineConfig} from 'vite'
import {readFileSync} from 'node:fs'
import {selectPrecacheEntries} from './pwa-cache.js'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
  build: {manifest: true},
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: [],
      manifest: {
        id: '/',
        name: 'SAMU Pulse',
        short_name: 'SAMU Pulse',
        description: 'Acompanhamento de membros e histórico de mensagens da juventude.',
        lang: 'pt-BR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#2587d7',
        background_color: '#eff7f6',
        icons: [
          {src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
          {src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
          {src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
        ],
      },
      workbox: {
        globPatterns: ['index.html', 'assets/**/*.{js,css,png,svg,woff2}'],
        manifestTransforms: [
          async entries => ({
            manifest: selectPrecacheEntries(entries, JSON.parse(
              readFileSync(new URL('./dist/.vite/manifest.json', import.meta.url), 'utf8'),
            )),
            warnings: [],
          }),
        ],
        navigateFallbackDenylist: [/^\/api(?:\/|$)/],
        cleanupOutdatedCaches: true,
        // Telas e imagens adicionais entram no cache apenas quando usadas.
        runtimeCaching: [{
          urlPattern: ({url, sameOrigin}) => sameOrigin && (
            /^\/assets\/.*\.(?:js|css|png|svg|woff2)$/.test(url.pathname)
            || /^\/pwa-(?:180|192|512)\.png$/.test(url.pathname)
          ),
          handler: 'CacheFirst',
          options: {
            cacheName: 'samu-static-on-demand',
            expiration: {maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60},
            cacheableResponse: {statuses: [200]},
          },
        }],
      },
    }),
  ],
})
