#!/usr/bin/env node

import { syncCLKRToSupabase } from '../src/lib/syncNotionToSupabase.js';
import 'dotenv/config';

async function main() {
  try {
    console.log('🚀 Starting CLKR sync from Notion to Supabase...');
    
    const result = await syncCLKRToSupabase();
    
    console.log('✅ Sync completed successfully!');
    console.log(`📊 Results:`);
    console.log(`   - New articles synced: ${result.syncedCount}`);
    console.log(`   - Articles updated: ${result.updatedCount}`);
    console.log(`   - Errors: ${result.errorCount}`);
    
    if (result.errorCount > 0) {
      console.log('⚠️  Some articles had errors during sync. Check the logs above.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

main(); 