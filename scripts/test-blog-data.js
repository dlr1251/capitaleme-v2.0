import 'dotenv/config';
import { getBlogPostsFromSupabase } from '../src/server/lib/syncNotionToSupabase.js';

async function testBlogData() {
  console.log('=== Testing Blog Data from Supabase ===\n');
  
  try {
    // Test English blog posts
    console.log('1. Testing English blog posts...');
    const enPosts = await getBlogPostsFromSupabase('en');
    console.log(`✅ Found ${enPosts.length} English posts`);
    if (enPosts.length > 0) {
      console.log('Sample post:', {
        title: enPosts[0].title,
        author: enPosts[0].author,
        category: enPosts[0].category,
        pub_date: enPosts[0].pub_date
      });
    }
    
    // Test Spanish blog posts
    console.log('\n2. Testing Spanish blog posts...');
    const esPosts = await getBlogPostsFromSupabase('es');
    console.log(`✅ Found ${esPosts.length} Spanish posts`);
    if (esPosts.length > 0) {
      console.log('Sample post:', {
        title: esPosts[0].title,
        author: esPosts[0].author,
        category: esPosts[0].category,
        pub_date: esPosts[0].pub_date
      });
    }
    
    console.log('\n=== Blog Data Test Complete ===');
    console.log(`Total English Posts: ${enPosts.length}`);
    console.log(`Total Spanish Posts: ${esPosts.length}`);
    
    // Show all posts structure
    if (enPosts.length > 0) {
      console.log('\n=== Sample Post Structure ===');
      console.log(JSON.stringify(enPosts[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error testing blog data:', error);
  }
}

testBlogData();