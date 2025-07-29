import 'dotenv/config';
import { getVisasFromSupabase } from '../src/server/lib/syncNotionToSupabase.js';

async function debugVisaStructure() {
  console.log('🔍 Debugging Visa Data Structure...');
  console.log('=====================================');
  
  try {
    const visas = await getVisasFromSupabase('en');
    
    if (visas.length > 0) {
      const sampleVisa = visas[0];
      console.log('\n--- Sample Visa Structure ---');
      console.log('All fields:', Object.keys(sampleVisa));
      console.log('\nSample visa data:');
      console.log(JSON.stringify(sampleVisa, null, 2));
      
      console.log('\n--- Popular Visas Sample ---');
      const popularVisas = visas.filter(v => v.is_popular);
      if (popularVisas.length > 0) {
        const popularVisa = popularVisas[0];
        console.log('Popular visa fields:');
        console.log('- beneficiaries:', popularVisa.beneficiaries, typeof popularVisa.beneficiaries);
        console.log('- work_permit:', popularVisa.work_permit, typeof popularVisa.work_permit);
        console.log('- is_popular:', popularVisa.is_popular, typeof popularVisa.is_popular);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugVisaStructure(); 