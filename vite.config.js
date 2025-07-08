import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['algoliasearch/lite'],
  },
  build: {
    commonjsOptions: {
      include: [/algoliasearch/, /node_modules/],
    },
  },
}); 