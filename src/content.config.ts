import { z, defineCollection } from "astro:content";
import { glob, file } from 'astro/loaders';

const posts = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', }),
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      readTime: z.string(),
      author: z.string(),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      tags: z.array(z.string())
    })
});

const countries = defineCollection({
    loader: file("src/content/countries/Countries.json"),
    schema: z.object({
      name: z.string(),
      treaties: z.array(z.string()),   
      excempted: z.string(),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
    })
});

const resources = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', }),
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      lastEditDate: z.date(),
      description: z.string(),
      author: z.string(),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      tags: z.array(z.string()).optional(),
      docType: z.array(z.string()).optional(),
      legalArea: z.array(z.string()).optional()
    })
});


const visas = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', }),
  schema: z.object({
    title: z.string(),
    type: z.string(),
    beneficiaries: z.array(z.string()),
    workPermit: z.array(z.string()),
    sponsored: z.array(z.string()),
    article: z.number().optional(),
    popular: z.boolean().optional(),
    short_description: z.string().optional(),
    requirements: z.array(z.string()).optional(),
    countries: z.array(z.string()),
    visa_rara: z.z.boolean().optional()
  })
});

// const authors = defineCollection({
//   loader: glob({ pattern: '**/[^_]*.{md,mdx}', }),
//   schema: ({ image }) => z.object({
//     name: z.string(),
//     role: z.string(),
//     email: z.string().email(), // Ensures it's a valid email format
//     image: z.string(), // Matches 'image' key in Markdown
//     bio: z.string(),
//     socialLinks: z.object({
//       facebook: z.string().url().optional(), // Optional URL
//       twitter: z.string().url().optional(),
//       linkedin: z.string().url().optional(),
//     }).optional(),
//   })
// });

export const collections = {
  'posts': posts,
  'resources': resources,  
  'visas': visas,
  // 'countries': countries,
  // 'authors': authors,
};

