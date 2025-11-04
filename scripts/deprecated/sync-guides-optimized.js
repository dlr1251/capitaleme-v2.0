import { syncGuidesToSupabaseOptimized } from '../src/server/lib/syncNotionToSupabase.js';

async function main() {
  const startTime = Date.now();
  
  try {
    console.log('🚀 Starting optimized guides sync...');
    const result = await syncGuidesToSupabaseOptimized();
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('✅ Guides sync completed successfully!');
    console.log('📊 Summary:', result);
    console.log(`⏱️  Total time: ${duration.toFixed(2)} seconds`);
    console.log(`⚡ Average time per guide: ${(duration / result.totalProcessed).toFixed(2)} seconds`);
    
  } catch (err) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.error('❌ Guides sync failed:', err);
    console.log(`⏱️  Failed after: ${duration.toFixed(2)} seconds`);
    process.exit(1);
  }
}

main();
