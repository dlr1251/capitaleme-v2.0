import { supabase } from '../src/lib/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkGuidesTable() {
  console.log('Checking Guides Table Structure...');
  console.log('==================================');
  
  try {
    // Check if guides table exists
    console.log('\n--- Testing Guides Table Connection ---');
    const { data: testData, error: testError } = await supabase
      .from('guides')
      .select('count')
      .limit(1);
    
    if (testError) {
      if (testError.code === '42P01') {
        console.log('❌ Guides table does not exist');
        console.log('Need to create the guides table first');
        return;
      } else {
        console.error('Connection error:', testError);
        return;
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
    } else if (structure && structure.length > 0) {
      const sample = structure[0];
      console.log('Available columns:');
      Object.keys(sample).forEach(key => {
        console.log(`- ${key}: ${typeof sample[key]} (${sample[key] ? 'has value' : 'null/empty'})`);
      });
    }
    
  } catch (error) {
    console.error('Error checking guides table:', error);
  }
}

checkGuidesTable();
