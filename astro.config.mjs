import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import astroExpressiveCode from 'astro-expressive-code';
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://capitaleme.com',
  image: {
    domains: ["astro.build"]
  },
  markdown: {
    // remarkPlugins: [remarkReadingTime]
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    fallback: {
      es: "en"
    },
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [
    astroExpressiveCode(), 
    mdx(), 
    tailwind({
      applyBaseStyles: true,
      configFile: './tailwind.config.mjs'
    }), 
    react(), 
    partytown({      
      config: {
        forward: ['dataLayer.push'],
      },
    })
  ],
  adapter: vercel({
    edgeMiddleware: true
  })
});