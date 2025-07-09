// Debug script to test Notion image extraction
// Run with: node --loader ts-node/esm debug-notion-images.js

import { getNotionDatabase } from './src/utils/notion.ts';

// Debug script to test Notion image extraction
async function debugNotionImages() {
  try {
    console.log('🔍 Starting Notion image debug...\n');
    
    const databaseId = '2130a3cd15e38019bc9fce1432312c6c';
    console.log(`📊 Fetching database: ${databaseId}`);
    
    const allPages = await getNotionDatabase(databaseId);
    console.log(`✅ Fetched ${allPages.length} pages from Notion\n`);
    
    // Filter for English posts only and published posts
    const pages = allPages.filter(page => {
      const langValue = page.properties?.Lang?.select?.name;
      const isEnglish = langValue === 'En' || langValue === 'EN' || langValue === 'English';
      const isPublished = page.properties?.Published?.checkbox === true;
      
      return isEnglish && isPublished;
    });
    
    console.log(`📝 Found ${pages.length} English published posts\n`);
    
    // Analyze each page's image data
    pages.forEach((page, index) => {
      const title = page.properties?.Nombre?.title?.[0]?.plain_text || 'Untitled';
      const cover = page.cover;
      const icon = page.icon;
      
      console.log(`\n📄 Page ${index + 1}: "${title}"`);
      console.log(`   ID: ${page.id}`);
      console.log(`   Last edited: ${page.last_edited_time}`);
      
      // Check cover image
      if (cover) {
        console.log(`   🖼️  Cover found:`);
        console.log(`      Type: ${cover.type}`);
        if (cover.type === 'external') {
          console.log(`      URL: ${cover.external?.url}`);
        } else if (cover.type === 'file') {
          console.log(`      URL: ${cover.file?.url}`);
        }
      } else {
        console.log(`   ❌ No cover image found`);
      }
      
      // Check icon
      if (icon) {
        console.log(`   🎨 Icon found:`);
        console.log(`      Type: ${icon.type}`);
        if (icon.type === 'emoji') {
          console.log(`      Emoji: ${icon.emoji}`);
        }
      } else {
        console.log(`   ❌ No icon found`);
      }
      
      // Check properties for image fields
      const properties = page.properties;
      console.log(`   📋 Properties:`);
      Object.keys(properties).forEach(propName => {
        const prop = properties[propName];
        if (prop.type === 'rich_text' && prop.rich_text?.length > 0) {
          const text = prop.rich_text[0].plain_text;
          if (text.includes('http') && (text.includes('.jpg') || text.includes('.png') || text.includes('.jpeg'))) {
            console.log(`      📸 Possible image URL in ${propName}: ${text}`);
          }
        }
      });
    });
    
    // Test image URL accessibility
    console.log(`\n🔗 Testing image URL accessibility...`);
    const testUrls = [];
    
    pages.forEach(page => {
      if (page.cover?.type === 'external') {
        testUrls.push(page.cover.external.url);
      } else if (page.cover?.type === 'file') {
        testUrls.push(page.cover.file.url);
      }
    });
    
    if (testUrls.length > 0) {
      console.log(`Found ${testUrls.length} image URLs to test:`);
      testUrls.forEach((url, index) => {
        console.log(`   ${index + 1}. ${url}`);
      });
    } else {
      console.log(`❌ No image URLs found in cover properties`);
    }
    
    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`   Total pages: ${allPages.length}`);
    console.log(`   English published: ${pages.length}`);
    console.log(`   Pages with cover: ${pages.filter(p => p.cover).length}`);
    console.log(`   Pages with icon: ${pages.filter(p => p.icon).length}`);
    console.log(`   Image URLs found: ${testUrls.length}`);
    
  } catch (error) {
    console.error('❌ Error debugging Notion images:', error);
  }
}

// Run the debug script
debugNotionImages(); 