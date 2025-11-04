// Dynamic import for supabase to handle ES module compatibility
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let supabase;
let supabaseInitialized = false;

async function initializeSupabase() {
  if (supabaseInitialized) {
    console.log('[DEBUG] Supabase already initialized, returning existing client');
    return supabase;
  }
  
  try {
    console.log('[DEBUG] Initializing Supabase client...');
    console.log('[DEBUG] About to import supabase module...');
    
    // Try to import the module
    let supabaseModule;
    try {
      supabaseModule = await import('./supabase.js');
      console.log('[DEBUG] Supabase module imported successfully');
    } catch (importError) {
      console.error('[ERROR] Failed to import supabase module:', importError);
      throw importError;
    }
    
    // Try to extract the supabase client
    try {
      supabase = supabaseModule.supabase;
      console.log('[DEBUG] Supabase client extracted from module');
    } catch (extractError) {
      console.error('[ERROR] Failed to extract supabase client:', extractError);
      throw extractError;
    }
    
    // Verify the client is valid
    if (!supabase || typeof supabase.from !== 'function') {
      console.error('[ERROR] Invalid supabase client:', supabase);
      throw new Error('Invalid supabase client');
    }
    
    supabaseInitialized = true;
    console.log('[DEBUG] Supabase client initialized successfully');
    return supabase;
  } catch (error) {
    console.error('[ERROR] Failed to initialize Supabase client:', error);
    throw error;
  }
}

// Initialize supabase on module load
initializeSupabase().catch(console.error);

import { Client } from '@notionhq/client';
import fs from 'fs';

// Create Notion client function to ensure environment variables are loaded
function createNotionClient() {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error('NOTION_API_KEY is not set in environment variables');
  }
  return new Client({ auth: apiKey });
}

const databaseId = process.env.NOTION_VISAS_DATABASE_ID;


export async function syncVisasToSupabase() {
    if (!databaseId) {
        throw new Error('NOTION_VISAS_DATABASE_ID is not set in environment variables');
    }
    try {
        // Fetch all visas from Notion
        const visas = await fetchAllVisasFromNotion();
        let syncedCount = 0;
        let updatedCount = 0;
        let errorCount = 0;
        // Process each visa
        for (const visa of visas) {
            try {
                const visaData = await extractVisaData(visa, createNotionClient());
                
                // Check if visa already exists by slug and lang (to handle unique constraint)
                const { data: existingVisa } = await supabase
                    .from('visas')
                    .select('id, notion_id, last_edited')
                    .eq('slug', visaData.slug)
                    .eq('lang', visaData.lang)
                    .single();
                
                if (existingVisa) {
                    // Update existing visa if it has been modified or if notion_id is different
                    const shouldUpdate = new Date(visa.last_edited_time) > new Date(existingVisa.last_edited) || 
                                       existingVisa.notion_id !== visa.id;
                    
                    if (shouldUpdate) {
                        const { error } = await supabase
                            .from('visas')
                            .update({
                                notion_id: visa.id,
                                title: visaData.title,
                                slug: visaData.slug,
                                description: visaData.description,
                                content: visaData.content,
                                category: visaData.category,
                                country: visaData.country,
                                countries: visaData.countries,
                                is_popular: visaData.isPopular,
                                beneficiaries: visaData.beneficiaries,
                                work_permit: visaData.workPermit,
                                processing_time: visaData.processingTime,
                                requirements: visaData.requirements,
                                emoji: visaData.emoji,
                                alcance: visaData.alcance,
                                duration: visaData.duration,
                                lang: visaData.lang,
                                last_edited: visa.last_edited_time,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', existingVisa.id);
                        if (error) {
                            logToFile(`❌ Error updating visa ${visaData.slug}:`, error);
                            errorCount++;
                        }
                        else {
                            updatedCount++;
                        }
                    }
                }
                else {
                    // Insert new visa
                    const { error } = await supabase
                        .from('visas')
                        .insert({
                            notion_id: visa.id,
                            title: visaData.title,
                            slug: visaData.slug,
                            description: visaData.description,
                            content: visaData.content,
                            category: visaData.category,
                            country: visaData.country,
                            countries: visaData.countries,
                            is_popular: visaData.isPopular,
                            beneficiaries: visaData.beneficiaries,
                            work_permit: visaData.workPermit,
                            processing_time: visaData.processingTime,
                            requirements: visaData.requirements,
                            emoji: visaData.emoji,
                            alcance: visaData.alcance,
                            duration: visaData.duration,
                            lang: visaData.lang,
                            last_edited: visa.last_edited_time
                        });
                    if (error) {
                        logToFile(`❌ Error inserting visa ${visaData.slug}:`, error);
                        errorCount++;
                    }
                    else {
                        syncedCount++;
                    }
                }
            }
            catch (error) {
                logToFile(`❌ Error processing visa:`, error);
                errorCount++;
            }
        }
        return {
            syncedCount,
            updatedCount,
            errorCount
        };
    }
    catch (error) {
        logToFile('❌ Sync failed:', error);
        throw error;
    }
}
async function fetchAllVisasFromNotion() {
    let results = [];
    let hasMore = true;
    let startCursor = undefined;
    while (hasMore) {
        const response = await createNotionClient().databases.query({
            database_id: databaseId,
            start_cursor: startCursor,
            page_size: 1000,
        });
        results = results.concat(response.results);
        hasMore = response.has_more;
        startCursor = response.next_cursor || undefined;
    }
    return results;
}
async function extractVisaData(visa, notion) {
    const properties = visa.properties;
    
    // Fetch full page content from Notion blocks
    let content = '';
    try {
        content = await fetchPageContentMarkdown(notion, visa.id);
    } catch (error) {
        console.error(`Error fetching content for visa ${visa.id}:`, error);
        // Fallback to rich text property if page content fetch fails
        content = properties.Content?.rich_text?.[0]?.plain_text || '';
    }
    
    return {
        title: properties.Name?.title?.[0]?.plain_text || properties.Title?.title?.[0]?.plain_text || '',
        slug: properties.slug?.rich_text?.[0]?.plain_text || properties.Slug?.rich_text?.[0]?.plain_text || '',
        description: properties.Words?.rich_text?.[0]?.plain_text || properties.Description?.rich_text?.[0]?.plain_text || '',
        content: content,
        category: properties.Tipo?.select?.name || properties.VisaType?.select?.name || 'visa',
        country: properties.Countries?.select?.name || properties.Country?.select?.name || '',
        countries: properties.Countries?.select?.name ? [properties.Countries.select.name] :
            properties.Countries?.multi_select?.map(item => item.name) || [],
        isPopular: properties.Popular?.checkbox || false,
        beneficiaries: properties.Beneficiaries?.select?.name || '',
        workPermit: properties.WorkPermit?.select?.name || '',
        processingTime: properties.ProcessingTime?.rich_text?.[0]?.plain_text || '',
        requirements: properties.Requirements?.rich_text?.[0]?.plain_text || '',
        emoji: properties.Emoji?.rich_text?.[0]?.plain_text || '📋',
        alcance: properties.Alcance?.rich_text?.[0]?.plain_text || '',
        duration: properties.Duration?.rich_text?.[0]?.plain_text || '',
        lang: properties.Lang?.select?.name === 'En' ? 'en' : 'es'
    };
}
function logToFile(message, data) {
  fs.appendFileSync('supabase-debug.log', `${new Date().toISOString()} ${message} ${JSON.stringify(data)}\n`);
}

export async function getVisasFromSupabase(lang = 'en') {
    try {
        const supabaseClient = await initializeSupabase();
        if (!supabaseClient) {
            console.error(`[getVisasFromSupabase] Failed to initialize Supabase client for lang: ${lang}`);
            return [];
        }
        
        console.log(`[getVisasFromSupabase] Fetching visas for lang: ${lang}`);
        const { data, error } = await supabaseClient
            .from('visas')
            .select('*')
            .eq('lang', lang)
            .eq('published', true)
            .or('archived.is.null,archived.eq.false')
            .order('title');
            
        if (error) {
            console.error(`[getVisasFromSupabase] Error fetching visas for ${lang}:`, error);
            return [];
        }
        
        console.log(`[getVisasFromSupabase] Successfully fetched ${data?.length || 0} visas for ${lang}`);
        return data || [];
    }
    catch (error) {
        console.error(`[getVisasFromSupabase] Exception fetching visas for ${lang}:`, error);
        return [];
    }
}

export async function getVisaBySlugFromSupabase(slug, lang = 'en') {
    try {
        const supabaseClient = await initializeSupabase();
        if (!supabaseClient) {
            console.error(`[getVisaBySlugFromSupabase] Failed to initialize Supabase client for slug: ${slug}, lang: ${lang}`);
            return null;
        }
        
        console.log(`[getVisaBySlugFromSupabase] Fetching visa with slug: ${slug}, lang: ${lang}`);
        const { data, error } = await supabaseClient
            .from('visas')
            .select('*')
            .eq('slug', slug)
            .eq('lang', lang)
            .eq('published', true)
            .or('archived.is.null,archived.eq.false')
            .single();
            
        if (error) {
            console.error(`[getVisaBySlugFromSupabase] Error fetching visa ${slug} for ${lang}:`, error);
            return null;
        }
        
        console.log(`[getVisaBySlugFromSupabase] Successfully fetched visa: ${slug} for ${lang}`);
        return data;
    }
    catch (error) {
        console.error(`[getVisaBySlugFromSupabase] Exception fetching visa ${slug} for ${lang}:`, error);
        return null;
    }
}

export async function getCLKRArticlesFromSupabase(lang = 'en') {
    console.log(`[DEBUG] getCLKRArticlesFromSupabase called with lang: ${lang}`);
    
    try {
        // Ensure supabase is initialized
        const supabaseClient = await initializeSupabase();
        console.log(`[DEBUG] supabase client available: ${!!supabaseClient}`);
        
        console.log(`[DEBUG] Attempting to fetch CLKR articles from Supabase...`);
        
        // Add timeout to the query
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Supabase query timeout')), 10000); // 10 second timeout
        });
        
        const queryPromise = supabaseClient
            .from('clkr_articles')
            .select('*')
            .eq('lang', lang)
            .eq('published', true)
            .or('archived.is.null,archived.eq.false')
            .gt('reading_time', 2) // Only articles with reading time > 1 minute
            .order('last_edited', { ascending: false });
        
        const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
        
        console.log(`[DEBUG] Supabase response - data:`, data);
        console.log(`[DEBUG] Supabase response - error:`, error);
        
        if (error) {
            console.error(`[ERROR] Supabase error in getCLKRArticlesFromSupabase:`, error);
            return [];
        }
        
        // Additional filter to ensure reading_time > 1 (in case of null values or edge cases)
        const filteredData = (data || []).filter(article => 
            article.reading_time && article.reading_time > 1
        );
        
        // Log detailed filtering information
        if (data && data.length > 0) {
            const filteredOut = data.filter(article => !article.reading_time || article.reading_time <= 1);
            if (filteredOut.length > 0) {
                console.log(`[DEBUG] Filtered out ${filteredOut.length} articles with reading time <= 1 minute:`);
                filteredOut.forEach(article => {
                    console.log(`[DEBUG] - "${article.title}" (reading_time: ${article.reading_time || 'null'})`);
                });
            }
        }
        
        console.log(`[DEBUG] Filtered ${filteredData.length} articles with reading time > 1 minute out of ${data?.length || 0} total articles`);
        console.log(`[DEBUG] Returning ${filteredData.length} CLKR articles`);
        return filteredData;
    }
    catch (error) {
        console.error(`[ERROR] Exception in getCLKRArticlesFromSupabase:`, error);
        return [];
    }
}

// --- Notion Block to Markdown Serializer ---
function notionBlocksToMarkdown(blocks) {
  console.log('Blocks passed to notionBlocksToMarkdown:', JSON.stringify(blocks, null, 2));
  
  if (!blocks || blocks.length === 0) {
    console.log('No blocks to serialize');
    return '';
  }

  const markdownBlocks = blocks.map((block, index) => {
    console.log(`Processing block ${index + 1}/${blocks.length}:`, block.type);
    
    try {
      switch (block.type) {
        case 'paragraph':
          const paragraphText = (block.paragraph?.rich_text || []).map(t => t.plain_text).join('');
          console.log(`Paragraph text: "${paragraphText}"`);
          return paragraphText || '\n'; // Return newline for empty paragraphs
          
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
          
        case 'to_do':
          return `- [${block.to_do?.checked ? 'x' : ' '}] ` + (block.to_do?.rich_text || []).map(t => t.plain_text).join('');
          
        case 'quote':
          return '> ' + (block.quote?.rich_text || []).map(t => t.plain_text).join('');
          
        case 'code':
          return '```' + (block.code?.language || '') + '\n' + (block.code?.rich_text || []).map(t => t.plain_text).join('') + '\n```';
          
        case 'image':
          return block.image
            ? `![image](${block.image.type === 'external' ? block.image.external.url : block.image.file.url})`
            : '';
            
        case 'callout':
          return '> [!NOTE] ' + (block.callout?.rich_text || []).map(t => t.plain_text).join('');
          
        case 'toggle':
          const toggleText = (block.toggle?.rich_text || []).map(t => t.plain_text).join('');
          const toggleContent = block.children ? notionBlocksToMarkdown(block.children) : '';
          return `<details><summary>${toggleText}</summary>\n\n${toggleContent}\n\n</details>`;
          
        case 'divider':
          return '---';
          
        case 'column_list':
          return block.children ? notionBlocksToMarkdown(block.children) : '';
          
        case 'column':
          return block.children ? notionBlocksToMarkdown(block.children) : '';
          
        case 'table':
          if (!block.children) return '';
          const rows = block.children
            .filter(child => child.type === 'table_row')
            .map(child => notionBlocksToMarkdown([child]));
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
          return block.children ? notionBlocksToMarkdown(block.children) : '';
          
        case 'template':
          return block.children ? notionBlocksToMarkdown(block.children) : '';
          
        case 'link_preview':
          return block.link_preview?.url ? `[Link](${block.link_preview.url})` : '';
          
        case 'unsupported':
          console.log('Unsupported block type encountered:', block);
          return `[Unsupported content: ${block.type}]`;
          
        default:
          console.log(`Unknown block type: ${block.type}`, block);
          return `[Unknown block type: ${block.type}]`;
      }
    } catch (error) {
      console.error(`Error processing block ${index + 1}:`, error);
      return `[Error processing block: ${block.type}]`;
    }
  });

  const result = markdownBlocks.filter(block => block && block.trim()).join('\n\n');
  console.log('Final markdown length:', result.length);
  console.log('Final markdown preview:', result.substring(0, 200) + (result.length > 200 ? '...' : ''));
  
  return result;
}

// --- Recursive Notion block fetcher ---
async function fetchBlocksRecursively(notion, blockId, depth = 0) {
  console.log(`Fetching blocks for ${blockId} at depth ${depth}`);
  
  let blocks = [];
  let cursor;
  let attemptCount = 0;
  const maxAttempts = 3;
  
  do {
    try {
      attemptCount++;
      console.log(`Attempt ${attemptCount}: Fetching blocks for ${blockId}`);
      
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 1000, // Reduced from 1000 to avoid rate limits
      });
      
      console.log(`Fetched ${response.results.length} blocks`);
      
      for (const block of response.results) {
        console.log(`Processing block: ${block.type} (${block.id})`);
        
        if (block.has_children && depth < 10) { // Prevent infinite recursion
          try {
            console.log(`Fetching children for ${block.type} block`);
            block.children = await fetchBlocksRecursively(notion, block.id, depth + 1);
            console.log(`Fetched ${block.children.length} child blocks`);
          } catch (childError) {
            console.error(`Error fetching children for block ${block.id}:`, childError);
            block.children = [];
          }
        } else if (block.has_children && depth >= 10) {
          console.log(`Skipping children for block ${block.id} - max depth reached`);
          block.children = [];
        }
        
        blocks.push(block);
      }
      
      cursor = response.has_more ? response.next_cursor : null;
      
      // Add a small delay to avoid rate limiting
      if (cursor) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error) {
      console.error(`Error fetching blocks (attempt ${attemptCount}):`, error);
      
      if (attemptCount >= maxAttempts) {
        console.error(`Max attempts reached for block ${blockId}`);
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attemptCount));
    }
  } while (cursor);
  
  console.log(`Total blocks fetched for ${blockId}: ${blocks.length}`);
  return blocks;
}

let debuggedFirstPageBlocks = false;

// --- Fetch all blocks for a Notion page and serialize to Markdown ---
async function fetchPageContentMarkdown(notion, pageId) {
  console.log(`\n=== Starting content fetch for page ${pageId} ===`);
  
  try {
    // First, verify the page exists and is accessible
    try {
      const pageResponse = await notion.pages.retrieve({ page_id: pageId });
      console.log(`Page verified: ${pageResponse.properties?.Name?.title?.[0]?.plain_text || 'Untitled'}`);
    } catch (pageError) {
      console.error(`Error retrieving page ${pageId}:`, pageError);
      throw new Error(`Page ${pageId} not accessible: ${pageError.message}`);
    }
    
    // Fetch all blocks recursively
    console.log('Fetching blocks recursively...');
    const blocks = await fetchBlocksRecursively(notion, pageId);
    
    if (!blocks || blocks.length === 0) {
      console.log('No blocks found for page');
      return '';
    }
    
    console.log(`\n=== Serializing ${blocks.length} blocks to Markdown ===`);
    
    // Serialize to Markdown
    const markdown = notionBlocksToMarkdown(blocks);
    
    if (!markdown || markdown.trim().length === 0) {
      console.log('Warning: Generated markdown is empty');
      return '';
    }
    
    console.log(`\n=== Content fetch completed ===`);
    console.log(`Final content length: ${markdown.length} characters`);
    console.log(`Content preview: ${markdown.substring(0, 300)}${markdown.length > 300 ? '...' : ''}`);
    
    return markdown;
    
  } catch (error) {
    console.error(`Error fetching content for page ${pageId}:`, error);
    throw error;
  }
}

// --- Utility function for testing individual page content ---
export async function testPageContent(pageId) {
  console.log(`\n=== Testing content fetch for page ${pageId} ===`);
  
  try {
    const content = await fetchPageContentMarkdown(createNotionClient(), pageId);
    
    console.log('\n=== Content Test Results ===');
    console.log(`Content length: ${content.length} characters`);
    console.log(`Content preview:`);
    console.log('---');
    console.log(content.substring(0, 500));
    if (content.length > 500) {
      console.log('...');
    }
    console.log('---');
    
    return {
      success: true,
      content,
      length: content.length
    };
    
  } catch (error) {
    console.error('Content test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// --- Utility function to list all pages in a database ---
export async function listDatabasePages(databaseId) {
  console.log(`\n=== Listing pages in database ${databaseId} ===`);
  
  try {
    const pages = await fetchAllFromNotion(createNotionClient(), databaseId);
    
    console.log(`Found ${pages.length} pages:`);
    pages.forEach((page, index) => {
      const title = page.properties?.Name?.title?.[0]?.plain_text || 
                   page.properties?.Title?.title?.[0]?.plain_text || 
                   'Untitled';
      console.log(`${index + 1}. ${title} (${page.id})`);
    });
    
    return pages;
    
  } catch (error) {
    console.error('Failed to list database pages:', error);
    throw error;
  }
}

// --- BLOG SYNC ---
export async function syncBlogToSupabase() {
  console.log('\n=== Starting Blog Sync ===');
  
  const blogDatabaseId = process.env.NOTION_BLOG_DATABASE_ID;
  if (!blogDatabaseId) {
    throw new Error('NOTION_BLOG_DATABASE_ID is not set');
  }
  
  try {
    console.log('Fetching blog posts from Notion...');
    const blogPosts = await fetchAllFromNotion(createNotionClient(), blogDatabaseId);
    console.log(`Found ${blogPosts.length} blog posts`);
    
    let syncedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < blogPosts.length; i++) {
      const post = blogPosts[i];
      console.log(`\n--- Processing blog post ${i + 1}/${blogPosts.length} ---`);
      
      try {
        const data = await extractBlogData(post, createNotionClient());
        console.log(`Extracted data for: ${data.title}`);
        
        // Check if post already exists
        const { data: existing, error: selectError } = await supabase
          .from('blog_posts')
          .select('id, last_edited')
          .eq('notion_id', post.id)
          .single();
          
        if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Supabase select error:', selectError);
          errorCount++;
          continue;
        }
        
        if (existing) {
          console.log('Post exists, checking if update needed...');
          if (new Date(post.last_edited_time) > new Date(existing.last_edited)) {
            console.log('Updating existing post...');
            const { error } = await supabase
              .from('blog_posts')
              .update(data)
              .eq('notion_id', post.id);
              
            if (error) {
              console.error('Supabase update error:', error);
              errorCount++;
            } else {
              updatedCount++;
              console.log('Post updated successfully');
            }
          } else {
            console.log('Post is up to date, skipping...');
          }
        } else {
          console.log('Inserting new post...');
          const { error } = await supabase
            .from('blog_posts')
            .insert({ ...data, notion_id: post.id });
            
          if (error) {
            console.error('Supabase insert error:', error);
            errorCount++;
          } else {
            syncedCount++;
            console.log('Post inserted successfully');
          }
        }
        
      } catch (error) {
        console.error(`Error processing blog post:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n=== Blog Sync Completed ===`);
    console.log(`Synced: ${syncedCount}, Updated: ${updatedCount}, Errors: ${errorCount}`);
    
    return { syncedCount, updatedCount, errorCount };
    
  } catch (error) {
    console.error('Blog sync failed:', error);
    throw error;
  }
}

async function extractBlogData(post, notion) {
    console.log('Extracting blog data...');
    
    const p = post.properties;
    
    // Extract title with fallbacks
    const title = p.Nombre?.title?.[0]?.plain_text || 
                 p.Title?.title?.[0]?.plain_text || 
                 p.Name?.title?.[0]?.plain_text || 
                 'Untitled';
    
    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Extract description with fallbacks
    const description = p.Description?.rich_text?.[0]?.plain_text || 
                      p.Summary?.rich_text?.[0]?.plain_text || 
                      p.Excerpt?.rich_text?.[0]?.plain_text || 
                      '';
    
    // Extract language with fallbacks
    const lang = (p.Lang?.select?.name || 
                 p.Language?.select?.name || 
                 'en').toLowerCase();
    
    // Extract category with fallbacks
    const category = p.Category?.select?.name || 
                   p.Type?.select?.name || 
                   p.Tags?.multi_select?.[0]?.name || 
                   '';
    
    // Extract author with fallbacks
    const author = p.Author?.rich_text?.[0]?.plain_text || 
                 p.Writer?.rich_text?.[0]?.plain_text || 
                 p.Creator?.rich_text?.[0]?.plain_text || 
                 '';
    
    // Extract publication date
    const pubDate = p.PubDate?.date?.start || 
                   p.PublishedDate?.date?.start || 
                   p.CreatedDate?.date?.start || 
                   post.last_edited_time;
    
    // Extract boolean flags
    const published = p.Published?.checkbox || 
                    p.Public?.checkbox || 
                    false;
    
    const featured = p.Featured?.checkbox || 
                    p.Highlight?.checkbox || 
                    false;
    
    console.log(`Extracted properties: title="${title}", lang="${lang}", category="${category}"`);
    
    // Fetch content
    console.log('Fetching page content...');
    const content = await fetchPageContentMarkdown(notion, post.id);
    
    const data = {
      title,
      slug,
      description,
      content,
      category,
      image: '', // Add if you have an image property
      lang,
      published,
      featured,
      author,
      pub_date: pubDate,
      last_edited: post.last_edited_time,
      updated_at: new Date().toISOString()
    };
    
    console.log(`Blog data extracted successfully. Content length: ${content.length}`);
    return data;
}

export async function getBlogPostsFromSupabase(lang = 'en', options = {}) {
  // Ensure supabase is initialized
  await initializeSupabase();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('lang', lang)
    .eq('published', true)
    .order('pub_date', { ascending: false });
    
  if (error) {
    console.error('Error fetching blog posts from Supabase:', error);
    return [];
  }
  
  return data || [];
}

// --- GUIDES SYNC ---
export async function syncGuidesToSupabase() {
  console.log('\n=== Starting Guides Sync ===');
  
  const guidesDatabaseId = process.env.NOTION_GUIDES_DATABASE_ID;
  if (!guidesDatabaseId) {
    throw new Error('NOTION_GUIDES_DATABASE_ID is not set');
  }
  
  try {
    console.log('Fetching guides from Notion...');
    const guides = await fetchAllFromNotion(createNotionClient(), guidesDatabaseId);
    console.log(`Found ${guides.length} guides`);
    
    let syncedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < guides.length; i++) {
      const guide = guides[i];
      console.log(`\n--- Processing guide ${i + 1}/${guides.length} ---`);
      
      try {
        const data = await extractGuideData(guide, createNotionClient());
        console.log(`Extracted data for: ${data.title}`);
        
        // Check if guide already exists
        const { data: existing, error: selectError } = await supabase
          .from('guides')
          .select('id, last_edited')
          .eq('notion_id', guide.id)
          .single();
          
        if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Supabase select error:', selectError);
          errorCount++;
          continue;
        }
        
        if (existing) {
          console.log('Guide exists, checking if update needed...');
          if (new Date(guide.last_edited_time) > new Date(existing.last_edited)) {
            console.log('Updating existing guide...');
            const { error } = await supabase
              .from('guides')
              .update(data)
              .eq('notion_id', guide.id);
              
            if (error) {
              console.error('Supabase update error:', error);
              errorCount++;
            } else {
              updatedCount++;
              console.log('Guide updated successfully');
            }
          } else {
            console.log('Guide is up to date, skipping...');
          }
        } else {
          console.log('Inserting new guide...');
          const { error } = await supabase
            .from('guides')
            .insert({ ...data, notion_id: guide.id });
            
          if (error) {
            console.error('Supabase insert error:', error);
            errorCount++;
          } else {
            syncedCount++;
            console.log('Guide inserted successfully');
          }
        }
        
      } catch (error) {
        console.error(`Error processing guide:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n=== Guides Sync Completed ===`);
    console.log(`Synced: ${syncedCount}, Updated: ${updatedCount}, Errors: ${errorCount}`);
    
    return { syncedCount, updatedCount, errorCount };
    
  } catch (error) {
    console.error('Guides sync failed:', error);
    throw error;
  }
}

async function extractGuideData(guide, notion) {
  console.log('Extracting guide data...');
  
  const p = guide.properties;
  
  // Extract title with fallbacks
  const title = p.Name?.title?.[0]?.plain_text || 
               p.Title?.title?.[0]?.plain_text || 
               p.Nombre?.title?.[0]?.plain_text || 
               'Untitled';
  
  // Generate slug from title
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  // Extract description with fallbacks
  const description = p.Description?.rich_text?.[0]?.plain_text || 
                    p.Summary?.rich_text?.[0]?.plain_text || 
                    p.Excerpt?.rich_text?.[0]?.plain_text || 
                    '';
  
  // Extract language with fallbacks
  const lang = (p.Lang?.select?.name || 
               p.Language?.select?.name || 
               'en').toLowerCase();
  
  // Extract category with fallbacks
  const category = p.Category?.select?.name || 
                 p.Type?.select?.name || 
                 p.Tags?.multi_select?.[0]?.name || 
                 '';
  
  // Extract author with fallbacks
  const author = p.Author?.rich_text?.[0]?.plain_text || 
               p.Writer?.rich_text?.[0]?.plain_text || 
               p.Creator?.rich_text?.[0]?.plain_text || 
               '';
  
  // Extract boolean flags
  const published = p.Published?.checkbox || 
                  p.Public?.checkbox || 
                  false;
  
  const featured = p.Featured?.checkbox || 
                  p.Highlight?.checkbox || 
                  false;
  
  console.log(`Extracted properties: title="${title}", lang="${lang}", category="${category}"`);
  
  // Fetch content
  console.log('Fetching page content...');
  const content = await fetchPageContentMarkdown(notion, guide.id);
  
  const data = {
    title,
    slug,
    description,
    content,
    category,
    lang,
    published,
    featured,
    author,
    last_edited: guide.last_edited_time,
    updated_at: new Date().toISOString()
  };
  
  console.log(`Guide data extracted successfully. Content length: ${content.length}`);
  return data;
}

export async function getGuidesFromSupabase(lang = 'en') {
  // Ensure supabase is initialized
  const supabaseClient = await initializeSupabase();
  
  // Normalize language to handle both 'en'/'En' and 'es'/'Es'
  const normalizedLang = lang.toLowerCase();
  
  const { data, error } = await supabaseClient
    .from('guides')
    .select('*')
    .eq('published', true)
    .or('archived.is.null,archived.eq.false')
    .order('last_edited', { ascending: false });
  
  if (error) {
    console.error('Error fetching guides:', error);
    return [];
  }
  
  // Filter by language (case-insensitive)
  const filteredGuides = data.filter(guide => 
    guide.lang && guide.lang.toLowerCase() === normalizedLang
  );
  
  return filteredGuides;
}

// --- Shared Notion fetch helper ---
async function fetchAllFromNotion(notion, databaseId) {
  let results = [];
  let hasMore = true;
  let startCursor = undefined;
  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      page_size: 1000,
    });
    results = results.concat(response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor || undefined;
  }
  return results;
} 

export async function syncCLKRToSupabase() {
    const databaseId = '20d0a3cd15e38169928fff5c6f2b219c'; // CLKR database ID
    
    try {
        console.log('🔄 Starting CLKR sync from Notion to Supabase...');
        
        // Fetch all CLKR articles from Notion
        const clkrArticles = await fetchAllCLKRFromNotion();
        console.log(`📊 Found ${clkrArticles.length} CLKR articles in Notion`);
        
        let syncedCount = 0;
        let updatedCount = 0;
        let errorCount = 0;
        
        // Process each CLKR article
        for (const article of clkrArticles) {
            try {
                const articleData = await extractCLKRData(article, createNotionClient());

                // Upsert by notion_id to avoid duplicate key errors and handle slug/lang changes
                const payload = {
                    notion_id: article.id,
                    title: articleData.title,
                    slug: articleData.slug,
                    description: articleData.description,
                    content: articleData.content,
                    module: articleData.module,
                    lang: articleData.lang,
                    reading_time: articleData.reading_time,
                    last_edited: article.last_edited_time,
                    updated_at: new Date().toISOString()
                };

                const { data: upsertData, error } = await supabase
                    .from('clkr_articles')
                    .upsert(payload, { onConflict: 'notion_id' })
                    .select('id, last_edited');

                if (error) {
                    console.error(`❌ Error upserting CLKR article ${articleData.slug}:`, error);
                    errorCount++;
                } else {
                    // Determine if this was an insert or update by comparing timestamps if available
                    // Fallback: count as updated if record existed previously
                    const wasUpdated = Array.isArray(upsertData) && upsertData.length > 0;
                    if (wasUpdated) {
                        updatedCount++;
                        console.log(`✅ Upserted CLKR article: ${articleData.title}`);
                    } else {
                        syncedCount++;
                        console.log(`✅ Inserted CLKR article: ${articleData.title}`);
                    }
                }
            } catch (error) {
                console.error(`❌ Error processing CLKR article:`, error);
                errorCount++;
            }
        }
        
        console.log(`📊 CLKR sync completed:`);
        console.log(`   - New articles synced: ${syncedCount}`);
        console.log(`   - Articles updated: ${updatedCount}`);
        console.log(`   - Errors: ${errorCount}`);
        
        return {
            success: true,
            syncedCount,
            updatedCount,
            errorCount,
            totalProcessed: clkrArticles.length
        };
        
    } catch (error) {
        console.error('❌ CLKR sync failed:', error);
        throw error;
    }
}

async function fetchAllCLKRFromNotion() {
    const notion = createNotionClient();
    const databaseId = '20d0a3cd15e38169928fff5c6f2b219c'; // CLKR database ID
    
    console.log(`🔍 Fetching CLKR articles from Notion database: ${databaseId}`);
    
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: 'Published',
                checkbox: {
                    equals: true
                }
            },
            sorts: [
                {
                    property: 'Last edited time',
                    direction: 'descending'
                }
            ]
        });
        
        console.log(`📊 Found ${response.results.length} published CLKR articles in Notion`);
        return response.results;
    } catch (error) {
        console.error('❌ Error fetching CLKR articles from Notion:', error);
        throw error;
    }
}

async function extractCLKRData(article, notion) {
    console.log(`📝 Extracting data from CLKR article: ${article.id}`);
    
    const p = article.properties;
    
    // Extract title with fallbacks
    const title = p.Name?.title?.[0]?.plain_text || 
                 p.Title?.title?.[0]?.plain_text || 
                 p.Nombre?.title?.[0]?.plain_text || 
                 'Untitled';
    
    // Generate slug from title
    const slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');
    
    // Extract description with fallbacks
    const description = p.Description?.rich_text?.[0]?.plain_text || 
                      p.Summary?.rich_text?.[0]?.plain_text || 
                      p.Excerpt?.rich_text?.[0]?.plain_text || 
                      '';
    
    // Extract language with fallbacks
    const lang = (p.Lang?.select?.name || 
                 p.Language?.select?.name || 
                 'en').toLowerCase();
    
    // Extract module with fallbacks - handle multi_select
    const module = p.Module?.multi_select?.[0]?.name || 
                  p.Module?.select?.name || 
                  p.Category?.select?.name || 
                  p.Type?.select?.name || 
                  'General';
    
    // Extract boolean flags
    const published = p.Published?.checkbox || 
                    p.Public?.checkbox || 
                    false;
    
    const featured = p.Featured?.checkbox || 
                    p.Highlight?.checkbox || 
                    false;
    
    console.log(`📊 Extracted properties: title="${title}", lang="${lang}", module="${module}"`);
    
    // Fetch content
    console.log('📄 Fetching page content...');
    const content = await fetchPageContentMarkdown(notion, article.id);
    
    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    const data = {
        title,
        slug,
        description,
        content,
        module,
        lang,
        published,
        featured,
        reading_time: readingTime,
        last_edited: article.last_edited_time,
        updated_at: new Date().toISOString()
    };
    
    console.log(`✅ CLKR article data extracted successfully. Content length: ${content.length} characters, reading time: ${readingTime} minutes`);
    return data;
} 

// --- SUPER OPTIMIZED GUIDES SYNC ---
export async function syncGuidesToSupabaseSuperOptimized() {
  console.log('\n=== Starting SUPER OPTIMIZED Guides Sync ===');
  
  const guidesDatabaseId = process.env.NOTION_GUIDES_DATABASE_ID;
  if (!guidesDatabaseId) {
    throw new Error('NOTION_GUIDES_DATABASE_ID is not set');
  }
  
  try {
    console.log('🚀 Fetching guides from Notion with aggressive optimization...');
    
    // Get last sync timestamp for incremental sync
    const { data: lastSyncData } = await supabase
      .from('guides')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1);
    
    const lastSyncTime = lastSyncData?.[0]?.updated_at || '1970-01-01T00:00:00Z';
    console.log(`📅 Last sync: ${new Date(lastSyncTime).toLocaleString()}`);
    
    // Fetch guides with filter for recent changes
    const guides = await fetchAllFromNotionOptimized(createNotionClient(), guidesDatabaseId, lastSyncTime);
    console.log(`Found ${guides.length} guides to process`);
    
    if (guides.length === 0) {
      console.log('✅ No guides need updating - all up to date!');
      return { syncedCount: 0, updatedCount: 0, errorCount: 0, totalProcessed: 0, skipped: 0 };
    }
    
    let syncedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    // Aggressive parallel processing - process all guides simultaneously
    const batchSize = 10; // Increased batch size for better throughput
    const batches = [];
    
    for (let i = 0; i < guides.length; i += batchSize) {
      batches.push(guides.slice(i, i + batchSize));
    }
    
    console.log(`⚡ Processing ${guides.length} guides in ${batches.length} batches of ${batchSize} (AGGRESSIVE PARALLEL)`);
    
    // Process all batches in parallel for maximum speed
    const batchPromises = batches.map(async (batch, batchIndex) => {
      console.log(`🚀 Starting batch ${batchIndex + 1}/${batches.length} (${batch.length} guides)`);
      
      // Process batch in parallel
      const guidePromises = batch.map(async (guide) => {
        try {
          // Quick check if guide needs updating
          const { data: existing } = await supabase
            .from('guides')
            .select('id, last_edited, updated_at')
            .eq('notion_id', guide.id)
            .single();
          
          if (existing) {
            const lastEdited = new Date(guide.last_edited_time);
            const lastUpdated = new Date(existing.updated_at);
            
            // Skip if guide hasn't changed (within 1 minute tolerance)
            if (Math.abs(lastEdited.getTime() - lastUpdated.getTime()) < 60000) {
              return { type: 'skipped', guideId: guide.id, reason: 'no changes' };
            }
          }
          
          // Extract data with minimal processing
          const data = await extractGuideDataSuperOptimized(guide, createNotionClient());
          
          // Upsert operation (insert or update) for atomic operation
          const { error } = await supabase
            .from('guides')
            .upsert({ ...data, notion_id: guide.id }, { 
              onConflict: 'notion_id',
              ignoreDuplicates: false 
            });
            
          if (error) {
            console.error(`Error upserting guide ${guide.id}:`, error);
            return { type: 'error', guideId: guide.id };
          } else {
            return existing ? { type: 'updated', guideId: guide.id } : { type: 'synced', guideId: guide.id };
          }
          
        } catch (error) {
          console.error(`Error processing guide ${guide.id}:`, error);
          return { type: 'error', guideId: guide.id };
        }
      });
      
      // Wait for batch to complete
      const batchResults = await Promise.all(guidePromises);
      
      // Count results
      let batchSynced = 0, batchUpdated = 0, batchErrors = 0, batchSkipped = 0;
      batchResults.forEach(result => {
        switch (result.type) {
          case 'synced': batchSynced++; break;
          case 'updated': batchUpdated++; break;
          case 'error': batchErrors++; break;
          case 'skipped': batchSkipped++; break;
        }
      });
      
      console.log(`✅ Batch ${batchIndex + 1} completed: ${batchSynced} synced, ${batchUpdated} updated, ${batchErrors} errors, ${batchSkipped} skipped`);
      
      return { batchSynced, batchUpdated, batchErrors, batchSkipped };
    });
    
    // Wait for all batches to complete
    const allBatchResults = await Promise.all(batchPromises);
    
    // Aggregate results
    allBatchResults.forEach(result => {
      syncedCount += result.batchSynced;
      updatedCount += result.batchUpdated;
      errorCount += result.batchErrors;
      skippedCount += result.batchSkipped;
    });
    
    console.log(`\n=== SUPER OPTIMIZED Guides Sync Completed ===`);
    console.log(`🚀 Synced: ${syncedCount}, Updated: ${updatedCount}, Errors: ${errorCount}, Skipped: ${skippedCount}`);
    
    return { 
      syncedCount, 
      updatedCount, 
      errorCount, 
      skippedCount,
      totalProcessed: syncedCount + updatedCount + errorCount + skippedCount 
    };
    
  } catch (error) {
    console.error('Super optimized guides sync failed:', error);
    throw error;
  }
}

async function fetchAllFromNotionOptimized(notion, databaseId, lastSyncTime) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        timestamp: 'last_edited_time',
        last_edited_time: {
          after: lastSyncTime
        }
      },
      sorts: [
        {
          property: 'last_edited_time',
          direction: 'descending'
        }
      ],
      page_size: 100 // Maximum page size for fewer API calls
    });
    
    return response.results;
  } catch (error) {
    console.error('Error fetching guides from Notion:', error);
    // Fallback to fetching all guides if filter fails
    return fetchAllFromNotion(notion, databaseId);
  }
}

async function extractGuideDataSuperOptimized(guide, notion) {
  const p = guide.properties;
  
  // Ultra-fast property extraction with minimal operations
  const title = p.Name?.title?.[0]?.plain_text || 
               p.Title?.title?.[0]?.plain_text || 
               p.Nombre?.title?.[0]?.plain_text || 
               'Untitled';
  
  // Optimized slug generation
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  // Batch property extraction
  const [description, lang, category, author, published, featured] = [
    p.Description?.rich_text?.[0]?.plain_text || p.Summary?.rich_text?.[0]?.plain_text || p.Excerpt?.rich_text?.[0]?.plain_text || '',
    (p.Lang?.select?.name || p.Language?.select?.name || 'en').toLowerCase(),
    p.Category?.select?.name || p.Type?.select?.name || p.Tags?.multi_select?.[0]?.name || '',
    p.Author?.rich_text?.[0]?.plain_text || p.Writer?.rich_text?.[0]?.plain_text || p.Creator?.rich_text?.[0]?.plain_text || '',
    p.Published?.checkbox || p.Public?.checkbox || false,
    p.Featured?.checkbox || p.Highlight?.checkbox || false
  ];
  
  // Fetch content with maximum optimization
  const content = await fetchPageContentMarkdownSuperOptimized(notion, guide.id);
  
  return {
    title,
    slug,
    description,
    content,
    category,
    lang,
    published,
    featured,
    author,
    last_edited: guide.last_edited_time,
    updated_at: new Date().toISOString()
  };
}

async function fetchPageContentMarkdownSuperOptimized(notion, pageId) {
  try {
    // Fetch all blocks in one optimized call
    const blocks = await fetchAllBlocksSuperOptimized(notion, pageId);
    return notionBlocksToMarkdownSuperOptimized(blocks);
  } catch (error) {
    console.error(`Error fetching content for page ${pageId}:`, error);
    return '';
  }
}

async function fetchAllBlocksSuperOptimized(notion, blockId, depth = 0) {
  const allBlocks = [];
  let hasMore = true;
  let startCursor = undefined;
  
  // Limit depth to prevent excessive recursion
  if (depth > 2) return allBlocks;
  
  while (hasMore) {
    try {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: startCursor,
        page_size: 100 // Maximum page size
      });
      
      allBlocks.push(...response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor;
      
      // Process children in parallel for maximum speed
      const blocksWithChildren = response.results.filter(block => block.has_children);
      if (blocksWithChildren.length > 0) {
        const childPromises = blocksWithChildren.map(async (block) => {
          try {
            const children = await fetchAllBlocksSuperOptimized(notion, block.id, depth + 1);
            block.children = children;
          } catch (error) {
            block.children = [];
          }
        });
        
        await Promise.all(childPromises);
      }
      
    } catch (error) {
      console.error(`Error fetching blocks for ${blockId}:`, error);
      hasMore = false;
    }
  }
  
  return allBlocks;
}

function notionBlocksToMarkdownSuperOptimized(blocks, indentLevel = 0) {
  if (!blocks || blocks.length === 0) return '';
  
  // Pre-allocate string capacity for better performance
  let markdown = '';
  const estimatedLength = blocks.length * 50; // Rough estimate
  markdown = markdown.padStart(estimatedLength);
  
  // Use more efficient string building
  const parts = [];
  const indent = '  '.repeat(indentLevel);
  let numberedListCounter = 0;
  
  for (const block of blocks) {
    try {
      // Reset numbered list counter if the next block is not a numbered_list_item
      if (block.type !== 'numbered_list_item' && numberedListCounter > 0) {
        numberedListCounter = 0;
      }

      switch (block.type) {
        case 'paragraph':
          if (block.paragraph.rich_text.length > 0) {
            const text = block.paragraph.rich_text.map(rt => rt.plain_text).join('');
            parts.push(indent + text, '\n\n');
          } else {
            parts.push('\n');
          }
          // Process nested children
          if (block.children && block.children.length > 0) {
            parts.push(notionBlocksToMarkdownSuperOptimized(block.children, indentLevel + 1));
          }
          break;
          
        case 'heading_1':
          const h1Text = block.heading_1.rich_text.map(rt => rt.plain_text).join('');
          parts.push(`# ${h1Text}\n\n`);
          break;
          
        case 'heading_2':
          const h2Text = block.heading_2.rich_text.map(rt => rt.plain_text).join('');
          parts.push(`## ${h2Text}\n\n`);
          break;
          
        case 'heading_3':
          const h3Text = block.heading_3.rich_text.map(rt => rt.plain_text).join('');
          parts.push(`### ${h3Text}\n\n`);
          break;
          
        case 'bulleted_list_item':
          const bulletText = block.bulleted_list_item.rich_text.map(rt => rt.plain_text).join('');
          parts.push(`${indent}- ${bulletText}\n`);
          // Process nested children
          if (block.children && block.children.length > 0) {
            parts.push(notionBlocksToMarkdownSuperOptimized(block.children, indentLevel + 1));
          }
          break;
          
        case 'numbered_list_item':
          numberedListCounter++;
          const numberedText = block.numbered_list_item.rich_text.map(rt => rt.plain_text).join('');
          parts.push(`${indent}${numberedListCounter}. ${numberedText}\n`);
          // Process nested children
          if (block.children && block.children.length > 0) {
            parts.push(notionBlocksToMarkdownSuperOptimized(block.children, indentLevel + 1));
          }
          break;
          
        case 'to_do':
          const todoText = block.to_do.rich_text.map(rt => rt.plain_text).join('');
          const todoChecked = block.to_do.checked ? 'x' : ' ';
          parts.push(`${indent}- [${todoChecked}] ${todoText}\n`);
          // Process nested children
          if (block.children && block.children.length > 0) {
            parts.push(notionBlocksToMarkdownSuperOptimized(block.children, indentLevel + 1));
          }
          break;
          
        case 'code':
          const codeText = block.code.rich_text.map(rt => rt.plain_text).join('');
          const language = block.code.language || '';
          parts.push(`\`\`\`${language}\n${codeText}\n\`\`\`\n\n`);
          break;
          
        case 'quote':
          const quoteText = block.quote.rich_text.map(rt => rt.plain_text).join('');
          parts.push(`> ${quoteText}\n\n`);
          // Process nested children
          if (block.children && block.children.length > 0) {
            const quoteChildren = notionBlocksToMarkdownSuperOptimized(block.children, indentLevel);
            parts.push(quoteChildren.split('\n').map(line => line ? '> ' + line : '').join('\n') + '\n\n');
          }
          break;
          
        case 'callout':
          const calloutText = block.callout.rich_text.map(rt => rt.plain_text).join('');
          parts.push(`> [!NOTE] ${calloutText}\n\n`);
          // Process nested children
          if (block.children && block.children.length > 0) {
            const calloutChildren = notionBlocksToMarkdownSuperOptimized(block.children, indentLevel);
            parts.push(calloutChildren.split('\n').map(line => line ? '> ' + line : '').join('\n') + '\n\n');
          }
          break;
          
        case 'divider':
          parts.push('---\n\n');
          break;
          
        case 'toggle':
          const toggleText = block.toggle.rich_text.map(rt => rt.plain_text).join('');
          parts.push(`<details><summary>${toggleText}</summary>\n\n`);
          if (block.children && block.children.length > 0) {
            parts.push(notionBlocksToMarkdownSuperOptimized(block.children, indentLevel));
          }
          parts.push('</details>\n\n');
          break;
          
        case 'column_list':
        case 'column':
          if (block.children && block.children.length > 0) {
            parts.push(notionBlocksToMarkdownSuperOptimized(block.children, indentLevel));
          }
          break;
          
        default:
          if (block.children && block.children.length > 0) {
            parts.push(notionBlocksToMarkdownSuperOptimized(block.children, indentLevel));
          }
          break;
      }
    } catch (error) {
      continue; // Skip problematic blocks silently for speed
    }
  }
  
  return parts.join('');
} 