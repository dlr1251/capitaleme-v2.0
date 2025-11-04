import { syncGuidesToSupabase } from '../src/server/lib/syncNotionToSupabase.js';

async function main() {
  try {
    console.log('Syncing guides from Notion to Supabase...');
    const result = await syncGuidesToSupabase();
    console.log('✅ Guides sync completed successfully!');
    console.log('Summary:', result);
  } catch (err) {
    console.error('❌ Guides sync failed:', err);
    process.exit(1);
  }
}

main();
