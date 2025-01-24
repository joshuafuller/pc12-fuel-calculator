import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['plane.svg'],
      manifest: {
        name: 'PC-12 Fuel Calculator',
        short_name: 'Fuel Calc',
        description: 'Calculate fuel loads for PC-12 aircraft',
        theme_color: '#1e40af',
        background_color: '#1e3a8a',
        display: 'standalone',
        icons: [
          {
            src: 'plane.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
  },
});