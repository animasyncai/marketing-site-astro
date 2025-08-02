import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import compress from 'astro-compress'
import icon from 'astro-icon'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  site: 'https://withinly.com',

  // Internationalization configuration
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'lt'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false, // Changed from true to false
    },
    fallback: {
      lt: 'en',
    },
  },

  // Remove redirects - these conflict with i18n routing
  // redirects: {
  //   '/home': '/',
  //   '/lt/home': '/lt/',
  // },

  integrations: [
    mdx(),
    icon(),
    compress({
      CSS: true,
      HTML: {
        'remove-tag-whitespace': false,
        'collapse-whitespace': false,
      },
      Image: true,
      JavaScript: true,
      SVG: true,
    }),
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          logger: {
            warn: () => {},
          },
        },
      },
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@content': fileURLToPath(new URL('./src/content', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@public': fileURLToPath(new URL('./public', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
        '@post-images': fileURLToPath(new URL('./public/posts', import.meta.url)),
        '@project-images': fileURLToPath(new URL('./public/projects', import.meta.url)),
      },
    },
  },

  // Build configuration for multilingual sites
  build: {
    inlineStylesheets: 'auto',
  },

  // Output configuration
  output: 'server',

  // Markdown configuration with language support
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      langs: [],
      wrap: true,
    },
  },
})
