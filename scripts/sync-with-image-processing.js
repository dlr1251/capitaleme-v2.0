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

// Main function to sync and process images
async function syncWithImageProcessing() {
  console.log('🚀 Starting Notion sync with image processing...');
  
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables. Please check your .env file.');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get all guides
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
    
    // Get all blog posts
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
    
    console.log('🎉 Sync with image processing completed!');
    
  } catch (error) {
    console.error('❌ Error during sync:', error);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  syncWithImageProcessing();
}

export { syncWithImageProcessing, processContentImages };
