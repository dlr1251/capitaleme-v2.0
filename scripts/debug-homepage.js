import 'dotenv/config';
import { getAllContentData } from '../src/lib/contentData.js';

async function debugHomepage() {
  console.log('🔍 Debugging Homepage Data...');
  console.log('==================================');
  
  try {
    const lang = 'en';
    const menuData = await getAllContentData(lang);
    
    console.log('\n--- Menu Data Structure ---');
    console.log('menuData keys:', Object.keys(menuData || {}));
    
    const allVisas = menuData?.allVisas || [];
    console.log(`\n--- All Visas (${allVisas.length}) ---`);
    console.log('First 3 visas:');
    allVisas.slice(0, 3).forEach((visa, index) => {
      console.log(`${index + 1}. ${visa.title} (isPopular: ${visa.isPopular})`);
    });
    
    const popularVisas = allVisas.filter(v => v.isPopular);
    console.log(`\n--- Popular Visas (${popularVisas.length}) ---`);
    popularVisas.forEach((visa, index) => {
      console.log(`${index + 1}. ${visa.title} (isPopular: ${visa.isPopular})`);
    });
    
    const guides = menuData?.allGuides || [];
    console.log(`\n--- All Guides (${guides.length}) ---`);
    console.log('First 3 guides:');
    guides.slice(0, 3).forEach((guide, index) => {
      console.log(`${index + 1}. ${guide.title} (isFeatured: ${guide.isFeatured})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugHomepage(); 