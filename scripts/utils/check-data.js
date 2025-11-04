#!/usr/bin/env node

/**
 * Consolidated Data Check Script
 * Verifica datos en Supabase (visas, guides, estructura de BD)
 * Consolidado desde check-visas.js, check-guides-table.js, check-db-structure.js
 */

import 'dotenv/config';
import { supabase } from '../../src/lib/supabase.js';
import { getVisasFromSupabase } from '../../src/server/lib/syncNotionToSupabase.js';

async function checkVisas() {
  console.log('\n═══════════════════════════════════════════');
  console.log('📋 Checking Visa Data');
  console.log('═══════════════════════════════════════════\n');
  
  try {
    // Check English visas
    console.log('--- English Visas ---');
    const enVisas = await getVisasFromSupabase('en');
    console.log(`Found ${enVisas.length} English visas`);
    
    if (enVisas.length > 0) {
      enVisas.forEach(visa => {
        console.log(`- ${visa.title} (slug: ${visa.slug}, is_popular: ${visa.is_popular})`);
      });
    }
    
    // Check Spanish visas
    console.log('\n--- Spanish Visas ---');
    const esVisas = await getVisasFromSupabase('es');
    console.log(`Found ${esVisas.length} Spanish visas`);
    
    if (esVisas.length > 0) {
      esVisas.forEach(visa => {
        console.log(`- ${visa.title} (slug: ${visa.slug}, is_popular: ${visa.is_popular})`);
      });
    }
    
    // Check popular visas
    const allPopularVisas = [...enVisas, ...esVisas].filter(v => v.is_popular);
    console.log(`\n--- Popular Visas (${allPopularVisas.length}) ---`);
    allPopularVisas.forEach(visa => {
      console.log(`- ${visa.title} (${visa.lang})`);
    });
    
    return { success: true, enCount: enVisas.length, esCount: esVisas.length };
  } catch (error) {
    console.error('❌ Error checking visas:', error);
    return { success: false, error: error.message };
  }
}

async function checkGuidesTable() {
  console.log('\n═══════════════════════════════════════════');
  console.log('📚 Checking Guides Table');
  console.log('═══════════════════════════════════════════\n');
  
  try {
    // Check if guides table exists
    console.log('--- Testing Guides Table Connection ---');
    const { data: testData, error: testError } = await supabase
      .from('guides')
      .select('count')
      .limit(1);
    
    if (testError) {
      if (testError.code === '42P01') {
        console.log('❌ Guides table does not exist');
        console.log('Need to create the guides table first');
        return { success: false, error: 'Table does not exist' };
      } else {
        console.error('Connection error:', testError);
        return { success: false, error: testError.message };
      }
    }
    
    console.log('✅ Guides table exists and connection successful');
    
    // Get total count
    console.log('\n--- Total Count ---');
    const { count, error: countError } = await supabase
      .from('guides')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Count error:', countError);
      return { success: false, error: countError.message };
    } else {
      console.log(`Total guides in database: ${count}`);
    }
    
    // Get a few sample records
    console.log('\n--- Sample Records ---');
    const { data: samples, error: sampleError } = await supabase
      .from('guides')
      .select('*')
      .limit(5);
    
    if (sampleError) {
      console.error('Sample error:', sampleError);
      return { success: false, error: sampleError.message };
    } else if (samples && samples.length > 0) {
      console.log(`Found ${samples.length} sample records:`);
      samples.forEach((guide, index) => {
        console.log(`${index + 1}. ${guide.title} (${guide.lang}, published: ${guide.published})`);
      });
    } else {
      console.log('No sample records found');
    }
    
    // Check table structure
    console.log('\n--- Table Structure ---');
    const { data: structure, error: structureError } = await supabase
      .from('guides')
      .select('*')
      .limit(1);
    
    if (structureError) {
      console.error('Structure error:', structureError);
      return { success: false, error: structureError.message };
    } else if (structure && structure.length > 0) {
      const sample = structure[0];
      console.log('Available columns:');
      Object.keys(sample).forEach(key => {
        console.log(`- ${key}: ${typeof sample[key]} (${sample[key] ? 'has value' : 'null/empty'})`);
      });
    }
    
    return { success: true, count };
  } catch (error) {
    console.error('❌ Error checking guides table:', error);
    return { success: false, error: error.message };
  }
}

async function checkDbStructure() {
  console.log('\n═══════════════════════════════════════════');
  console.log('🗄️  Checking Database Structure');
  console.log('═══════════════════════════════════════════\n');
  
  try {
    // Check if we can connect to the database
    console.log('--- Testing Connection ---');
    const { data: testData, error: testError } = await supabase
      .from('visas')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Connection error:', testError);
      return { success: false, error: testError.message };
    }
    
    console.log('✅ Database connection successful');
    
    // Get total count
    console.log('\n--- Total Count ---');
    const { count, error: countError } = await supabase
      .from('visas')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Count error:', countError);
      return { success: false, error: countError.message };
    } else {
      console.log(`Total visas in database: ${count}`);
    }
    
    // Get a few sample records
    console.log('\n--- Sample Records ---');
    const { data: samples, error: sampleError } = await supabase
      .from('visas')
      .select('*')
      .limit(5);
    
    if (sampleError) {
      console.error('Sample error:', sampleError);
      return { success: false, error: sampleError.message };
    } else if (samples && samples.length > 0) {
      console.log(`Found ${samples.length} sample records:`);
      samples.forEach((visa, index) => {
        console.log(`${index + 1}. ${visa.title} (${visa.lang}, is_popular: ${visa.is_popular})`);
      });
      
      // Show structure of first record
      console.log('\n--- Table Structure (from sample) ---');
      const sample = samples[0];
      console.log('Available columns:');
      Object.keys(sample).forEach(key => {
        const value = sample[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        console.log(`- ${key}: ${type} (${value ? 'has value' : 'null/empty'})`);
      });
    } else {
      console.log('No sample records found');
    }
    
    return { success: true, count };
  } catch (error) {
    console.error('❌ Error checking database structure:', error);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🔍 Starting Data Checks...');
  console.log('═══════════════════════════════════════════');
  
  const results = {
    visas: await checkVisas(),
    guides: await checkGuidesTable(),
    structure: await checkDbStructure()
  };
  
  // Summary
  console.log('\n═══════════════════════════════════════════');
  console.log('📊 Check Summary');
  console.log('═══════════════════════════════════════════\n');
  
  console.log(`Visas: ${results.visas.success ? '✅ OK' : '❌ Failed'}`);
  if (results.visas.success) {
    console.log(`   - English: ${results.visas.enCount}`);
    console.log(`   - Spanish: ${results.visas.esCount}`);
  }
  
  console.log(`Guides: ${results.guides.success ? '✅ OK' : '❌ Failed'}`);
  if (results.guides.success && results.guides.count !== undefined) {
    console.log(`   - Total: ${results.guides.count}`);
  }
  
  console.log(`Database Structure: ${results.structure.success ? '✅ OK' : '❌ Failed'}`);
  if (results.structure.success && results.structure.count !== undefined) {
    console.log(`   - Total visas: ${results.structure.count}`);
  }
  
  const allSuccess = Object.values(results).every(r => r.success);
  
  if (allSuccess) {
    console.log('\n✅ All checks passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some checks failed. Review the logs above.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

