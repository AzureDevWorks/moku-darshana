import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/moku-darshana/',
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.svg',
        'icons.svg'
      ],

      manifest: {
        id: '/moku-darshana/',
        name: 'Moku Darśana',
        short_name: 'Moku Darśana',
        description: 'A contemplative digital library for sacred Sanskrit texts, recitation, meaning, and spiritual reading.',
        start_url: '/moku-darshana/',
        scope: '/moku-darshana/',
        display: 'standalone',
        orientation: 'portrait-primary',

        theme_color: '#24170f',
        background_color: '#0f0a07',

        lang: 'en',

        categories: [
          'education',
          'books',
          'lifestyle'
        ],

        icons: [
          {
            src: '/moku-darshana/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/moku-darshana/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/moku-darshana/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        cleanupOutdatedCaches: true,

        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

        navigateFallback: '/moku-darshana/index.html',

        globPatterns: [
          '**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff,woff2}'
        ],

        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'moku-darshana-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },

          {
            urlPattern: /\.(?:mp3|wav|ogg|m4a)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'moku-darshana-audio',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      }
    })
  ]
})




