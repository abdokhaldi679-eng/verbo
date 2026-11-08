import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string }

// CSP injectée uniquement dans le build : le serveur de développement Vite
// utilise des scripts inline et une websocket pour le HMR.
function contentSecurityPolicy(): Plugin {
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self' blob:",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join('; ')

  return {
    name: 'verbo-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content: policy },
            injectTo: 'head-prepend',
          },
        ],
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Chemins relatifs : indispensable pour charger l'app depuis file:// dans Electron.
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    contentSecurityPolicy(),
    VitePWA({
      registerType: 'autoUpdate',
      // L'enregistrement du service worker est fait dans src/main.tsx,
      // uniquement en HTTP(S), pour ne pas échouer dans Electron (file://).
      injectRegister: null,
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png', 'maskable-512.png'],
      manifest: {
        name: 'Verbo — Apprends les langues',
        short_name: 'Verbo',
        description:
          'Application open source d’apprentissage des langues : 20 langues, leçons courtes, répétition espacée et progression gamifiée.',
        lang: 'fr',
        theme_color: '#4f46e5',
        background_color: '#f4f5fb',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})
