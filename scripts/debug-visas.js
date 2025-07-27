import { supabase } from '../src/lib/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function debugVisas() {
  console.log('Debugging Visa Data in Supabase...');
  console.log('==================================');
  
  // Check environment variables
  console.log('Environment check:');
  console.log(`- SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`- SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`);
  
  try {
    // Check all visas without language filter
    console.log('\n--- All Visas in Database ---');
    const { data: allVisas, error } = await supabase
      .from('visas')
      .select('*');
    
    if (error) {
      console.error('Error fetching visas:', error);
      return;
    }
    
    console.log(`Found ${allVisas?.length || 0} total visas`);
    
    if (allVisas && allVisas.length > 0) {
      console.log('\nSample visa:');
      console.log(JSON.stringify(allVisas[0], null, 2));
      
      // Check by language
      const enVisas = allVisas.filter(v => v.lang === 'en');
      const esVisas = allVisas.filter(v => v.lang === 'es');
      const popularVisas = allVisas.filter(v => v.is_popular);
      
      console.log(`\n--- Breakdown ---`);
      console.log(`English visas: ${enVisas.length}`);
      console.log(`Spanish visas: ${esVisas.length}`);
      console.log(`Popular visas: ${popularVisas.length}`);
      
      if (popularVisas.length > 0) {
        console.log('\nPopular visas:');
        popularVisas.forEach(v => {
          console.log(`- ${v.title} (${v.lang}, is_popular: ${v.is_popular})`);
        });
      }
    } else {
      console.log('No visas found in database');
    }
    
  } catch (error) {
    console.error('Error debugging visas:', error);
  }
}

debugVisas(); 