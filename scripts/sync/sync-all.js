#!/usr/bin/env node

/**
 * Unified Sync Script
 * Sincroniza múltiples tipos de contenido desde Notion a Supabase
 * 
 * Usage:
 *   node scripts/sync/sync-all.js              # Sync all content types
 *   node scripts/sync/sync-all.js --visas     # Sync only visas
 *   node scripts/sync/sync-all.js --clkr       # Sync only CLKR
 *   node scripts/sync/sync-all.js --guides    # Sync only guides
 *   node scripts/sync/sync-all.js --blog       # Sync only blog
 *   node scripts/sync/sync-all.js --visas --guides  # Sync multiple types
 */

import { 
  syncBlogToSupabase, 
  syncGuidesToSupabase 
} from '../../src/server/lib/syncNotionToSupabase.js';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const syncAll = !args.includes('--visas') && !args.includes('--clkr') && 
                !args.includes('--guides') && !args.includes('--blog');

const syncVisas = syncAll || args.includes('--visas');
const syncClkr = syncAll || args.includes('--clkr');
const syncGuides = syncAll || args.includes('--guides');
const syncBlog = syncAll || args.includes('--blog');

async function runSyncScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);
    const child = spawn('node', [scriptPath, ...args], {
      stdio: 'inherit',
      shell: false
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptName} exited with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function syncBlogGuides() {
  try {
    console.log('📝 Syncing blog posts from Notion to Supabase...');
    await syncBlogToSupabase();
    console.log('✅ Blog posts synced.');
    
    console.log('📚 Syncing guides from Notion to Supabase...');
    await syncGuidesToSupabase();
    console.log('✅ Guides synced.');
  } catch (err) {
    console.error('❌ Sync failed:', err);
    throw err;
  }
}

async function main() {
  console.log('🚀 Starting unified sync from Notion to Supabase...\n');
  
  const results = {
    visas: { success: false, error: null },
    clkr: { success: false, error: null },
    guides: { success: false, error: null },
    blog: { success: false, error: null }
  };
  
  try {
    // Sync visas
    if (syncVisas) {
      console.log('═══════════════════════════════════════════');
      console.log('📋 SYNCING VISAS');
      console.log('═══════════════════════════════════════════\n');
      try {
        await runSyncScript('sync-visas.js');
        results.visas.success = true;
      } catch (error) {
        results.visas.error = error.message;
        console.error('❌ Visa sync failed:', error.message);
      }
      console.log('\n');
    }
    
    // Sync CLKR
    if (syncClkr) {
      console.log('═══════════════════════════════════════════');
      console.log('📚 SYNCING CLKR');
      console.log('═══════════════════════════════════════════\n');
      try {
        await runSyncScript('sync-clkr.js');
        results.clkr.success = true;
      } catch (error) {
        results.clkr.error = error.message;
        console.error('❌ CLKR sync failed:', error.message);
      }
      console.log('\n');
    }
    
    // Sync guides
    if (syncGuides) {
      console.log('═══════════════════════════════════════════');
      console.log('📖 SYNCING GUIDES');
      console.log('═══════════════════════════════════════════\n');
      try {
        await runSyncScript('sync-guides.js');
        results.guides.success = true;
      } catch (error) {
        results.guides.error = error.message;
        console.error('❌ Guides sync failed:', error.message);
      }
      console.log('\n');
    }
    
    // Sync blog
    if (syncBlog) {
      console.log('═══════════════════════════════════════════');
      console.log('📝 SYNCING BLOG');
      console.log('═══════════════════════════════════════════\n');
      try {
        await syncBlogGuides();
        results.blog.success = true;
      } catch (error) {
        results.blog.error = error.message;
        console.error('❌ Blog sync failed:', error.message);
      }
      console.log('\n');
    }
    
    // Summary
    console.log('═══════════════════════════════════════════');
    console.log('📊 SYNC SUMMARY');
    console.log('═══════════════════════════════════════════\n');
    
    const allSuccess = Object.values(results).every(r => !r.error || r.success);
    const hasErrors = Object.values(results).some(r => r.error);
    
    if (syncVisas) {
      console.log(`Visas: ${results.visas.success ? '✅ Success' : '❌ Failed'}`);
      if (results.visas.error) console.log(`   Error: ${results.visas.error}`);
    }
    
    if (syncClkr) {
      console.log(`CLKR: ${results.clkr.success ? '✅ Success' : '❌ Failed'}`);
      if (results.clkr.error) console.log(`   Error: ${results.clkr.error}`);
    }
    
    if (syncGuides) {
      console.log(`Guides: ${results.guides.success ? '✅ Success' : '❌ Failed'}`);
      if (results.guides.error) console.log(`   Error: ${results.guides.error}`);
    }
    
    if (syncBlog) {
      console.log(`Blog: ${results.blog.success ? '✅ Success' : '❌ Failed'}`);
      if (results.blog.error) console.log(`   Error: ${results.blog.error}`);
    }
    
    console.log('\n');
    
    if (hasErrors) {
      console.log('⚠️  Some syncs failed. Check the logs above for details.');
      process.exit(1);
    } else {
      console.log('✅ All syncs completed successfully!');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Fatal error during sync:', error);
    process.exit(1);
  }
}

main();

