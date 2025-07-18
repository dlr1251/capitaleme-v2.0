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
    // fallback: {
    //   es: "en"
    // },
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
        debug: true,
      }
    })
  ],
  adapter: vercel({
    edgeMiddleware: true,
    webAnalytics: {
      enabled: true
    }
  })
});