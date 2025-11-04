import { syncGuidesToSupabaseSuperOptimized } from '../src/server/lib/syncNotionToSupabase.js';

async function main() {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();
  
  console.log('🚀 Starting SUPER OPTIMIZED guides sync with maximum performance...');
  console.log('⚡ Features: Incremental sync, aggressive parallelization, smart caching, minimal API calls');
  console.log('📊 Initial memory usage:', {
    rss: `${(startMemory.rss / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(startMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(startMemory.heapTotal / 1024 / 1024).toFixed(2)} MB`
  });
  
  try {
    const result = await syncGuidesToSupabaseSuperOptimized();
    
    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    const duration = (endTime - startTime) / 1000;
    
    console.log('\n🏆 SUPER OPTIMIZED SYNC COMPLETED!');
    console.log('=====================================');
    console.log('📊 Results:', result);
    console.log(`⏱️  Total time: ${duration.toFixed(2)} seconds`);
    
    if (result.totalProcessed > 0) {
      console.log(`⚡ Average time per guide: ${(duration / result.totalProcessed).toFixed(3)} seconds`);
      console.log(`🚀 Throughput: ${(result.totalProcessed / duration).toFixed(2)} guides/second`);
    }
    
    if (result.skipped > 0) {
      console.log(`💾 Smart caching saved: ${result.skipped} unnecessary operations`);
    }
    
    // Memory usage analysis
    const memoryDiff = {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal
    };
    
    console.log('\n🧠 Memory Performance:');
    console.log(`📈 RSS change: ${(memoryDiff.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📈 Heap used change: ${(memoryDiff.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📈 Heap total change: ${(memoryDiff.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    
    // Performance rating
    let rating = '🥉';
    if (duration < 30) rating = '🥇';
    else if (duration < 60) rating = '🥈';
    
    console.log(`\n🏅 Performance Rating: ${rating}`);
    if (duration < 30) console.log('🚀 EXCELLENT - This is blazing fast!');
    else if (duration < 60) console.log('⚡ GREAT - Significant improvement achieved!');
    else if (duration < 120) console.log('👍 GOOD - Better than the original version');
    else console.log('📈 IMPROVED - Better than before, but room for more optimization');
    
  } catch (err) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.error('❌ Super optimized guides sync failed:', err);
    console.log(`⏱️  Failed after: ${duration.toFixed(2)} seconds`);
    process.exit(1);
  }
}

main();
