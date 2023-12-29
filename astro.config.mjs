import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import astroExpressiveCode from 'astro-expressive-code';


import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
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
      configFile: './tailwind.config.mjs',

    }),    
    
  ],
  adapter: vercel()
});