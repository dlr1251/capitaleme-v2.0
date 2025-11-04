#!/usr/bin/env node

/**
 * Consolidated Visa Sync Script
 * Combines functionality from sync-visas.js, sync-visas-optimized.js, and sync-visas-super-optimized.js
 * 
 * Usage:
 *   node scripts/sync/sync-visas.js              # Basic mode (uses syncVisasToSupabase)
 *   node scripts/sync/sync-visas.js --optimized  # Optimized mode (with timing)
 *   node scripts/sync/sync-visas.js --super      # Super optimized mode (batch processing)
 */

import 'dotenv/config';
import { syncVisasToSupabase } from '../../src/server/lib/syncNotionToSupabase.js';
import { Client } from '@notionhq/client';
import { supabase } from '../../src/lib/supabase.js';

// Configuration for super-optimized mode
const BATCH_SIZE = 5;
const CACHE_TOLERANCE = 60000; // 1 minute tolerance for timestamp changes

// Parse command line arguments
const args = process.argv.slice(2);
const mode = args.includes('--super') ? 'super' : args.includes('--optimized') ? 'optimized' : 'basic';

async function checkEnvironment() {
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
    if (mode !== 'super') {
      console.error('   Visa sync will use mock Supabase client');
    } else {
      process.exit(1);
    }
  }
}

// Super-optimized sync functions
async function fetchAllVisasFromNotion() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = process.env.NOTION_VISAS_DATABASE_ID;
  
  console.log('📥 Fetching visas from Notion...');
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 100
  });
  
  console.log(`✅ Found ${response.results.length} visas in Notion`);
  return response.results;
}

async function extractVisaDataOptimized(visa) {
  try {
    const properties = visa.properties;
    
    const title = properties.Name?.title?.[0]?.plain_text || properties.Title?.title?.[0]?.plain_text || 'Untitled';
    const slug = properties.slug?.rich_text?.[0]?.plain_text || properties.Slug?.rich_text?.[0]?.plain_text || title.toLowerCase().replace(/\s+/g, '-');
    const description = properties.Words?.rich_text?.[0]?.plain_text || properties.Description?.rich_text?.[0]?.plain_text || '';
    const category = properties.Tipo?.select?.name || properties.VisaType?.select?.name || 'visa';
    const country = properties.Countries?.select?.name || properties.Country?.select?.name || '';
    const isPopular = properties.Popular?.checkbox || false;
    const beneficiaries = properties.Beneficiaries?.select?.name || '';
    const workPermit = properties.WorkPermit?.select?.name || '';
    const processingTime = properties.ProcessingTime?.rich_text?.[0]?.plain_text || '';
    const requirements = properties.Requirements?.rich_text?.[0]?.plain_text || '';
    const emoji = properties.Emoji?.rich_text?.[0]?.plain_text || '📋';
    const alcance = properties.Alcance?.rich_text?.[0]?.plain_text || '';
    const duration = properties.Duration?.rich_text?.[0]?.plain_text || '';
    const lang = properties.Lang?.select?.name === 'En' ? 'en' : 'es';
    
    // For performance, skip content fetching in super-optimized mode
    const content = '';
    
    return {
      notion_id: visa.id,
      title,
      slug,
      description,
      content,
      category,
      country,
      countries: country ? [country] : [],
      isPopular,
      beneficiaries,
      workPermit,
      processingTime,
      requirements,
      emoji,
      alcance,
      duration,
      lang,
      last_edited: visa.last_edited_time
    };
  } catch (error) {
    console.error(`❌ Error extracting visa data for ${visa.id}:`, error);
    throw error;
  }
}

async function processVisaBatch(visas, notion) {
  const results = await Promise.allSettled(
    visas.map(async (visa) => {
      try {
        const visaData = await extractVisaDataOptimized(visa);
        
        // Check if visa already exists and needs update
        const { data: existingVisa } = await supabase
          .from('visas')
          .select('id, notion_id, last_edited')
          .eq('slug', visaData.slug)
          .eq('lang', visaData.lang)
          .single();
        
        if (existingVisa) {
          // Incremental sync: only update if changed
          const lastEdited = new Date(visa.last_edited_time);
          const existingEdited = new Date(existingVisa.last_edited);
          const timeDiff = Math.abs(lastEdited - existingEdited);
          
          if (timeDiff > CACHE_TOLERANCE || existingVisa.notion_id !== visa.id) {
            const { error } = await supabase
              .from('visas')
              .update({
                notion_id: visa.id,
                title: visaData.title,
                slug: visaData.slug,
                description: visaData.description,
                content: visaData.content,
                category: visaData.category,
                country: visaData.country,
                countries: visaData.countries,
                is_popular: visaData.isPopular,
                beneficiaries: visaData.beneficiaries,
                work_permit: visaData.workPermit,
                processing_time: visaData.processingTime,
                requirements: visaData.requirements,
                emoji: visaData.emoji,
                alcance: visaData.alcance,
                duration: visaData.duration,
                lang: visaData.lang,
                last_edited: visa.last_edited_time,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingVisa.id);
            
            if (error) throw error;
            return { type: 'updated', visa: visaData };
          }
          return { type: 'skipped', visa: visaData };
        } else {
          // Insert new visa
          const { error } = await supabase
            .from('visas')
            .insert({
              notion_id: visa.id,
              title: visaData.title,
              slug: visaData.slug,
              description: visaData.description,
              content: visaData.content,
              category: visaData.category,
              country: visaData.country,
              countries: visaData.countries,
              is_popular: visaData.isPopular,
              beneficiaries: visaData.beneficiaries,
              work_permit: visaData.workPermit,
              processing_time: visaData.processingTime,
              requirements: visaData.requirements,
              emoji: visaData.emoji,
              alcance: visaData.alcance,
              duration: visaData.duration,
              lang: visaData.lang,
              last_edited: visa.last_edited_time
            });
          
          if (error) throw error;
          return { type: 'inserted', visa: visaData };
        }
      } catch (error) {
        console.error(`❌ Error processing visa ${visa.id}:`, error);
        return { type: 'error', error, visa: { id: visa.id } };
      }
    })
  );
  
  return results;
}

async function syncVisasSuperOptimized() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const visas = await fetchAllVisasFromNotion();
  
  let syncedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  console.log(`🚀 Processing ${visas.length} visas in batches of ${BATCH_SIZE}...`);
  
  // Process visas in parallel batches
  for (let i = 0; i < visas.length; i += BATCH_SIZE) {
    const batch = visas.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(visas.length / BATCH_SIZE);
    
    console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} visas)...`);
    
    const results = await processVisaBatch(batch, notion);
    
    // Process results
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { type } = result.value;
        switch (type) {
          case 'inserted':
            syncedCount++;
            break;
          case 'updated':
            updatedCount++;
            break;
          case 'skipped':
            skippedCount++;
            break;
          case 'error':
            errorCount++;
            break;
        }
      } else {
        errorCount++;
        console.error('❌ Promise rejected:', result.reason);
      }
    });
    
    // Small delay to avoid overwhelming the API
    if (i + BATCH_SIZE < visas.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return {
    syncedCount,
    updatedCount,
    skippedCount,
    errorCount,
    totalProcessed: visas.length
  };
}

async function main() {
  await checkEnvironment();
  
  const modeLabels = {
    basic: '🔄 Starting visa sync',
    optimized: '🚀 Starting OPTIMIZED visa sync',
    super: '🚀 Starting SUPER OPTIMIZED visa sync'
  };
  
  console.log(`\n${modeLabels[mode]} from Notion to Supabase...`);
  
  if (mode === 'optimized' || mode === 'super') {
    console.log('\n⏱️  Starting sync...');
  }
  
  const startTime = Date.now();
  
  try {
    let result;
    
    if (mode === 'super') {
      result = await syncVisasSuperOptimized();
    } else {
      // Use the standard sync function for basic and optimized modes
      result = await syncVisasToSupabase();
    }
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    const successLabels = {
      basic: '✅ Visa sync completed successfully!',
      optimized: '✅ OPTIMIZED Visa sync completed successfully!',
      super: '✅ SUPER OPTIMIZED Visa sync completed successfully!'
    };
    
    console.log(`\n${successLabels[mode]}`);
    
    if (mode === 'optimized' || mode === 'super') {
      console.log(`⏱️  Total time: ${duration.toFixed(2)} seconds`);
    }
    
    console.log(`📊 Results:`);
    console.log(`   - New visas: ${result.syncedCount}`);
    console.log(`   - Updated: ${result.updatedCount || 0}`);
    
    if (mode === 'super' && result.skippedCount !== undefined) {
      console.log(`   - Skipped (unchanged): ${result.skippedCount}`);
    }
    
    console.log(`   - Errors: ${result.errorCount}`);
    
    if (mode === 'optimized' || mode === 'super') {
      const totalProcessed = result.totalProcessed || (result.syncedCount + (result.updatedCount || 0));
      if (totalProcessed > 0) {
        console.log(`   - Performance: ${(totalProcessed / duration).toFixed(2)} visas/second`);
      }
    }
    
    if (result.errorCount > 0) {
      console.log('\n⚠️  Some visas had errors during sync. Check the logs above for details.');
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Visa sync failed:`, error);
    process.exit(1);
  }
}

main().catch(console.error);

