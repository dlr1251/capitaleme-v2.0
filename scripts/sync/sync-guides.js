#!/usr/bin/env node

/**
 * Consolidated Guides Sync Script
 * Combines functionality from sync-guides-only.js, sync-guides-optimized.js, 
 * sync-guides-super-optimized.js, and sync-guides-production.js
 * 
 * Usage:
 *   node scripts/sync/sync-guides.js              # Basic mode
 *   node scripts/sync/sync-guides.js --optimized # Optimized mode
 *   node scripts/sync/sync-guides.js --super     # Super optimized mode
 *   node scripts/sync/sync-guides.js --production # Production mode (with logging)
 */

import { 
  syncGuidesToSupabase, 
  syncGuidesToSupabaseOptimized, 
  syncGuidesToSupabaseSuperOptimized 
} from '../../src/server/lib/syncNotionToSupabase.js';
import fs from 'fs';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const mode = args.includes('--production') ? 'production' : 
             args.includes('--super') ? 'super' : 
             args.includes('--optimized') ? 'optimized' : 'basic';

class ProductionSyncManager {
  constructor() {
    this.startTime = Date.now();
    this.logFile = `sync-logs/sync-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
    this.ensureLogDirectory();
  }
  
  ensureLogDirectory() {
    const logDir = 'sync-logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }
  
  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type}] ${message}`;
    
    // Console output
    console.log(logMessage);
    
    // File logging
    try {
      fs.appendFileSync(this.logFile, logMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
  
  async runSync() {
    this.log('🚀 Starting PRODUCTION guides sync with maximum optimization', 'START');
    this.log('⚡ Features: Incremental sync, aggressive parallelization, smart caching, minimal API calls', 'INFO');
    
    const startMemory = process.memoryUsage();
    this.log(`📊 Initial memory usage: RSS: ${(startMemory.rss / 1024 / 1024).toFixed(2)} MB, Heap: ${(startMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`, 'INFO');
    
    try {
      // Run the super optimized sync
      const result = await syncGuidesToSupabaseSuperOptimized();
      
      const endTime = Date.now();
      const endMemory = process.memoryUsage();
      const duration = (endTime - this.startTime) / 1000;
      
      // Log results
      this.log('🏆 PRODUCTION SYNC COMPLETED SUCCESSFULLY!', 'SUCCESS');
      this.log(`📊 Results: ${JSON.stringify(result)}`, 'INFO');
      this.log(`⏱️  Total time: ${duration.toFixed(2)} seconds`, 'INFO');
      
      if (result.totalProcessed > 0) {
        this.log(`⚡ Average time per guide: ${(duration / result.totalProcessed).toFixed(3)} seconds`, 'INFO');
        this.log(`🚀 Throughput: ${(result.totalProcessed / duration).toFixed(2)} guides/second`, 'INFO');
      }
      
      if (result.skipped > 0) {
        this.log(`💾 Smart caching saved: ${result.skipped} unnecessary operations`, 'INFO');
      }
      
      // Memory analysis
      const memoryDiff = {
        rss: endMemory.rss - startMemory.rss,
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        heapTotal: endMemory.heapTotal - startMemory.heapTotal
      };
      
      this.log(`🧠 Memory performance: RSS change: ${(memoryDiff.rss / 1024 / 1024).toFixed(2)} MB`, 'INFO');
      
      // Performance rating
      let rating = '🥉';
      if (duration < 30) rating = '🥇';
      else if (duration < 60) rating = '🥈';
      
      this.log(`🏅 Performance Rating: ${rating}`, 'INFO');
      
      // Create sync summary
      await this.createSyncSummary(result, duration, memoryDiff);
      
      this.log('✅ Production sync completed successfully', 'SUCCESS');
      return { success: true, result, duration, memoryDiff };
      
    } catch (error) {
      const endTime = Date.now();
      const duration = (endTime - this.startTime) / 1000;
      
      this.log(`❌ Production sync failed after ${duration.toFixed(2)} seconds: ${error.message}`, 'ERROR');
      this.log(`Stack trace: ${error.stack}`, 'ERROR');
      
      // Create error summary
      await this.createErrorSummary(error, duration);
      
      return { success: false, error: error.message, duration };
    }
  }
  
  async createSyncSummary(result, duration, memoryDiff) {
    const summary = {
      timestamp: new Date().toISOString(),
      duration: duration,
      results: result,
      memory: memoryDiff,
      performance: {
        guidesPerSecond: result.totalProcessed / duration,
        averageTimePerGuide: duration / result.totalProcessed,
        memoryEfficiency: memoryDiff.rss / result.totalProcessed
      }
    };
    
    const summaryFile = `sync-logs/summary-${new Date().toISOString().split('T')[0]}.json`;
    
    try {
      // Read existing summary if it exists
      let existingSummaries = [];
      if (fs.existsSync(summaryFile)) {
        existingSummaries = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
      }
      
      // Add new summary
      existingSummaries.push(summary);
      
      // Keep only last 30 summaries
      if (existingSummaries.length > 30) {
        existingSummaries = existingSummaries.slice(-30);
      }
      
      // Write updated summary
      fs.writeFileSync(summaryFile, JSON.stringify(existingSummaries, null, 2));
      this.log(`📊 Sync summary saved to ${summaryFile}`, 'INFO');
      
    } catch (error) {
      this.log(`Failed to save sync summary: ${error.message}`, 'WARN');
    }
  }
  
  async createErrorSummary(error, duration) {
    const errorSummary = {
      timestamp: new Date().toISOString(),
      duration: duration,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    };
    
    const errorFile = `sync-logs/errors-${new Date().toISOString().split('T')[0]}.json`;
    
    try {
      // Read existing errors if file exists
      let existingErrors = [];
      if (fs.existsSync(errorFile)) {
        existingErrors = JSON.parse(fs.readFileSync(errorFile, 'utf8'));
      }
      
      // Add new error
      existingErrors.push(errorSummary);
      
      // Keep only last 50 errors
      if (existingErrors.length > 50) {
        existingErrors = existingErrors.slice(-50);
      }
      
      // Write updated errors
      fs.writeFileSync(errorFile, JSON.stringify(existingErrors, null, 2));
      this.log(`📊 Error summary saved to ${errorFile}`, 'INFO');
      
    } catch (writeError) {
      this.log(`Failed to save error summary: ${writeError.message}`, 'WARN');
    }
  }
}

async function main() {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();
  
  try {
    let result;
    let syncManager;
    
    if (mode === 'production') {
      syncManager = new ProductionSyncManager();
      const syncResult = await syncManager.runSync();
      
      if (!syncResult.success) {
        process.exit(1);
      }
      
      result = syncResult.result;
    } else {
      const modeLabels = {
        basic: 'Syncing guides from Notion to Supabase...',
        optimized: '🚀 Starting optimized guides sync...',
        super: '🚀 Starting SUPER OPTIMIZED guides sync with maximum performance...'
      };
      
      console.log(modeLabels[mode]);
      
      if (mode === 'super') {
        console.log('⚡ Features: Incremental sync, aggressive parallelization, smart caching, minimal API calls');
        console.log('📊 Initial memory usage:', {
          rss: `${(startMemory.rss / 1024 / 1024).toFixed(2)} MB`,
          heapUsed: `${(startMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
          heapTotal: `${(startMemory.heapTotal / 1024 / 1024).toFixed(2)} MB`
        });
      }
      
      if (mode === 'basic') {
        result = await syncGuidesToSupabase();
      } else if (mode === 'optimized') {
        result = await syncGuidesToSupabaseOptimized();
      } else {
        result = await syncGuidesToSupabaseSuperOptimized();
      }
      
      const endTime = Date.now();
      const endMemory = process.memoryUsage();
      const duration = (endTime - startTime) / 1000;
      
      console.log('✅ Guides sync completed successfully!');
      console.log('📊 Summary:', result);
      
      if (mode === 'optimized' || mode === 'super') {
        console.log(`⏱️  Total time: ${duration.toFixed(2)} seconds`);
        
        if (result.totalProcessed > 0) {
          console.log(`⚡ Average time per guide: ${(duration / result.totalProcessed).toFixed(2)} seconds`);
          console.log(`🚀 Throughput: ${(result.totalProcessed / duration).toFixed(2)} guides/second`);
        }
        
        if (mode === 'super' && result.skipped > 0) {
          console.log(`💾 Smart caching saved: ${result.skipped} unnecessary operations`);
          
          // Memory usage analysis
          const memoryDiff = {
            rss: endMemory.rss - startMemory.rss,
            heapUsed: endMemory.heapUsed - startMemory.heapUsed,
            heapTotal: endMemory.heapTotal - startMemory.heapTotal
          };
          
          console.log('\n🧠 Memory Performance:');
          console.log(`📈 RSS change: ${(memoryDiff.rss / 1024 / 1024).toFixed(2)} MB`);
          console.log(`📈 Heap used change: ${(memoryDiff.heapUsed / 1024 / 1024).toFixed(2)} MB`);
          
          // Performance rating
          let rating = '🥉';
          if (duration < 30) rating = '🥇';
          else if (duration < 60) rating = '🥈';
          
          console.log(`🏅 Performance Rating: ${rating}`);
        }
      }
    }
    
    process.exit(0);
  } catch (err) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.error('❌ Guides sync failed:', err);
    
    if (mode === 'optimized' || mode === 'super') {
      console.log(`⏱️  Failed after: ${duration.toFixed(2)} seconds`);
    }
    
    process.exit(1);
  }
}

main();

