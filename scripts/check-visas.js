import { getVisasFromSupabase } from '../src/lib/syncNotionToSupabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkVisas() {
  console.log('Checking Visa Data in Supabase...');
  console.log('==================================');
  
  try {
    // Check English visas
    console.log('\n--- English Visas ---');
    const enVisas = await getVisasFromSupabase('en');
    console.log(`Found ${enVisas.length} English visas`);
    
    enVisas.forEach(visa => {
      console.log(`- ${visa.title} (slug: ${visa.slug}, is_popular: ${visa.is_popular})`);
    });
    
    // Check Spanish visas
    console.log('\n--- Spanish Visas ---');
    const esVisas = await getVisasFromSupabase('es');
    console.log(`Found ${esVisas.length} Spanish visas`);
    
    esVisas.forEach(visa => {
      console.log(`- ${visa.title} (slug: ${visa.slug}, is_popular: ${visa.is_popular})`);
    });
    
    // Check popular visas
    const allPopularVisas = [...enVisas, ...esVisas].filter(v => v.is_popular);
    console.log(`\n--- Popular Visas (${allPopularVisas.length}) ---`);
    allPopularVisas.forEach(visa => {
      console.log(`- ${visa.title} (${visa.lang})`);
    });
    
  } catch (error) {
    console.error('Error checking visas:', error);
  }
}

checkVisas(); 