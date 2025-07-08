import { defineCollection, z } from 'astro:content';
import { Client } from '@notionhq/client';
import { glob } from 'astro/loaders';
// import NotionToMarkdown from 'notion-to-md';
const notion = new Client({ auth: import.meta.env.NOTION_API_KEY });

// Define extended block type to include children
interface ExtendedBlock extends Record<string, any> {
  has_children?: boolean;
  children?: any[];
  id: string;
}

const postsCollection = defineCollection({
  type: 'content',
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

const resourcesCollection = defineCollection({
  type: 'content',
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
    lang: z.string().optional(),
    tags: z.array(z.string()).optional(),
    docType: z.array(z.string()).optional(),
    legalArea: z.array(z.string()).optional()
  })
});

const propertiesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/properties' }),
  schema: z.object({
    title: z.string(),
    lang: z.string(),
    featured: z.boolean(),
    location: z.string(),
    price: z.object({
      usd: z.number(),
      cop: z.number()
    }),
    area: z.object({
      total: z.number(),
      unit: z.string()
    }),
    pricePerM2: z.number(),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    propertyType: z.string(),
    status: z.enum(['available', 'sold', 'pending']),
    description: z.string(),
    features: z.array(z.string()).optional(),
    images: z.array(z.object({
      url: z.string(),
      alt: z.string()
    })),
    mainImage: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional(),
    contactInfo: z.object({
      phone: z.string().optional(),
      email: z.string().optional()
    }).optional()
  })
});

const authorsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    email: z.string(),
    image: z.string(),
    bio: z.string(),
    socialLinks: z.object({
      facebook: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional()
    }).optional()
  })
});

// Add visas collection to fix the missing collection error
const visasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    country: z.string(),
    visaType: z.string(),
    requirements: z.array(z.string()).optional(),
    processingTime: z.string().optional(),
    cost: z.string().optional(),
    lang: z.string().optional()
  })
});

// Rate limiting utility for Notion API calls
let lastApiCall = 0;
const RATE_LIMIT_DELAY = 1000; // 1 second between calls

async function rateLimitedApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  if (timeSinceLastCall < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastCall));
  }
  
  lastApiCall = Date.now();
  return apiCall();
}

async function fetchNestedBlocks(blockId: string, indentLevel: number = 0): Promise<ExtendedBlock[]> {
  const blocks: ExtendedBlock[] = [];
  let hasMore = true;
  let nextCursor: string | undefined;

  while (hasMore) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: nextCursor,
    });

    blocks.push(...response.results as ExtendedBlock[]);
    hasMore = response.has_more;
    nextCursor = response.next_cursor as string | undefined;
  }

  // Recursively fetch children for blocks that have them
  for (const block of blocks) {
    if (block.has_children) {
      block.children = await fetchNestedBlocks(block.id, indentLevel + 1);
    }
  }

  return blocks;
}

// Function to convert Notion blocks to Markdown
function blocksToMarkdown(blocks: ExtendedBlock[], indentLevel: number = 0): string {
  let markdown = '';
  let numberedListCounter = 0; // For tracking numbered list items

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    const renderRichText = (richTextArray: any[]) =>
      richTextArray?.map((text) => text.plain_text).join('') || '';

    // Reset numbered list counter if the next block is not a numbered_list_item
    if (block.type !== 'numbered_list_item' && numberedListCounter > 0) {
      numberedListCounter = 0;
    }

    switch (block.type) {
      case 'paragraph':
        markdown += renderRichText(block.paragraph.rich_text) + '\n\n';
        break;

      case 'heading_1':
        markdown += '# ' + renderRichText(block.heading_1.rich_text) + '\n\n';
        break;

      case 'heading_2':
        markdown += '## ' + renderRichText(block.heading_2.rich_text) + '\n\n';
        break;

      case 'heading_3':
        markdown += '### ' + renderRichText(block.heading_3.rich_text) + '\n\n';
        break;

      case 'quote':
        markdown += '> ' + renderRichText(block.quote.rich_text) + '\n\n';
        break;

      case 'divider':
        markdown += '---\n\n';
        break;

      case 'bulleted_list_item':
        markdown += `${'  '.repeat(indentLevel)}- ` + renderRichText(block.bulleted_list_item.rich_text) + '\n';
        // Handle nested children
        if (block.has_children && block.children) {
          markdown += blocksToMarkdown(block.children, indentLevel + 1);
        }
        break;

      case 'numbered_list_item':
        numberedListCounter++;
        markdown += `${'  '.repeat(indentLevel)}${numberedListCounter}. ` + renderRichText(block.numbered_list_item.rich_text) + '\n';
        // Handle nested children
        if (block.has_children && block.children) {
          markdown += blocksToMarkdown(block.children, indentLevel + 1);
        }
        break;

      case 'to_do':
        const checkbox = block.to_do.checked ? '[x]' : '[ ]';
        markdown += `${'  '.repeat(indentLevel)}- ${checkbox} ` + renderRichText(block.to_do.rich_text) + '\n';
        // Handle nested children
        if (block.has_children && block.children) {
          markdown += blocksToMarkdown(block.children, indentLevel + 1);
        }
        break;

      case 'code':
        const language = block.code.language || '';
        markdown += '```' + language + '\n' + renderRichText(block.code.rich_text) + '\n```\n\n';
        break;

      case 'callout':
        markdown += '> ' + renderRichText(block.callout.rich_text) + '\n\n';
        // Handle nested children
        if (block.has_children && block.children) {
          markdown += blocksToMarkdown(block.children, indentLevel + 1);
        }
        break;

      case 'toggle':
        markdown += '- ' + renderRichText(block.toggle.rich_text) + '\n';
        // Handle nested children
        if (block.has_children && block.children) {
          markdown += blocksToMarkdown(block.children, indentLevel + 1);
        }
        break;

      case 'image':
        const imageUrl = block.image?.external?.url || block.image?.file?.url || '';
        const caption = renderRichText(block.image.caption);
        markdown += `![${caption}](${imageUrl})\n\n`;
        break;

      case 'embed':
      case 'video':
      case 'file':
      case 'pdf':
        const url = block[block.type]?.external?.url || block[block.type]?.file?.url || '';
        markdown += `[${block.type}: ${url}](${url})\n\n`;
        break;

      case 'bookmark':
        const bookmarkUrl = block.bookmark.url || '';
        const bookmarkCaption = renderRichText(block.bookmark.caption);
        markdown += `[${bookmarkCaption || 'Bookmark'}](${bookmarkUrl})\n\n`;
        break;

      case 'table':
        // Handle table rows
        if (!block.has_children || !block.children || block.children.length === 0) {
          markdown += '<!-- Empty table -->\n\n';
          break;
        }

        const rows = block.children;
        // First row is the header
        const headerRow = rows[0];
        const headerCells = headerRow.table_row.cells.map((cell: any) => renderRichText(cell)).join(' | ');
        const headerMarkdown = `| ${headerCells} |`;

        // Header separator
        const headerSeparator = '| ' + headerRow.table_row.cells.map(() => '---').join(' | ') + ' |';

        // Data rows
        const dataRows = rows.slice(1).map((row: any) => {
          const cells = row.table_row.cells.map((cell: any) => renderRichText(cell)).join(' | ');
          return `| ${cells} |`;
        });

        markdown += [headerMarkdown, headerSeparator, ...dataRows].join('\n') + '\n\n';
        break;

      default:
        // For unsupported block types, add a comment
        markdown += `<!-- Unsupported block type: ${block.type} -->\n\n`;
    }
  }

  return markdown;
}

const notionCollection = defineCollection({
  loader: async () => {
    try {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_RESOURCES_DATABASE_ID || '',
        filter: {
          property: 'Published',
          checkbox: { equals: true },
        },
      });

      const entries = await Promise.all(
        response.results.map(async (page: any) => {
          // Fetch blocks with nested children
          const blocks = await fetchNestedBlocks(page.id);
          const markdownContent = blocksToMarkdown(blocks);
          return {
            id: page.id,
            slug: page.properties.slug?.rich_text[0]?.plain_text || page.id.replace(/-/g, ''),
            data: {
              Name: page.properties.Name?.title[0]?.plain_text || 'Untitled',
              Slug: page.properties.slug?.rich_text[0]?.plain_text,
              Summary: page.properties.Summary?.rich_text[0]?.plain_text || '',
              PubDate: page.properties.PubDate?.date?.start
                ? new Date(page.properties.PubDate.date.start)
                : undefined,
              Content_Type:
                page.properties['Content Type']?.select?.name ||
                page.properties.Content_Type?.select?.name,
              Content: markdownContent,
            },
          };
        })
      );

      return entries;
    } catch (error) {
      return [];
    }
  },
});

// const database = defineCollection({
//   loader: notionLoader({
//     auth: import.meta.env.NOTION_API_KEY,
//     database_id: import.meta.env.NOTION_DATABASE_ID,
//   }),
// });

export const collections = {  
  'posts': postsCollection, // Archivos MDX
  'resources': resourcesCollection, // Archivos MDX
  'notion': notionCollection,
  'properties': propertiesCollection,
  'authors': authorsCollection,
  'visas': visasCollection,
  // 'database': database,
}; 








// const pageCollection = defineCollection({
//     loader: async () => {
//         try {
//           const page = await getNotionPage();
//           if (!page) {
//             throw new Error('No data from Notion');
//           }
//           const { id, ...pageData } = page;
//           return [{
//             id: id || 'notion-page',
//             ...pageData
//           }];
//         } catch (error: unknown) {
//           if (error instanceof Error) {
//             // Handle error silently
//           }
//           throw error;
//         }
//       },
//     schema: z.object({
//       title: z.string(),
//       content: z.string(),
//       pubDate: z.string(),
//     }),
// });