#!/usr/bin/env node

import 'dotenv/config';
import { syncVisasToSupabase } from '../src/server/lib/syncNotionToSupabase.js';

async function main() {
  console.log('🚀 Starting OPTIMIZED visa sync from Notion to Supabase...');
  console.log('📋 Environment check:');
  console.log(`   - NOTION_API_KEY: ${process.env.NOTION_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - NOTION_VISAS_DATABASE_ID: ${process.env.NOTION_VISAS_DATABASE_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`);
  
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_VISAS_DATABASE_ID) {
    console.error('❌ Missing required Notion environment variables');
    process.exit(1);
  }
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required Supabase environment variables');
    console.error('   Visa sync will use mock Supabase client');
  }

  const startTime = Date.now();
  console.log('\n⏱️  Starting optimized sync...');

  try {
    const result = await syncVisasToSupabase();
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('\n✅ OPTIMIZED Visa sync completed successfully!');
    console.log(`⏱️  Total time: ${duration.toFixed(2)} seconds`);
    console.log(`📊 Results:`);
    console.log(`   - Synced: ${result.syncedCount}`);
    console.log(`   - Updated: ${result.updatedCount}`);
    console.log(`   - Errors: ${result.errorCount}`);
    console.log(`   - Performance: ${((result.syncedCount + result.updatedCount) / duration).toFixed(2)} visas/second`);
    
    if (result.errorCount > 0) {
      console.log('\n⚠️  Some visas had errors during sync. Check the logs above for details.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ OPTIMIZED Visa sync failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
