import { getAllContentData } from '../src/server/lib/contentData.js';
import dotenv from 'dotenv';

dotenv.config();

async function testContentData() {
  console.log('Testing Content Data from Notion...');
  console.log('==================================');
  
  try {
    // Test English content
    console.log('\n--- English Content ---');
    const enData = await getAllContentData('en');
    console.log(`Found ${enData.allVisas.length} English visas`);
    console.log(`Found ${enData.allGuides.length} English guides`);
    
    if (enData.allVisas.length > 0) {
      console.log('\nPopular visas:');
      enData.popularVisas.forEach(visa => {
        console.log(`- ${visa.title} (isPopular: ${visa.isPopular})`);
      });
    }
    
    // Test Spanish content
    console.log('\n--- Spanish Content ---');
    const esData = await getAllContentData('es');
    console.log(`Found ${esData.allVisas.length} Spanish visas`);
    console.log(`Found ${esData.allGuides.length} Spanish guides`);
    
    if (esData.allVisas.length > 0) {
      console.log('\nPopular visas:');
      esData.popularVisas.forEach(visa => {
        console.log(`- ${visa.title} (isPopular: ${visa.isPopular})`);
      });
    }
    
  } catch (error) {
    console.error('Error testing content data:', error);
  }
}

testContentData(); 