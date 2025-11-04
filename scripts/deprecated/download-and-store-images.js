import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images/notion');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download image from URL
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(imagesDir, filename));
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve(`/images/notion/${filename}`);
        });
      } else {
        console.error(`❌ Failed to download ${url}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`❌ Error downloading ${url}:`, err.message);
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
      
      // Download the image
      const localPath = await downloadImage(url, filename);
      
      // Replace the URL in content
      processedContent = processedContent.replace(fullMatch, `![${alt}](${localPath})`);
      
      console.log(`🔄 Replaced: ${url} → ${localPath}`);
      
    } catch (error) {
      console.error(`❌ Failed to process image ${url}:`, error.message);
      // Keep original URL if download fails
    }
  }
  
  return processedContent;
}

// Function to process all content in database
async function processAllContentImages() {
  console.log('🚀 Starting image download and storage process...');
  
  try {
    // Import your Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Process guides
    console.log('📚 Processing guides...');
    const { data: guides, error: guidesError } = await supabase
      .from('guides')
      .select('id, content, lang');
    
    if (guidesError) throw guidesError;
    
    for (const guide of guides) {
      if (guide.content) {
        console.log(`Processing guide: ${guide.id} (${guide.lang})`);
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
      if (post.content) {
        console.log(`Processing blog post: ${post.id} (${post.lang})`);
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
    
    console.log('🎉 Image processing completed!');
    
  } catch (error) {
    console.error('❌ Error processing images:', error);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllContentImages();
}

export { processContentImages, downloadImage };
