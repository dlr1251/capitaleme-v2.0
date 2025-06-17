import { defineCollection, z } from 'astro:content';
import { getNotionPage } from '../lib/notion';
import { Client } from '@notionhq/client';
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
    tags: z.array(z.string()).optional(),
    docType: z.array(z.string()).optional(),
    legalArea: z.array(z.string()).optional()
  })
});

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
    const nextBlock = blocks[i + 1] || null;

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
      // First, get the database to see its properties
      const database = await notion.databases.retrieve({
        database_id: process.env.NOTION_RESOURCES_DATABASE_ID || '',
      });
      console.log('Available properties:', Object.keys(database.properties));

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

      console.log('Final entries with Markdown:', entries);
      return entries;
    } catch (error) {
      console.error('Notion loader error:', error);
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
  // 'database': database,
}; 








// const pageCollection = defineCollection({
//     loader: async () => {
//         console.log('Running page loader...');
//         try {
//           const page = await getNotionPage();
//           console.log('Page Loader result:', page);
//           if (!page) {
//             console.error('No page data returned from getNotionPage');
//             throw new Error('No data from Notion');
//           }
//           const { id, ...pageData } = page;
//           return [{
//             id: id || 'notion-page',
//             ...pageData
//           }];
//         } catch (error: unknown) {
//           if (error instanceof Error) {
//             console.error('Loader error:', error.message);
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