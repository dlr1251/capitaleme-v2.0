import { supabase } from '../src/lib/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkDbStructure() {
  console.log('Checking Database Structure...');
  console.log('==============================');
  
  try {
    // Check if we can connect to the database
    console.log('\n--- Testing Connection ---');
    const { data: testData, error: testError } = await supabase
      .from('visas')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Connection error:', testError);
      return;
    }
    
    console.log('✅ Database connection successful');
    
    // Get total count
    console.log('\n--- Total Count ---');
    const { count, error: countError } = await supabase
      .from('visas')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Count error:', countError);
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
    } else if (samples && samples.length > 0) {
      console.log(`Found ${samples.length} sample records:`);
      samples.forEach((visa, index) => {
        console.log(`${index + 1}. ${visa.title} (${visa.lang}, is_popular: ${visa.is_popular})`);
      });
    } else {
      console.log('No sample records found');
    }
    
    // Check for popular visas specifically
    console.log('\n--- Popular Visas ---');
    const { data: popularVisas, error: popularError } = await supabase
      .from('visas')
      .select('*')
      .eq('is_popular', true);
    
    if (popularError) {
      console.error('Popular visas error:', popularError);
    } else if (popularVisas && popularVisas.length > 0) {
      console.log(`Found ${popularVisas.length} popular visas:`);
      popularVisas.forEach(visa => {
        console.log(`- ${visa.title} (${visa.lang})`);
      });
    } else {
      console.log('No popular visas found');
    }
    
  } catch (error) {
    console.error('Error checking database structure:', error);
  }
}

checkDbStructure(); 