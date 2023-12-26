import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import starlight from '@astrojs/starlight';
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
      applyBaseStyles: true
    }), 
    starlight({
      title: 'Capital M Law',
      defaultLocale: 'en',
      locales: {
        // English docs in `src/content/docs/en/`
        en: {
          label: 'English'
        },
        es: {
          label: 'Espanol'
        }
      },
      sidebar: [
      // A link to the CSS & Styling guide.
      {
        label: 'CSS & Styling',
        link: '/guides/css-and-tailwind/'
      },
      // An external link to the Astro website.
      {
        label: 'Astro',
        link: 'https://astro.build/'
      }]
    }), 
    
  ],
  adapter: vercel()
});