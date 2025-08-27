import { syncGuidesToSupabase, syncGuidesToSupabaseOptimized } from '../src/server/lib/syncNotionToSupabase.js';

async function comparePerformance() {
  console.log('🚀 Performance Comparison: Original vs Optimized Sync');
  console.log('=====================================================\n');
  
  // Test original sync
  console.log('📊 Testing ORIGINAL sync function...');
  const originalStart = Date.now();
  
  try {
    const originalResult = await syncGuidesToSupabase();
    const originalEnd = Date.now();
    const originalDuration = (originalEnd - originalStart) / 1000;
    
    console.log(`✅ Original sync completed in ${originalDuration.toFixed(2)} seconds`);
    console.log(`📈 Original results:`, originalResult);
    
    // Wait a bit before testing optimized version
    console.log('\n⏳ Waiting 5 seconds before testing optimized version...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test optimized sync
    console.log('🚀 Testing OPTIMIZED sync function...');
    const optimizedStart = Date.now();
    
    try {
      const optimizedResult = await syncGuidesToSupabaseOptimized();
      const optimizedEnd = Date.now();
      const optimizedDuration = (optimizedEnd - optimizedStart) / 1000;
      
      console.log(`✅ Optimized sync completed in ${optimizedDuration.toFixed(2)} seconds`);
      console.log(`📈 Optimized results:`, optimizedResult);
      
      // Performance comparison
      console.log('\n🏆 PERFORMANCE COMPARISON');
      console.log('========================');
      console.log(`Original sync time: ${originalDuration.toFixed(2)} seconds`);
      console.log(`Optimized sync time: ${optimizedDuration.toFixed(2)} seconds`);
      
      if (optimizedDuration < originalDuration) {
        const improvement = ((originalDuration - optimizedDuration) / originalDuration * 100).toFixed(1);
        console.log(`🚀 Performance improvement: ${improvement}% faster!`);
        console.log(`⏱️  Time saved: ${(originalDuration - optimizedDuration).toFixed(2)} seconds`);
      } else {
        const slowdown = ((optimizedDuration - originalDuration) / originalDuration * 100).toFixed(1);
        console.log(`⚠️  Performance change: ${slowdown}% slower`);
      }
      
      // Per-guide performance
      const originalPerGuide = originalDuration / (originalResult.syncedCount + originalResult.updatedCount + originalResult.errorCount);
      const optimizedPerGuide = optimizedDuration / (optimizedResult.syncedCount + optimizedResult.updatedCount + optimizedResult.errorCount);
      
      console.log(`\n📊 Per-guide performance:`);
      console.log(`Original: ${originalPerGuide.toFixed(3)} seconds per guide`);
      console.log(`Optimized: ${optimizedPerGuide.toFixed(3)} seconds per guide`);
      
    } catch (error) {
      console.error('❌ Optimized sync failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Original sync failed:', error);
  }
}

// Only run comparison if explicitly requested
if (process.argv.includes('--compare')) {
  comparePerformance();
} else {
  console.log('To run performance comparison, use: node scripts/compare-sync-performance.js --compare');
  console.log('This will test both sync functions and compare their performance.');
}
