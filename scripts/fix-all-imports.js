#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files that need getAllMenuData import with their correct paths
const filesNeedingImports = [
  {
    file: 'src/pages/en/blog/index.astro',
    imports: ["import { getAllMenuData } from '../../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/en/about.astro',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/en/contact.astro',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/en/terms.astro',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/en/thank-you.astro',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/en/clkr/index.astro',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/en/guides/index.astro',
    imports: ["import { getAllMenuData } from '../../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/en/real-estate/index.astro',
    imports: ["import { getAllMenuData } from '../../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/en/real-estate/properties/[...slug].astro',
    imports: ["import { getAllMenuData } from '../../../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/en/visas/index.astro',
    imports: ["import { getAllMenuData } from '../../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/es/404.astro',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/es/about.astro',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/es/contact.astro',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/es/terms.astro',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/es/thank-you.astro',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/es/blog/index.astro',
    imports: ["import { getAllMenuData } from '../../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/es/clkr/index.astro',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/es/guides/index.astro',
    imports: ["import { getAllMenuData } from '../../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/es/real-estate/index.astro',
    imports: ["import { getAllMenuData } from '../../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/es/real-estate/properties/[...slug].astro',
    imports: ["import { getAllMenuData } from '../../../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/es/visas/index.astro',
    imports: ["import { getAllMenuData } from '../../../utils/menuDataOptimized.js';"]
  },
  {
    file: 'src/pages/api/clkr-services.ts',
    imports: ["import { getAllMenuData } from '../../utils/menuDataOptimized.js';"]
  }
];

function addImports(filePath, imports) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if getAllMenuData import already exists
      if (!content.includes('getAllMenuData')) {
        // Add imports after the first import line
        const firstImportIndex = content.indexOf('import ');
        const firstImportEnd = content.indexOf('\n', firstImportIndex) + 1;
        
        if (firstImportIndex !== -1) {
          const importLines = imports.join('\n');
          content = content.slice(0, firstImportEnd) + importLines + '\n' + content.slice(firstImportEnd);
          
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Added imports to: ${filePath}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  }
}

console.log('🔧 Adding all missing imports...');
filesNeedingImports.forEach(({ file, imports }) => {
  addImports(file, imports);
});
console.log('✅ All import fixes complete!'); 