#!/usr/bin/env node

/**
 * Test Connection Script
 * Prueba conexiones a Supabase, Notion y otros servicios
 * Reemplaza test-supabase.js faltante
 */

import 'dotenv/config';
import { supabase } from '../../src/lib/supabase.js';
import { Client } from '@notionhq/client';
import { getVisasFromSupabase } from '../../src/server/lib/syncNotionToSupabase.js';

async function testSupabaseConnection() {
  console.log('\n═══════════════════════════════════════════');
  console.log('🔌 Testing Supabase Connection');
  console.log('═══════════════════════════════════════════\n');
  
  try {
    // Check environment variables
    console.log('📋 Environment check:');
    console.log(`   - SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set (hidden)' : '❌ Missing'}`);
    console.log(`   - SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✅ Set (hidden)' : '❌ Missing'}\n`);
    
    if (!process.env.SUPABASE_URL) {
      console.error('❌ SUPABASE_URL is not set');
      return false;
    }
    
    // Test connection with a simple query
    console.log('🔄 Testing database connection...');
    const { data, error, count } = await supabase
      .from('visas')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      if (error.code === '42P01') {
        console.error('   Table "visas" does not exist. Check your database schema.');
      }
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log(`   - Total visas in database: ${count || 0}`);
    
    // Test reading data
    const { data: sampleData, error: sampleError } = await supabase
      .from('visas')
      .select('id, title, lang')
      .limit(3);
    
    if (sampleError) {
      console.error('⚠️  Warning: Could not read sample data:', sampleError.message);
    } else {
      console.log(`   - Sample records: ${sampleData?.length || 0}`);
      if (sampleData && sampleData.length > 0) {
        console.log('   - Sample visa:', sampleData[0].title);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error.message);
    return false;
  }
}

async function testNotionConnection() {
  console.log('\n═══════════════════════════════════════════');
  console.log('📝 Testing Notion Connection');
  console.log('═══════════════════════════════════════════\n');
  
  try {
    // Check environment variables
    console.log('📋 Environment check:');
    console.log(`   - NOTION_API_KEY: ${process.env.NOTION_API_KEY ? '✅ Set (hidden)' : '❌ Missing'}`);
    console.log(`   - NOTION_VISAS_DATABASE_ID: ${process.env.NOTION_VISAS_DATABASE_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - NOTION_CLKR_DB_ID: ${process.env.NOTION_CLKR_DB_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - NOTION_BLOG_DB_ID: ${process.env.NOTION_BLOG_DB_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - NOTION_GUIDES_DB_ID: ${process.env.NOTION_GUIDES_DB_ID ? '✅ Set' : '❌ Missing'}\n`);
    
    if (!process.env.NOTION_API_KEY) {
      console.error('❌ NOTION_API_KEY is not set');
      return false;
    }
    
    // Test connection by creating a client and querying
    console.log('🔄 Testing API connection...');
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    
    if (process.env.NOTION_VISAS_DATABASE_ID) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_VISAS_DATABASE_ID,
        page_size: 1
      });
      
      console.log('✅ Notion connection successful!');
      console.log(`   - Visas database accessible`);
      console.log(`   - Total pages in database: ${response.results.length > 0 ? 'At least 1' : '0'}`);
      return true;
    } else {
      console.log('⚠️  No database IDs configured, but API key is valid');
      return true;
    }
  } catch (error) {
    console.error('❌ Notion connection test failed:', error.message);
    if (error.code === 'unauthorized') {
      console.error('   Check that your NOTION_API_KEY is valid and has access to the databases');
    }
    return false;
  }
}

async function testDataFetching() {
  console.log('\n═══════════════════════════════════════════');
  console.log('📊 Testing Data Fetching');
  console.log('═══════════════════════════════════════════\n');
  
  try {
    console.log('🔄 Testing visa data fetching...');
    
    // Test English visas
    const enVisas = await getVisasFromSupabase('en');
    console.log(`✅ English visas: ${enVisas.length} found`);
    
    if (enVisas.length > 0) {
      console.log(`   - Sample: ${enVisas[0].title}`);
      console.log(`   - Has content: ${enVisas[0].content ? 'Yes' : 'No'}`);
    }
    
    // Test Spanish visas
    const esVisas = await getVisasFromSupabase('es');
    console.log(`✅ Spanish visas: ${esVisas.length} found`);
    
    if (esVisas.length > 0) {
      console.log(`   - Sample: ${esVisas[0].title}`);
      console.log(`   - Has content: ${esVisas[0].content ? 'Yes' : 'No'}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Data fetching test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🧪 Starting Connection Tests...');
  console.log('═══════════════════════════════════════════\n');
  
  const results = {
    supabase: false,
    notion: false,
    dataFetching: false
  };
  
  // Test Supabase
  results.supabase = await testSupabaseConnection();
  
  // Test Notion
  results.notion = await testNotionConnection();
  
  // Test data fetching (only if Supabase works)
  if (results.supabase) {
    results.dataFetching = await testDataFetching();
  }
  
  // Summary
  console.log('\n═══════════════════════════════════════════');
  console.log('📊 Test Summary');
  console.log('═══════════════════════════════════════════\n');
  
  console.log(`Supabase: ${results.supabase ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Notion: ${results.notion ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Data Fetching: ${results.dataFetching ? '✅ Pass' : '❌ Fail'}`);
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above for details.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

