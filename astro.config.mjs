import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import astroExpressiveCode from 'astro-expressive-code';
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
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
  integrations: [astroExpressiveCode(), mdx(), tailwind({
    applyBaseStyles: true,
    configFile: './tailwind.config.mjs'
  }), react()],
  adapter: vercel({
    edgeMiddleware: true,
  })
});