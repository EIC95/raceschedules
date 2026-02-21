import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    tailwindcss(),
    sitemap({
      hostname: 'https://raceschedules.ibrahima.dev',
      dynamicRoutes: ['/', '/championships/:slug', '/events/:slug'],
    })
  ],
})