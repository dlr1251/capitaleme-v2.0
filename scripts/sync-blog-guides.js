import { syncBlogToSupabase, syncGuidesToSupabase } from '../src/lib/syncNotionToSupabase.js';

async function main() {
  try {
    console.log('Syncing blog posts from Notion to Supabase...');
    await syncBlogToSupabase();
    console.log('✅ Blog posts synced.');

    console.log('Syncing guides from Notion to Supabase...');
    await syncGuidesToSupabase();
    console.log('✅ Guides synced.');
  } catch (err) {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  }
}

main(); 