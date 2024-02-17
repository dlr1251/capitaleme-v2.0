import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import astroExpressiveCode from 'astro-expressive-code';
import mdx from "@astrojs/mdx";
import { remarkReadingTime } from '../capitalm-website/src/components/RemarkReadingTime.mjs';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  // build: {
  //   format: 'directory'
  // },  
  // trailingSlash: 'always',
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
  adapter: vercel()
});