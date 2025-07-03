// Notion API Data Transformation Utilities
import type { 
  NotionPage, 
  NotionBlock, 
  NotionProperty, 
  NotionRichText,
  NotionTitleProperty,
  NotionRichTextProperty,
  NotionSelectProperty,
  NotionCheckboxProperty,
  NotionDateProperty,
  NotionFilesProperty
} from './notionTypes';

// --- Property Extraction Helpers ---

export function extractTitle(property: NotionProperty): string {
  if (property.type === 'title' && Array.isArray(property.title)) {
    return property.title.map(text => text.plain_text).join('');
  }
  return '';
}

export function extractRichText(property: NotionProperty): string {
  if (property.type === 'rich_text' && Array.isArray(property.rich_text)) {
    return property.rich_text.map(text => text.plain_text).join('');
  }
  return '';
}

export function extractSelect(property: NotionProperty): string | null {
  if (property.type === 'select' && property.select) {
    return property.select.name;
  }
  return null;
}

export function extractCheckbox(property: NotionProperty): boolean {
  if (property.type === 'checkbox') {
    return property.checkbox;
  }
  return false;
}

export function extractDate(property: NotionProperty): string | null {
  if (property.type === 'date' && property.date) {
    return property.date.start;
  }
  return null;
}

export function extractFiles(property: NotionProperty): string[] {
  if (property.type === 'files' && Array.isArray(property.files)) {
    return property.files.map(file => {
      if (file.type === 'external' && file.external) {
        return file.external.url;
      }
      if (file.type === 'file' && file.file) {
        return file.file.url;
      }
      return '';
    }).filter(url => url !== '');
  }
  return [];
}

// --- Block Transformation ---

export function transformBlock(rawBlock: any): NotionBlock {
  const baseBlock: NotionBlock = {
    id: rawBlock.id,
    type: rawBlock.type,
    has_children: rawBlock.has_children || false,
    ...rawBlock
  };

  // Transform based on block type
  switch (rawBlock.type) {
    case 'paragraph':
      return {
        ...baseBlock,
        type: 'paragraph',
        paragraph: {
          rich_text: rawBlock.paragraph?.rich_text || [],
          color: rawBlock.paragraph?.color
        }
      } as NotionBlock;

    case 'heading_1':
      return {
        ...baseBlock,
        type: 'heading_1',
        heading_1: {
          rich_text: rawBlock.heading_1?.rich_text || [],
          color: rawBlock.heading_1?.color
        }
      } as NotionBlock;

    case 'heading_2':
      return {
        ...baseBlock,
        type: 'heading_2',
        heading_2: {
          rich_text: rawBlock.heading_2?.rich_text || [],
          color: rawBlock.heading_2?.color
        }
      } as NotionBlock;

    case 'heading_3':
      return {
        ...baseBlock,
        type: 'heading_3',
        heading_3: {
          rich_text: rawBlock.heading_3?.rich_text || [],
          color: rawBlock.heading_3?.color
        }
      } as NotionBlock;

    case 'bulleted_list_item':
      return {
        ...baseBlock,
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: rawBlock.bulleted_list_item?.rich_text || []
        }
      } as NotionBlock;

    case 'numbered_list_item':
      return {
        ...baseBlock,
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: rawBlock.numbered_list_item?.rich_text || []
        }
      } as NotionBlock;

    case 'to_do':
      return {
        ...baseBlock,
        type: 'to_do',
        to_do: {
          rich_text: rawBlock.to_do?.rich_text || [],
          checked: rawBlock.to_do?.checked || false
        }
      } as NotionBlock;

    case 'toggle':
      return {
        ...baseBlock,
        type: 'toggle',
        toggle: {
          rich_text: rawBlock.toggle?.rich_text || []
        }
      } as NotionBlock;

    case 'quote':
      return {
        ...baseBlock,
        type: 'quote',
        quote: {
          rich_text: rawBlock.quote?.rich_text || []
        }
      } as NotionBlock;

    case 'callout':
      return {
        ...baseBlock,
        type: 'callout',
        callout: {
          rich_text: rawBlock.callout?.rich_text || [],
          icon: rawBlock.callout?.icon
        }
      } as NotionBlock;

    case 'code':
      return {
        ...baseBlock,
        type: 'code',
        code: {
          rich_text: rawBlock.code?.rich_text || [],
          language: rawBlock.code?.language || 'plaintext'
        }
      } as NotionBlock;

    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        image: {
          type: rawBlock.image?.type || 'external',
          external: rawBlock.image?.external,
          file: rawBlock.image?.file,
          caption: rawBlock.image?.caption || []
        }
      } as NotionBlock;

    case 'video':
      return {
        ...baseBlock,
        type: 'video',
        video: {
          type: rawBlock.video?.type || 'external',
          external: rawBlock.video?.external,
          file: rawBlock.video?.file,
          caption: rawBlock.video?.caption || []
        }
      } as NotionBlock;

    default:
      return baseBlock;
  }
}

// --- Page Transformation ---

export function transformPage(rawPage: any): NotionPage {
  return {
    id: rawPage.id,
    url: rawPage.url,
    properties: rawPage.properties || {},
    last_edited_time: rawPage.last_edited_time,
    created_time: rawPage.created_time,
    object: 'page',
    icon: rawPage.icon
  };
}

// --- Recursive Children Fetching ---

export async function fetchBlockChildren(blockId: string): Promise<NotionBlock[]> {
  try {
    const response = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${import.meta.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      
      return [];
    }

    const data = await response.json();
    const blocks = data.results || [];

    // Recursively fetch children for blocks that have them
    const blocksWithChildren = await Promise.all(
      blocks.map(async (block: any) => {
        const transformedBlock = transformBlock(block);
        if (transformedBlock.has_children) {
          const children = await fetchBlockChildren(block.id);
          return { ...transformedBlock, children };
        }
        return transformedBlock;
      })
    );

    return blocksWithChildren;
  } catch (error) {
    
    return [];
  }
}

// --- Complete Page with Blocks ---

export async function fetchPageWithBlocks(pageId: string): Promise<{
  page: NotionPage;
  blocks: NotionBlock[];
} | null> {
  try {
    // Fetch page
    const pageResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${import.meta.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!pageResponse.ok) {
      
      return null;
    }

    const pageData = await pageResponse.json();
    const page = transformPage(pageData);

    // Fetch blocks
    const blocks = await fetchBlockChildren(pageId);

    return { page, blocks };
  } catch (error) {
    
    return null;
  }
}

// --- Database Query with Transformation ---

export async function fetchDatabaseWithTransformation(databaseId: string): Promise<NotionPage[]> {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [
          {
            timestamp: 'last_edited_time',
            direction: 'descending',
          },
        ],
      }),
    });

    if (!response.ok) {
      
      return [];
    }

    const data = await response.json();
    const pages = data.results || [];

    return pages.map(transformPage);
  } catch (error) {
    
    return [];
  }
}

// --- Utility: Extract Text from Blocks ---

export function extractTextFromBlocks(blocks: NotionBlock[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return block.paragraph?.rich_text?.map((text: NotionRichText) => text.plain_text).join('') || '';
      case 'heading_1':
        return block.heading_1?.rich_text?.map((text: NotionRichText) => text.plain_text).join('') || '';
      case 'heading_2':
        return block.heading_2?.rich_text?.map((text: NotionRichText) => text.plain_text).join('') || '';
      case 'heading_3':
        return block.heading_3?.rich_text?.map((text: NotionRichText) => text.plain_text).join('') || '';
      case 'bulleted_list_item':
        return block.bulleted_list_item?.rich_text?.map((text: NotionRichText) => text.plain_text).join('') || '';
      case 'numbered_list_item':
        return block.numbered_list_item?.rich_text?.map((text: NotionRichText) => text.plain_text).join('') || '';
      case 'to_do':
        return block.to_do?.rich_text?.map((text: NotionRichText) => text.plain_text).join('') || '';
      case 'toggle':
        return block.toggle?.rich_text?.map((text: NotionRichText) => text.plain_text).join('') || '';
      case 'quote':
        return block.quote?.rich_text?.map((text: NotionRichText) => text.plain_text).join('') || '';
      case 'callout':
        return block.callout?.rich_text?.map((text: NotionRichText) => text.plain_text).join('') || '';
      case 'code':
        return block.code?.rich_text?.map((text: NotionRichText) => text.plain_text).join('') || '';
      default:
        return '';
    }
  }).join(' ').trim();
}

// --- Utility: Extract Headings from Blocks ---

export function extractHeadingsFromBlocks(blocks: NotionBlock[]): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = [];

  blocks.forEach(block => {
    let text = '';
    let level = 0;

    switch (block.type) {
      case 'heading_1':
        text = block.heading_1?.rich_text?.map((t: NotionRichText) => t.plain_text).join('') || '';
        level = 1;
        break;
      case 'heading_2':
        text = block.heading_2?.rich_text?.map((t: NotionRichText) => t.plain_text).join('') || '';
        level = 2;
        break;
      case 'heading_3':
        text = block.heading_3?.rich_text?.map((t: NotionRichText) => t.plain_text).join('') || '';
        level = 3;
        break;
    }

    if (text && level > 0) {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ level, text, id });
    }
  });

  return headings;
} 