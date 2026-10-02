import { defineConfig, envField } from 'astro/config'
import mdx from '@astrojs/mdx'
import compress from 'astro-compress'
import icon from 'astro-icon'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel/serverless'
import { fileURLToPath } from 'url'

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  site: 'https://withinly.app',

  // Server secrets are read from process.env at runtime; a missing required one fails the build (validateSecrets).
  env: {
    schema: {
      MAILJET_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      MAILJET_API_SECRET: envField.string({ context: 'server', access: 'secret' }),
      MAILJET_LIST_ID: envField.string({ context: 'server', access: 'secret' }),
      WAITLIST_WEBHOOK_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      WAITLIST_WEBHOOK_URL: envField.string({
        context: 'server',
        access: 'secret',
        url: true,
        optional: true,
        default: 'https://api.withinly.app/api/webhook/waitlist-confirmation-email',
      }),
      SIGNUP_ALLOWED_ORIGINS: envField.string({ context: 'server', access: 'secret' }),
    },
    validateSecrets: true,
  },

  // Astro's own check compares Origin with a request URL that is localhost behind Vercel, so it would refuse every
  // form POST; every POST handler calls assertAllowedOrigin (src/lib/origin.ts) instead.
  security: {
    checkOrigin: false,
  },

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
      },
    },
  },

  // Build configuration for multilingual sites
  build: {
    inlineStylesheets: 'auto',
  },

  // Output configuration
  output: 'server',

  // Adapter configuration for Vercel
  adapter: vercel({
    // Optional: Configure image optimization
    imageService: true,
    // Optional: Configure function settings
    functionPerRoute: false,
  }),

  // Markdown configuration with language support
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      langs: [],
      wrap: true,
    },
  },
})
