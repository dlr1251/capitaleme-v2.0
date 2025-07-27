import dotenv from 'dotenv';
import { getVisasFromSupabase } from '../src/lib/syncNotionToSupabase.js';

// Load environment variables
dotenv.config();

async function testVisas() {
  console.log('Testing visa data fetching...');
  
  try {
    // Test English visas
    console.log('\n--- Testing English visas ---');
    const enVisas = await getVisasFromSupabase('en');
    console.log(`Found ${enVisas.length} English visas`);
    if (enVisas.length > 0) {
      console.log('First visa:', {
        title: enVisas[0].title,
        slug: enVisas[0].slug,
        lang: enVisas[0].lang,
        content: enVisas[0].content ? `Has content (${enVisas[0].content.length} chars)` : 'No content',
        description: enVisas[0].description || 'No description'
      });
      
      // Check how many visas have content
      const visasWithContent = enVisas.filter(v => v.content && v.content.trim().length > 0);
      console.log(`Visas with content: ${visasWithContent.length}/${enVisas.length}`);
    }
    
    // Test Spanish visas
    console.log('\n--- Testing Spanish visas ---');
    const esVisas = await getVisasFromSupabase('es');
    console.log(`Found ${esVisas.length} Spanish visas`);
    if (esVisas.length > 0) {
      console.log('First visa:', {
        title: esVisas[0].title,
        slug: esVisas[0].slug,
        lang: esVisas[0].lang,
        content: esVisas[0].content ? `Has content (${esVisas[0].content.length} chars)` : 'No content',
        description: esVisas[0].description || 'No description'
      });
      
      // Check how many visas have content
      const visasWithContent = esVisas.filter(v => v.content && v.content.trim().length > 0);
      console.log(`Visas with content: ${visasWithContent.length}/${esVisas.length}`);
    }
    
    // Test specific visa by slug
    if (enVisas.length > 0) {
      console.log('\n--- Testing specific visa by slug ---');
      const { getVisaBySlugFromSupabase } = await import('../src/lib/syncNotionToSupabase.js');
      const specificVisa = await getVisaBySlugFromSupabase(enVisas[0].slug, 'en');
      console.log('Specific visa found:', specificVisa ? 'Yes' : 'No');
      if (specificVisa) {
        console.log('Visa details:', {
          title: specificVisa.title,
          slug: specificVisa.slug,
          content: specificVisa.content ? `${specificVisa.content.substring(0, 100)}...` : 'No content',
          contentLength: specificVisa.content ? specificVisa.content.length : 0
        });
      }
    }
    
  } catch (error) {
    console.error('Error testing visas:', error);
  }
}

testVisas(); 