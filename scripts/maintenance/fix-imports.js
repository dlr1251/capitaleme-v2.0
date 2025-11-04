#!/usr/bin/env node

/**
 * Consolidated Fix Imports Script
 * Arregla imports faltantes y elimina imports no utilizados
 * Consolidado desde fix-imports.js, fix-remaining-imports.js, fix-all-imports.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common unused imports to remove
const unusedImports = [
  'TableOfContents',
  'getCLKRArticleFromSupabase',
  'CalendlyInline',
  'FloatingTeamAvatars',
  'AboutPageGallery',
  'AboutPageMission',
  'ContactPageCard',
  'HomeVisaAssistanceSection',
  'getAllVisasFromNotion',
  'getGuides',
  'getAllMenuData',
  'LatestBlogSection',
  'ViewTransitions'
];

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
  }
};

function removeUnusedImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove unused imports
    unusedImports.forEach(importName => {
      const importRegex = new RegExp(`import\\s+{[^}]*\\b${importName}\\b[^}]*}\\s+from\\s+['"][^'"]+['"];?\\s*`, 'g');
      const singleImportRegex = new RegExp(`import\\s+${importName}\\s+from\\s+['"][^'"]+['"];?\\s*`, 'g');
      
      if (importRegex.test(content) || singleImportRegex.test(content)) {
        content = content.replace(importRegex, '');
        content = content.replace(singleImportRegex, '');
        modified = true;
      }
    });

    // Clean up empty import statements
    content = content.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*/g, '');
    content = content.replace(/import\s*{\s*,\s*}\s*from\s*['"][^'"]+['"];?\s*/g, '');

    if (modified) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function addMissingImports(filePath, imports) {
  try {
    const fullPath = path.join(__dirname, '..', '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if imports already exist
    const hasAllImports = imports.every(imp => {
      const importName = imp.match(/import\s+{?\s*([^}]+)\s*}?\s+from/)?.[1]?.trim() || '';
      return content.includes(importName);
    });
    
    if (hasAllImports) {
      return false;
    }
    
    // Find the first import line
    const firstImportIndex = content.indexOf('import ');
    if (firstImportIndex === -1) {
      // No imports found, add at the top
      content = imports.join('\n') + '\n' + content;
    } else {
      // Add after the first import
      const firstImportEnd = content.indexOf('\n', firstImportIndex) + 1;
      content = content.slice(0, firstImportEnd) + imports.join('\n') + '\n' + content.slice(firstImportEnd);
    }
    
    fs.writeFileSync(fullPath, content);
    return true;
  } catch (error) {
    console.error(`❌ Error adding imports to ${filePath}:`, error.message);
    return false;
  }
}

function fixSpecificImports() {
  let fixed = 0;
  
  Object.entries(importFixes).forEach(([file, { add }]) => {
    if (addMissingImports(file, add)) {
      console.log(`✅ Fixed imports in: ${file}`);
      fixed++;
    }
  });
  
  return fixed;
}

function walkDir(dir, extensions = ['.astro', '.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const filePath = path.join(dir, item);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
      files.push(...walkDir(filePath, extensions));
    } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
      files.push(filePath);
    }
  }
  
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  const removeUnused = args.includes('--remove-unused') || args.includes('--all');
  const addMissing = args.includes('--add-missing') || args.includes('--all');
  
  console.log('🔧 Starting import fixes...\n');
  
  let stats = {
    unusedRemoved: 0,
    missingAdded: 0,
    specificFixed: 0
  };
  
  // Fix specific imports
  if (addMissing) {
    console.log('📝 Fixing specific imports...');
    stats.specificFixed = fixSpecificImports();
    
    // Add missing getAllMenuData imports
    console.log('\n📝 Adding missing getAllMenuData imports...');
    filesNeedingImports.forEach(({ file, imports }) => {
      if (addMissingImports(file, imports)) {
        console.log(`✅ Added imports to: ${file}`);
        stats.missingAdded++;
      }
    });
  }
  
  // Remove unused imports
  if (removeUnused) {
    console.log('\n🧹 Removing unused imports...');
    const srcDir = path.join(__dirname, '..', '..', 'src');
    const files = walkDir(srcDir);
    
    files.forEach(file => {
      if (removeUnusedImports(file)) {
        console.log(`✅ Optimized: ${path.relative(srcDir, file)}`);
        stats.unusedRemoved++;
      }
    });
  }
  
  // Summary
  console.log('\n═══════════════════════════════════════════');
  console.log('📊 Fix Summary');
  console.log('═══════════════════════════════════════════\n');
  console.log(`Specific imports fixed: ${stats.specificFixed}`);
  console.log(`Missing imports added: ${stats.missingAdded}`);
  console.log(`Unused imports removed: ${stats.unusedRemoved}`);
  console.log('\n✅ Import fixes complete!');
  
  console.log('\n💡 Usage:');
  console.log('   --add-missing    Add missing imports');
  console.log('   --remove-unused  Remove unused imports');
  console.log('   --all            Do both (default if no flags)');
}

main().catch(console.error);

