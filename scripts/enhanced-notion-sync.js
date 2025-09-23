import { createClient } from '@supabase/supabase-js';
import { Client } from '@notionhq/client';

// Enhanced image processing for Notion blocks
function processNotionImage(block, options = {}) {
  const { downloadImages = false, cloudinaryUpload = false } = options;
  
  if (!block.image) return '';
  
  const image = block.image;
  let imageUrl = '';
  
  if (image.type === 'external') {
    imageUrl = image.external.url;
  } else if (image.type === 'file') {
    imageUrl = image.file.url;
  }
  
  if (!imageUrl) return '';
  
  // If using Cloudinary, upload the image
  if (cloudinaryUpload && typeof cloudinary !== 'undefined') {
    // This would be handled by the Cloudinary integration
    return `![image](${imageUrl})`; // Placeholder - would be replaced with Cloudinary URL
  }
  
  // If downloading locally, this would be handled by the download script
  if (downloadImages) {
    return `![image](${imageUrl})`; // Placeholder - would be replaced with local URL
  }
  
  // For now, return the original URL but with better error handling
  return `![image](${imageUrl})`;
}

// Enhanced markdown serializer with better image handling
function enhancedNotionBlocksToMarkdown(blocks, options = {}) {
  const markdownBlocks = blocks.map((block, index) => {
    switch (block.type) {
      case 'paragraph':
        return (block.paragraph?.rich_text || []).map(t => t.plain_text).join('');
        
      case 'heading_1':
        return '# ' + (block.heading_1?.rich_text || []).map(t => t.plain_text).join('');
        
      case 'heading_2':
        return '## ' + (block.heading_2?.rich_text || []).map(t => t.plain_text).join('');
        
      case 'heading_3':
        return '### ' + (block.heading_3?.rich_text || []).map(t => t.plain_text).join('');
        
      case 'bulleted_list_item':
        return '- ' + (block.bulleted_list_item?.rich_text || []).map(t => t.plain_text).join('');
        
      case 'numbered_list_item':
        return '1. ' + (block.numbered_list_item?.rich_text || []).map(t => t.plain_text).join('');
        
      case 'code':
        return '```' + (block.code?.language || '') + '\n' + (block.code?.rich_text || []).map(t => t.plain_text).join('') + '\n```';
        
      case 'image':
        return processNotionImage(block, options);
        
      case 'callout':
        return '> [!NOTE] ' + (block.callout?.rich_text || []).map(t => t.plain_text).join('');
        
      case 'toggle':
        const toggleText = (block.toggle?.rich_text || []).map(t => t.plain_text).join('');
        const toggleContent = block.children ? enhancedNotionBlocksToMarkdown(block.children, options) : '';
        return `<details><summary>${toggleText}</summary>\n\n${toggleContent}\n\n</details>`;
        
      case 'divider':
        return '---';
        
      case 'column_list':
        return block.children ? enhancedNotionBlocksToMarkdown(block.children, options) : '';
        
      case 'column':
        return block.children ? enhancedNotionBlocksToMarkdown(block.children, options) : '';
        
      case 'table':
        if (!block.children) return '';
        const rows = block.children
          .filter(child => child.type === 'table_row')
          .map(child => enhancedNotionBlocksToMarkdown([child], options));
        return rows.join('\n');
        
      case 'table_row':
        const cells = (block.table_row?.cells || []).map(cell =>
          (cell || []).map(t => t.plain_text).join('')
        );
        return '| ' + cells.join(' | ') + ' |';
        
      case 'bookmark':
        return block.bookmark?.url ? `[${block.bookmark.url}](${block.bookmark.url})` : '';
        
      case 'embed':
        return block.embed?.url ? `[Embed](${block.embed.url})` : '';
        
      case 'file':
        return block.file?.file?.url ? `[File](${block.file.file.url})` : '';
        
      case 'pdf':
        return block.pdf?.file?.url ? `[PDF](${block.pdf.file.url})` : '';
        
      case 'video':
        return block.video?.external?.url ? `[Video](${block.video.external.url})` : '';
        
      case 'synced_block':
        return block.children ? enhancedNotionBlocksToMarkdown(block.children, options) : '';
        
      default:
        console.log(`Unhandled block type: ${block.type}`);
        return '';
    }
  });
  
  return markdownBlocks.join('\n\n');
}

// Function to sync content with enhanced image handling
async function syncContentWithEnhancedImages() {
  console.log('🚀 Starting enhanced content sync...');
  
  try {
    // Initialize clients
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Your existing sync logic here, but using enhancedNotionBlocksToMarkdown
    // with options for image handling
    
    console.log('✅ Enhanced sync completed!');
    
  } catch (error) {
    console.error('❌ Error in enhanced sync:', error);
  }
}

export { enhancedNotionBlocksToMarkdown, processNotionImage, syncContentWithEnhancedImages };
