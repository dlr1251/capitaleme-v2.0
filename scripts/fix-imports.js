#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files that need specific imports added back
const importFixes = {
  'src/layouts/GuidesLayout.astro': {
    add: [
      "import TableOfContents from '../components/core/navigation/TableOfContents.astro';",
      "import { getAllMenuData } from '../lib/menuData.ts';"
    ]
  },
  'src/layouts/VisasLayout.astro': {
    add: [
      "import TableOfContents from '../components/core/navigation/TableOfContents.astro';",
      "import { getAllMenuData } from '../lib/menuData.ts';"
    ]
  },
  'src/layouts/BlogPostLayoutNew.astro': {
    add: [
      "import TableOfContents from '../components/core/navigation/TableOfContents.astro';",
      "import { getAllMenuData } from '../lib/menuData.ts';"
    ]
  },
  'src/pages/es/index.astro': {
    add: [
      "import HomeVisaAssistanceSection from '../../components/pages/home/HomeVisaAssistanceSection.tsx';",
      "import { getAllMenuData, getGuides, getAllVisasFromNotion } from '../lib/menuData.ts';"
    ]
  },
  'src/pages/en/visas/index.astro': {
    add: [
      "import { getGuides } from '../lib/menuData.ts';"
    ]
  },
  'src/pages/es/visas/index.astro': {
    add: [
      "import { getGuides, getAllVisasFromNotion } from '../lib/menuData.ts';"
    ]
  }
};

function fixImports() {
  Object.entries(importFixes).forEach(([filePath, fixes]) => {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (fs.existsSync(fullPath)) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Add imports after the first import line
        const importLines = fixes.add.join('\n');
        const firstImportIndex = content.indexOf('import ');
        const firstImportEnd = content.indexOf('\n', firstImportIndex) + 1;
        
        if (firstImportIndex !== -1) {
          content = content.slice(0, firstImportEnd) + importLines + '\n' + content.slice(firstImportEnd);
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Fixed imports in: ${filePath}`);
        }
      } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
      }
    }
  });
}

console.log('🔧 Fixing missing imports...');
fixImports();
console.log('✅ Import fixes complete!'); 