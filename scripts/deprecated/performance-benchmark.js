import { 
  syncGuidesToSupabase, 
  syncGuidesToSupabaseOptimized, 
  syncGuidesToSupabaseSuperOptimized 
} from '../src/server/lib/syncNotionToSupabase.js';

async function runPerformanceBenchmark() {
  console.log('🏁 COMPREHENSIVE PERFORMANCE BENCHMARK');
  console.log('=======================================');
  console.log('Testing all three sync versions for maximum performance analysis\n');
  
  const results = {};
  
  // Test 1: Original Sync
  console.log('📊 TEST 1: ORIGINAL SYNC');
  console.log('==========================');
  try {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    
    const result = await syncGuidesToSupabase();
    
    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    const duration = (endTime - startTime) / 1000;
    
    results.original = {
      duration,
      memory: {
        start: startMemory,
        end: endMemory,
        diff: {
          rss: endMemory.rss - startMemory.rss,
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          heapTotal: endMemory.heapTotal - startMemory.heapTotal
        }
      },
      result
    };
    
    console.log(`✅ Original sync completed in ${duration.toFixed(2)} seconds`);
    console.log(`📊 Results:`, result);
    console.log(`🧠 Memory change: ${(results.original.memory.diff.rss / 1024 / 1024).toFixed(2)} MB RSS\n`);
    
  } catch (error) {
    console.error('❌ Original sync failed:', error);
    results.original = { error: error.message };
  }
  
  // Wait between tests
  console.log('⏳ Waiting 10 seconds before next test...\n');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Test 2: Optimized Sync
  console.log('🚀 TEST 2: OPTIMIZED SYNC');
  console.log('==========================');
  try {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    
    const result = await syncGuidesToSupabaseOptimized();
    
    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    const duration = (endTime - startTime) / 1000;
    
    results.optimized = {
      duration,
      memory: {
        start: startMemory,
        end: endMemory,
        diff: {
          rss: endMemory.rss - startMemory.rss,
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          heapTotal: endMemory.heapTotal - startMemory.heapTotal
        }
      },
      result
    };
    
    console.log(`✅ Optimized sync completed in ${duration.toFixed(2)} seconds`);
    console.log(`📊 Results:`, result);
    console.log(`🧠 Memory change: ${(results.optimized.memory.diff.rss / 1024 / 1024).toFixed(2)} MB RSS\n`);
    
  } catch (error) {
    console.error('❌ Optimized sync failed:', error);
    results.optimized = { error: error.message };
  }
  
  // Wait between tests
  console.log('⏳ Waiting 10 seconds before final test...\n');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Test 3: Super Optimized Sync
  console.log('⚡ TEST 3: SUPER OPTIMIZED SYNC');
  console.log('================================');
  try {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    
    const result = await syncGuidesToSupabaseSuperOptimized();
    
    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    const duration = (endTime - startTime) / 1000;
    
    results.superOptimized = {
      duration,
      memory: {
        start: startMemory,
        end: endMemory,
        diff: {
          rss: endMemory.rss - startMemory.rss,
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          heapTotal: endMemory.heapTotal - startMemory.heapTotal
        }
      },
      result
    };
    
    console.log(`✅ Super optimized sync completed in ${duration.toFixed(2)} seconds`);
    console.log(`📊 Results:`, result);
    console.log(`🧠 Memory change: ${(results.superOptimized.memory.diff.rss / 1024 / 1024).toFixed(2)} MB RSS\n`);
    
  } catch (error) {
    console.error('❌ Super optimized sync failed:', error);
    results.superOptimized = { error: error.message };
  }
  
  // Comprehensive Analysis
  console.log('🏆 COMPREHENSIVE PERFORMANCE ANALYSIS');
  console.log('=====================================');
  
  if (results.original && results.original.duration && 
      results.optimized && results.optimized.duration && 
      results.superOptimized && results.superOptimized.duration) {
    
    const original = results.original.duration;
    const optimized = results.optimized.duration;
    const superOpt = results.superOptimized.duration;
    
    console.log('\n⏱️  SPEED COMPARISON:');
    console.log(`Original:        ${original.toFixed(2)}s`);
    console.log(`Optimized:       ${optimized.toFixed(2)}s`);
    console.log(`Super Optimized: ${superOpt.toFixed(2)}s`);
    
    console.log('\n🚀 PERFORMANCE IMPROVEMENTS:');
    const optImprovement = ((original - optimized) / original * 100).toFixed(1);
    const superImprovement = ((original - superOpt) / original * 100).toFixed(1);
    const superVsOpt = ((optimized - superOpt) / optimized * 100).toFixed(1);
    
    console.log(`Optimized vs Original:     ${optImprovement}% faster`);
    console.log(`Super Optimized vs Original: ${superImprovement}% faster`);
    console.log(`Super Optimized vs Optimized: ${superVsOpt}% faster`);
    
    console.log('\n📊 THROUGHPUT ANALYSIS:');
    const originalThroughput = results.original.result.totalProcessed / original;
    const optimizedThroughput = results.optimized.result.totalProcessed / optimized;
    const superThroughput = results.superOptimized.result.totalProcessed / superOpt;
    
    console.log(`Original:        ${originalThroughput.toFixed(2)} guides/second`);
    console.log(`Optimized:       ${optimizedThroughput.toFixed(2)} guides/second`);
    console.log(`Super Optimized: ${superThroughput.toFixed(2)} guides/second`);
    
    console.log('\n🧠 MEMORY EFFICIENCY:');
    const originalMemory = results.original.memory.diff.rss / 1024 / 1024;
    const optimizedMemory = results.optimized.memory.diff.rss / 1024 / 1024;
    const superMemory = results.superOptimized.memory.diff.rss / 1024 / 1024;
    
    console.log(`Original:        ${originalMemory.toFixed(2)} MB`);
    console.log(`Optimized:       ${optimizedMemory.toFixed(2)} MB`);
    console.log(`Super Optimized: ${superMemory.toFixed(2)} MB`);
    
    // Performance rating
    console.log('\n🏅 OVERALL PERFORMANCE RATING:');
    if (superOpt < 30) {
      console.log('🥇 GOLD - Super optimized is blazing fast!');
    } else if (superOpt < 60) {
      console.log('🥈 SILVER - Excellent performance achieved!');
    } else if (superOpt < 120) {
      console.log('🥉 BRONZE - Good performance with room for improvement');
    } else {
      console.log('📈 IMPROVED - Better than original but needs more work');
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (superImprovement > 50) {
      console.log('🚀 Use Super Optimized version - massive improvement achieved!');
    } else if (superImprovement > 25) {
      console.log('⚡ Use Super Optimized version - significant improvement!');
    } else if (superImprovement > 10) {
      console.log('👍 Use Super Optimized version - noticeable improvement');
    } else {
      console.log('📈 Super Optimized provides modest improvement, consider further optimization');
    }
    
  } else {
    console.log('❌ Cannot complete analysis - some tests failed');
    console.log('Results:', results);
  }
}

// Only run benchmark if explicitly requested
if (process.argv.includes('--benchmark')) {
  runPerformanceBenchmark();
} else {
  console.log('To run comprehensive performance benchmark, use:');
  console.log('node scripts/performance-benchmark.js --benchmark');
  console.log('\nThis will test all three sync versions and provide detailed analysis.');
  console.log('⚠️  Note: This will take several minutes and sync guides multiple times.');
}
