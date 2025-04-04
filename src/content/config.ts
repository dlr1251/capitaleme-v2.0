import { defineCollection, z } from 'astro:content';
import { notionLoader } from 'notion-astro-loader';
import { glob, file } from 'astro/loaders';
import { getNotionPage } from '../lib/notion';


const pageCollection = defineCollection({
    loader: async () => {
        console.log('Running loader...');
        try {
          const page = await getNotionPage();
          console.log('Loader result:', page);
          if (!page) {
            console.error('No page data returned from getNotionPage');
            throw new Error('No data from Notion');
          }
          return [page];
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Loader error:', error.message);
          }
          throw error;
        }
      },
    schema: z.object({
      title: z.string(),
      content: z.string(),
      pubDate: z.string(),
    }),
  });

export const collections = {
  'page': pageCollection
}; 