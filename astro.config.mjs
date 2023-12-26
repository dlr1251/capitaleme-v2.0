import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import starlight from '@astrojs/starlight';
import vercel from "@astrojs/vercel/serverless";

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
    tailwind({
      applyBaseStyles: true
    }),
    starlight({
      title: 'My delightful guides site',
    }),
  ],
  adapter: vercel()
});