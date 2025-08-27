import { syncGuidesToSupabaseSuperOptimized } from '../src/server/lib/syncNotionToSupabase.js';
import fs from 'fs';
import path from 'path';

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
  const syncManager = new ProductionSyncManager();
  
  try {
    const result = await syncManager.runSync();
    
    if (result.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error in production sync:', error);
    process.exit(1);
  }
}

// Run production sync
main();
