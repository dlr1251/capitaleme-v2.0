import { createClient } from '@supabase/supabase-js';
import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images/notion');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download image from Notion URL and store locally
async function downloadAndStoreImage(notionUrl, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(imagesDir, filename));
    
    https.get(notionUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const localUrl = `/images/notion/${filename}`;
          console.log(`✅ Downloaded and stored: ${filename}`);
          resolve(localUrl);
        });
      } else {
        console.error(`❌ Failed to download ${notionUrl}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`❌ Error downloading ${notionUrl}:`, err.message);
      reject(err);
    });
  });
}

// Enhanced image processing for Notion blocks
async function processNotionImageBlock(block) {
  if (!block.image) return '';
  
  const image = block.image;
  let imageUrl = '';
  
  if (image.type === 'external') {
    imageUrl = image.external.url;
  } else if (image.type === 'file') {
    imageUrl = image.file.url;
  }
  
  if (!imageUrl) return '';
  
  // Skip if already a local image
  if (imageUrl.startsWith('/images/') || imageUrl.startsWith('./images/')) {
    return `![image](${imageUrl})`;
  }
  
  // Skip if it's not a Notion URL
  if (!imageUrl.includes('amazonaws.com') && !imageUrl.includes('notion.so')) {
    return `![image](${imageUrl})`;
  }
  
  try {
    // Generate filename from URL
    const urlObj = new URL(imageUrl);
    const pathname = urlObj.pathname;
    const extension = path.extname(pathname) || '.png';
    const filename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${extension}`;
    
    // Download and store the image
    const localUrl = await downloadAndStoreImage(imageUrl, filename);
    
    return `![image](${localUrl})`;
    
  } catch (error) {
    console.error(`❌ Failed to process image ${imageUrl}:`, error.message);
    // Return original URL if download fails
    return `![image](${imageUrl})`;
  }
}

// Enhanced markdown serializer with image processing
async function enhancedNotionBlocksToMarkdown(blocks) {
  const markdownBlocks = await Promise.all(blocks.map(async (block, index) => {
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
        return await processNotionImageBlock(block);
        
      case 'callout':
        return '> [!NOTE] ' + (block.callout?.rich_text || []).map(t => t.plain_text).join('');
        
      case 'toggle':
        const toggleText = (block.toggle?.rich_text || []).map(t => t.plain_text).join('');
        const toggleContent = block.children ? await enhancedNotionBlocksToMarkdown(block.children) : '';
        return `<details><summary>${toggleText}</summary>\n\n${toggleContent}\n\n</details>`;
        
      case 'divider':
        return '---';
        
      case 'column_list':
        return block.children ? await enhancedNotionBlocksToMarkdown(block.children) : '';
        
      case 'column':
        return block.children ? await enhancedNotionBlocksToMarkdown(block.children) : '';
        
      case 'table':
        if (!block.children) return '';
        const rows = await Promise.all(block.children
          .filter(child => child.type === 'table_row')
          .map(child => enhancedNotionBlocksToMarkdown([child])));
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
        return block.children ? await enhancedNotionBlocksToMarkdown(block.children) : '';
        
      default:
        console.log(`Unhandled block type: ${block.type}`);
        return '';
    }
  }));
  
  return markdownBlocks.join('\n\n');
}

// Function to process existing content in Supabase
async function processExistingSupabaseContent() {
  console.log('🚀 Processing existing content in Supabase...');
  
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔍 Supabase configuration:');
    console.log(`   - SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}`);
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables. Please check your .env file.');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Process guides
    console.log('📚 Processing guides...');
    const { data: guides, error: guidesError } = await supabase
      .from('guides')
      .select('id, content, lang');
    
    if (guidesError) throw guidesError;
    
    for (const guide of guides) {
      if (guide.content && guide.content.includes('amazonaws.com')) {
        console.log(`Processing guide: ${guide.id} (${guide.lang})`);
        
        // Process images in content
        const processedContent = await processContentImages(guide.content);
        
        if (processedContent !== guide.content) {
          const { error: updateError } = await supabase
            .from('guides')
            .update({ content: processedContent })
            .eq('id', guide.id);
          
          if (updateError) {
            console.error(`❌ Failed to update guide ${guide.id}:`, updateError);
          } else {
            console.log(`✅ Updated guide: ${guide.id}`);
          }
        }
      }
    }
    
    // Process blog posts
    console.log('📝 Processing blog posts...');
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('id, content, lang');
    
    if (blogError) throw blogError;
    
    for (const post of blogPosts) {
      if (post.content && post.content.includes('amazonaws.com')) {
        console.log(`Processing blog post: ${post.id} (${post.lang})`);
        
        // Process images in content
        const processedContent = await processContentImages(post.content);
        
        if (processedContent !== post.content) {
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ content: processedContent })
            .eq('id', post.id);
          
          if (updateError) {
            console.error(`❌ Failed to update blog post ${post.id}:`, updateError);
          } else {
            console.log(`✅ Updated blog post: ${post.id}`);
          }
        }
      }
    }
    
    console.log('🎉 Content processing completed!');
    
  } catch (error) {
    console.error('❌ Error processing content:', error);
  }
}

// Function to process content and replace image URLs
async function processContentImages(content) {
  if (!content) return content;
  
  // Find all image URLs in markdown format ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const matches = [...content.matchAll(imageRegex)];
  
  let processedContent = content;
  
  for (const match of matches) {
    const [fullMatch, alt, url] = match;
    
    // Skip if already a local image
    if (url.startsWith('/images/') || url.startsWith('./images/')) {
      continue;
    }
    
    // Skip if it's not a Notion/S3 URL
    if (!url.includes('amazonaws.com') && !url.includes('notion.so')) {
      continue;
    }
    
    try {
      // Generate filename from URL
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const extension = path.extname(pathname) || '.png';
      const filename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${extension}`;
      
      // Download and store the image
      const localUrl = await downloadAndStoreImage(url, filename);
      
      // Replace the URL in content
      processedContent = processedContent.replace(fullMatch, `![${alt}](${localUrl})`);
      
      console.log(`🔄 Replaced: ${url} → ${localUrl}`);
      
    } catch (error) {
      console.error(`❌ Failed to process image ${url}:`, error.message);
      // Keep original URL if download fails
    }
  }
  
  return processedContent;
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  processExistingSupabaseContent();
}

export { enhancedNotionBlocksToMarkdown, processNotionImageBlock, processExistingSupabaseContent };
