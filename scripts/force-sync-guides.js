import { createClient } from '@supabase/supabase-js';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const notion = new Client({ auth: process.env.NOTION_API_KEY });

const databaseId = process.env.NOTION_GUIDES_DATABASE_ID;

async function forceSyncGuides() {
  try {
    console.log('🔄 Force syncing guides from Notion to Supabase...');
    
    // Fetch all guides from Notion
    const response = await notion.databases.query({
      database_id: databaseId
    });

    console.log(`Found ${response.results.length} guides in Notion`);

    let syncedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const guide of response.results) {
      try {
        console.log(`\n--- Processing guide ${syncedCount + updatedCount + errorCount + 1}/${response.results.length} ---`);
        
        // Extract guide data
        const guideData = await extractGuideData(guide);
        
        if (!guideData) {
          console.log('Skipping guide - no valid data extracted');
          continue;
        }

        console.log(`Extracted data for: ${guideData.title}`);

        // Check if guide exists
        const { data: existing } = await supabase
          .from('guides')
          .select('id, notion_id')
          .eq('notion_id', guide.id)
          .single();

        if (existing) {
          console.log('Updating existing guide...');
          const { error } = await supabase
            .from('guides')
            .update(guideData)
            .eq('notion_id', guide.id);
            
          if (error) {
            console.error('Supabase update error:', error);
            errorCount++;
          } else {
            updatedCount++;
            console.log('✅ Guide updated successfully');
          }
        } else {
          console.log('Inserting new guide...');
          const { error } = await supabase
            .from('guides')
            .insert({ ...guideData, notion_id: guide.id });
            
          if (error) {
            console.error('Supabase insert error:', error);
            errorCount++;
          } else {
            syncedCount++;
            console.log('✅ Guide inserted successfully');
          }
        }
      } catch (error) {
        console.error('Error processing guide:', error);
        errorCount++;
      }
    }

    console.log('\n=== Force Sync Completed ===');
    console.log(`Synced: ${syncedCount}, Updated: ${updatedCount}, Errors: ${errorCount}`);
    
    return { syncedCount, updatedCount, errorCount };
  } catch (error) {
    console.error('❌ Force sync failed:', error);
    throw error;
  }
}

async function extractGuideData(guide) {
  try {
    // Extract basic properties
    const title = guide.properties.Name?.title?.[0]?.plain_text || 'Untitled';
    const lang = guide.properties.Lang?.select?.name || 'en';
    const category = guide.properties.Category?.multi_select?.[0]?.name || '';
    const published = guide.properties.Published?.checkbox || false;
    const slug = guide.properties.slug?.rich_text?.[0]?.plain_text || '';
    
    console.log(`Title: ${title}, Lang: ${lang}, Category: ${category}, Published: ${published}, Slug: ${slug}`);

    // Fetch page content
    console.log('Fetching page content...');
    const content = await fetchPageContent(guide.id);
    
    if (!content) {
      console.log('No content found for guide');
      return null;
    }

    // Use slug from Notion or generate from title
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return {
      title,
      slug: finalSlug,
      content,
      lang,
      category,
      last_edited: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting guide data:', error);
    return null;
  }
}

async function fetchPageContent(pageId) {
  try {
    console.log(`=== Starting content fetch for page ${pageId} ===`);
    
    // Verify the page exists
    const page = await notion.pages.retrieve({ page_id: pageId });
    console.log(`Page verified: ${page.properties.Title?.title?.[0]?.plain_text || 'Untitled'}`);
    
    // Fetch blocks recursively
    const blocks = await fetchBlocksRecursively(pageId);
    
    if (blocks.length === 0) {
      console.log('No blocks found for page');
      return '';
    }

    console.log(`=== Serializing ${blocks.length} blocks to Markdown ===`);
    const markdown = await notionBlocksToMarkdown(blocks);
    
    console.log(`=== Content fetch completed ===`);
    console.log(`Final content length: ${markdown.length} characters`);
    console.log(`Content preview: ${markdown.substring(0, 200)}...`);
    
    return markdown;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return '';
  }
}

async function fetchBlocksRecursively(pageId, depth = 0) {
  const allBlocks = [];
  
  try {
    console.log(`Fetching blocks for ${pageId} at depth ${depth}`);
    
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100
    });
    
    console.log(`Fetched ${response.results.length} blocks`);
    
    for (const block of response.results) {
      allBlocks.push(block);
      
      if (block.has_children) {
        console.log(`Fetching children for ${block.type} block`);
        const childBlocks = await fetchBlocksRecursively(block.id, depth + 1);
        allBlocks.push(...childBlocks);
      }
    }
    
    return allBlocks;
  } catch (error) {
    console.error(`Error fetching blocks for ${pageId}:`, error);
    return allBlocks;
  }
}

async function notionBlocksToMarkdown(blocks) {
  let markdown = '';
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    console.log(`Processing block ${i + 1}/${blocks.length}: ${block.type}`);
    
    try {
      const blockMarkdown = await processBlock(block);
      if (blockMarkdown) {
        markdown += blockMarkdown + '\n\n';
      }
    } catch (error) {
      console.error(`Error processing block ${block.type}:`, error);
    }
  }
  
  return markdown.trim();
}

async function processBlock(block) {
  switch (block.type) {
    case 'paragraph':
      return block.paragraph.rich_text.map(text => text.plain_text).join('');
      
    case 'heading_1':
      return `# ${block.heading_1.rich_text.map(text => text.plain_text).join('')}`;
      
    case 'heading_2':
      return `## ${block.heading_2.rich_text.map(text => text.plain_text).join('')}`;
      
    case 'heading_3':
      return `### ${block.heading_3.rich_text.map(text => text.plain_text).join('')}`;
      
    case 'bulleted_list_item':
      return `- ${block.bulleted_list_item.rich_text.map(text => text.plain_text).join('')}`;
      
    case 'numbered_list_item':
      return `1. ${block.numbered_list_item.rich_text.map(text => text.plain_text).join('')}`;
      
    case 'quote':
      return `> ${block.quote.rich_text.map(text => text.plain_text).join('')}`;
      
    case 'code':
      return `\`\`\`${block.code.language || ''}\n${block.code.rich_text.map(text => text.plain_text).join('')}\n\`\`\``;
      
    case 'divider':
      return '---';
      
    case 'image':
      if (!block.image) return '';
      
      const image = block.image;
      let imageUrl = '';
      
      if (image.type === 'external') {
        imageUrl = image.external.url;
      } else if (image.type === 'file') {
        imageUrl = image.file.url;
      }
      
      if (!imageUrl) return '';
      
      // For now, return the original URL but log it for processing
      console.log(`📸 Image found in Notion: ${imageUrl}`);
      return `![image](${imageUrl})`;
      
    case 'table':
      // Handle table blocks
      return '';
      
    case 'table_row':
      // Handle table row blocks
      return '';
      
    case 'column_list':
      // Handle column list blocks
      return '';
      
    case 'column':
      // Handle column blocks
      return '';
      
    case 'toggle':
      const toggleText = block.toggle.rich_text.map(text => text.plain_text).join('');
      return `<details><summary>${toggleText}</summary>\n\n\n</details>`;
      
    default:
      console.log(`Unhandled block type: ${block.type}`);
      return '';
  }
}

// Run the force sync
forceSyncGuides()
  .then(result => {
    console.log('✅ Force sync completed successfully!');
    console.log('Summary:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Force sync failed:', error);
    process.exit(1);
  });
