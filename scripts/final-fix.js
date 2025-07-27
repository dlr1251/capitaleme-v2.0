#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files that need getAllMenuData import
const filesToFix = [
  'src/pages/en/contact.astro',
  'src/pages/en/terms.astro',
  'src/pages/en/thank-you.astro',
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

function fixFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if getAllMenuData import already exists
      if (!content.includes('getAllMenuData')) {
        // Determine the correct import path based on file location
        let importPath = '';
        if (filePath.includes('/api/')) {
          importPath = '../../utils/menuDataOptimized.js';
        } else if (filePath.includes('/en/real-estate/properties/') || filePath.includes('/es/real-estate/properties/')) {
          importPath = '../../../../utils/menuDataOptimized.js';
        } else if (filePath.includes('/en/guides/') || filePath.includes('/es/guides/') || filePath.includes('/en/real-estate/') || filePath.includes('/es/real-estate/') || filePath.includes('/en/visas/') || filePath.includes('/es/visas/') || filePath.includes('/en/blog/') || filePath.includes('/es/blog/')) {
          importPath = '../../../utils/menuDataOptimized.js';
        } else {
          importPath = '../../utils/menuDataOptimized.js';
        }
        
        const importStatement = `import { getAllMenuData } from '${importPath}';`;
        
        // Add import after the first import line
        const firstImportIndex = content.indexOf('import ');
        const firstImportEnd = content.indexOf('\n', firstImportIndex) + 1;
        
        if (firstImportIndex !== -1) {
          content = content.slice(0, firstImportEnd) + importStatement + '\n' + content.slice(firstImportEnd);
          
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Fixed: ${filePath}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  }
}

console.log('🔧 Final import fixes...');
filesToFix.forEach(fixFile);
console.log('✅ Final fixes complete!'); 