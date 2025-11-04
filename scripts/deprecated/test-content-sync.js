import { testPageContent, listDatabasePages, syncBlogToSupabase, syncGuidesToSupabase } from '../src/server/lib/syncNotionToSupabase.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];

  console.log('Content Sync Test Script');
  console.log('=======================');
  console.log('Commands:');
  console.log('  test-page <pageId>     - Test content fetch for a specific page');
  console.log('  list-blog              - List all pages in blog database');
  console.log('  list-guides            - List all pages in guides database');
  console.log('  sync-blog              - Sync all blog posts');
  console.log('  sync-guides            - Sync all guides');
  console.log('  check-env              - Check environment variables');
  console.log('');

  try {
    switch (command) {
      case 'check-env':
        console.log('Environment Variables Check:');
        console.log('==========================');
        console.log(`NOTION_API_KEY: ${process.env.NOTION_API_KEY ? '✅ Set' : '❌ Missing'}`);
        console.log(`NOTION_BLOG_DATABASE_ID: ${process.env.NOTION_BLOG_DATABASE_ID ? '✅ Set' : '❌ Missing'}`);
        console.log(`NOTION_GUIDES_DATABASE_ID: ${process.env.NOTION_GUIDES_DATABASE_ID ? '✅ Set' : '❌ Missing'}`);
        console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
        console.log(`SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);
        break;

      case 'test-page':
        if (!arg) {
          console.error('Please provide a page ID');
          process.exit(1);
        }
        await testPageContent(arg);
        break;

      case 'list-blog':
        await listDatabasePages(process.env.NOTION_BLOG_DATABASE_ID);
        break;

      case 'list-guides':
        await listDatabasePages(process.env.NOTION_GUIDES_DATABASE_ID);
        break;

      case 'sync-blog':
        await syncBlogToSupabase();
        break;

      case 'sync-guides':
        await syncGuidesToSupabase();
        break;

      default:
        console.error('Unknown command. Use one of: check-env, test-page, list-blog, list-guides, sync-blog, sync-guides');
        process.exit(1);
    }
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

main(); 