import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
async function uploadToCloudinary(imageUrl, folder = 'capitaleme') {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });
    
    console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload ${imageUrl}:`, error.message);
    throw error;
  }
}

// Function to process content and replace image URLs with Cloudinary URLs
async function processContentWithCloudinary(content, folder = 'capitaleme') {
  if (!content) return content;
  
  // Find all image URLs in markdown format ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const matches = [...content.matchAll(imageRegex)];
  
  let processedContent = content;
  
  for (const match of matches) {
    const [fullMatch, alt, url] = match;
    
    // Skip if already a Cloudinary URL
    if (url.includes('cloudinary.com')) {
      continue;
    }
    
    // Skip if it's not a Notion/S3 URL
    if (!url.includes('amazonaws.com') && !url.includes('notion.so')) {
      continue;
    }
    
    try {
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(url, folder);
      
      // Replace the URL in content
      processedContent = processedContent.replace(fullMatch, `![${alt}](${cloudinaryUrl})`);
      
      console.log(`🔄 Replaced: ${url} → ${cloudinaryUrl}`);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed to process image ${url}:`, error.message);
      // Keep original URL if upload fails
    }
  }
  
  return processedContent;
}

// Function to process all content in database
async function migrateAllImagesToCloudinary() {
  console.log('🚀 Starting Cloudinary image migration...');
  
  try {
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
        const processedContent = await processContentWithCloudinary(guide.content, 'capitaleme/guides');
        
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
        const processedContent = await processContentWithCloudinary(post.content, 'capitaleme/blog');
        
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
    
    console.log('🎉 Cloudinary migration completed!');
    
  } catch (error) {
    console.error('❌ Error migrating images:', error);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateAllImagesToCloudinary();
}

export { processContentWithCloudinary, uploadToCloudinary };
