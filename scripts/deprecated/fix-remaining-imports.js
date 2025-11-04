#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files that need getAllMenuData import
const filesNeedingGetAllMenuData = [
  'src/pages/en/404.astro',
  'src/pages/en/about.astro',
  'src/pages/en/contact.astro',
  'src/pages/en/terms.astro',
  'src/pages/en/thank-you.astro',
  'src/pages/en/blog/index.astro',
  'src/pages/en/clkr/index.astro',
  'src/pages/en/guides/index.astro',
  'src/pages/en/real-estate/index.astro',
  'src/pages/en/real-estate/properties/[...slug].astro',
  'src/pages/en/visas/index.astro',
  'src/pages/es/404.astro',
  'src/pages/es/about.astro',
  'src/pages/es/contact.astro',
  'src/pages/es/terms.astro',
  'src/pages/es/thank-you.astro',
  'src/pages/es/blog/index.astro',
  'src/pages/es/clkr/index.astro',
  'src/pages/es/guides/index.astro',
  'src/pages/es/real-estate/index.astro',
  'src/pages/es/real-estate/properties/[...slug].astro',
  'src/pages/es/visas/index.astro',
  'src/pages/api/clkr-services.ts'
];

function addGetAllMenuDataImport(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if import already exists
      if (!content.includes('getAllMenuData')) {
        // Add import after the first import line
        const firstImportIndex = content.indexOf('import ');
        const firstImportEnd = content.indexOf('\n', firstImportIndex) + 1;
        
        if (firstImportIndex !== -1) {
          const importStatement = "import { getAllMenuData } from '../lib/menuData.ts';";
          if (filePath.includes('/es/')) {
            // Adjust path for Spanish pages
            const adjustedImport = importStatement.replace('../utils/', '../../utils/');
            content = content.slice(0, firstImportEnd) + adjustedImport + '\n' + content.slice(firstImportEnd);
          } else {
            content = content.slice(0, firstImportEnd) + importStatement + '\n' + content.slice(firstImportEnd);
          }
          
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Added getAllMenuData import to: ${filePath}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  }
}

console.log('🔧 Adding missing getAllMenuData imports...');
filesNeedingGetAllMenuData.forEach(addGetAllMenuDataImport);
console.log('✅ Import fixes complete!'); 