#!/usr/bin/env node

/**
 * Code Optimization Script
 * Optimiza código eliminando imports no utilizados
 * Renombrado desde optimize-performance.js
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
      console.log(`✅ Optimized: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let optimizedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      optimizedCount += walkDir(filePath);
    } else if (file.endsWith('.astro') || file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (removeUnusedImports(filePath)) {
        optimizedCount++;
      }
    }
  });
  
  return optimizedCount;
}

console.log('🚀 Starting performance optimization...');
const srcDir = path.join(__dirname, '../..', 'src');
const optimizedCount = walkDir(srcDir);
console.log(`✅ Performance optimization complete! Optimized ${optimizedCount} files.`);

