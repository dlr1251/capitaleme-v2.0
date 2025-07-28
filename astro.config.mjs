import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import partytown from "@astrojs/partytown";
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';

// https://astro.build/config
export default defineConfig({
  output: 'server',  
  site: 'https://www.capitaleme.com',
  
  // Performance optimizations
  build: {
    inlineStylesheets: 'auto',
  },
  
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'heroicons': ['@heroicons/react'],
            'utils': ['clsx', 'clsx/lite'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    ssr: {
      noExternal: ['@heroicons/react']
    },
    optimizeDeps: {
      include: ['react', 'react-dom', '@heroicons/react']
    },
    resolve: {
      alias: {
        'whatwg-url': 'whatwg-url/lib/public-api.js'
      }
    },
    define: {
      global: 'globalThis',
      'process.platform': '"browser"',
      'process.version': '"v16.0.0"'
    },
    server: {
      fs: {
        allow: ['..']
      }
    },
    plugins: []
  },
  
  image: {
    domains: ["astro.build"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
  markdown: {
    theme: 'github-light',
    wrap: true,
    remarkPlugins: [remarkGfm]
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: true
    }
  },
  integrations: [
    mdx(), 
    react(), 
    sitemap(),
    tailwind({
      applyBaseStyles: true,
      configFile: './tailwind.config.mjs'
    }), 
    partytown({
      config: {
        forward: ['dataLayer.push'],
        debug: false, // Disable debug for production
      }
    })
  ],
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  })
});