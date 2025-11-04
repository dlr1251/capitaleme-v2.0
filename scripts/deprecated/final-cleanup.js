#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files that need getAllMenuData import
const filesNeedingGetAllMenuData = [
  'src/pages/api/clkr-services.ts',
  'src/pages/en/404.astro',
  'src/pages/en/terms.astro',
  'src/pages/en/thank-you.astro',
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
  'src/pages/es/visas/index.astro'
];

// Files that need to remove broken imports
const filesWithBrokenImports = [
  {
    file: 'src/pages/es/real-estate/index.astro',
    removeImports: [
      'ConsultationSection from "../../../components/es/features/visa-services/ConsultationSection.jsx"',
      'CLKRRepository from "../../../components/es/features/real-estate/CLKRRepository.jsx"',
      'Calculator from "../../../components/es/features/real-estate/Calculator.jsx"',
      'GoogleReviews from "../../../components/es/ui/cards/GoogleReviews.jsx"',
      'RealEstateGuide from "../../../components/es/real-estate/RealEstateGuide.jsx"',
      'SellerFeatures from "../../../components/es/features/real-estate/SellerFeatures.jsx"',
      'ServicesGrid from "../../../components/es/features/real-estate/ServicesGrid.jsx"'
    ]
  },
  {
    file: 'src/pages/es/real-estate/properties/[...slug].astro',
    removeImports: [
      'Calculator from "../../../../components/es/features/real-estate/Calculator.jsx"',
      'PropertyGallery from "../../../../components/es/features/real-estate/PropertyGallery.jsx"'
    ]
  },
  {
    file: 'src/pages/es/visas/index.astro',
    removeImports: [
      'VisasSectionFilterSearch from "../../../components/es/features/visa-services/VisasSectionFilterSearch.tsx"',
      'ConsultationSection from "../../../components/es/features/visa-services/ConsultationSection.jsx"',
      'ServiceProcess from "../../../components/es/features/visa-services/ServiceProcess.jsx"',
      'VisasHero from "../../../components/es/features/visa-services/VisasHero.jsx"'
    ]
  }
];

class FinalCleanup {
  constructor() {
    this.stats = {
      filesProcessed: 0,
      importsAdded: 0,
      importsRemoved: 0
    };
  }

  log(message, color = 'blue') {
    const colors = {
      red: '\x1b[31m',
      green: '\x1b[32m', 
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      reset: '\x1b[0m'
    };
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  // Add getAllMenuData import to files
  addGetAllMenuDataImport(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if import already exists
      if (content.includes('getAllMenuData')) {
        return;
      }

      // Determine the correct import path
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
        const newContent = content.slice(0, firstImportEnd) + importStatement + '\n' + content.slice(firstImportEnd);
        fs.writeFileSync(filePath, newContent);
        this.log(`✓ Added getAllMenuData import to: ${filePath}`, 'green');
        this.stats.importsAdded++;
      }
    } catch (error) {
      this.log(`✗ Error processing ${filePath}: ${error.message}`, 'red');
    }
  }

  // Remove broken imports
  removeBrokenImports(filePath, importsToRemove) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      importsToRemove.forEach(importToRemove => {
        const importRegex = new RegExp(`import\\s+${importToRemove};?\\s*`, 'g');
        if (importRegex.test(content)) {
          content = content.replace(importRegex, '');
          modified = true;
        }
      });

      if (modified) {
        fs.writeFileSync(filePath, content);
        this.log(`✓ Removed broken imports from: ${filePath}`, 'yellow');
        this.stats.importsRemoved++;
      }
    } catch (error) {
      this.log(`✗ Error processing ${filePath}: ${error.message}`, 'red');
    }
  }

  // Print summary
  printSummary() {
    this.log('\n📊 Final Cleanup Summary:', 'magenta');
    this.log('==========================', 'magenta');
    this.log(`Files processed: ${this.stats.filesProcessed}`, 'blue');
    this.log(`getAllMenuData imports added: ${this.stats.importsAdded}`, 'green');
    this.log(`Broken imports removed: ${this.stats.importsRemoved}`, 'yellow');
  }

  // Run the cleanup
  run() {
    this.log('🧹 Running final cleanup...', 'cyan');
    
    // Add getAllMenuData imports
    this.log('\n📥 Adding getAllMenuData imports...', 'yellow');
    filesNeedingGetAllMenuData.forEach(filePath => {
      const fullPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(fullPath)) {
        this.addGetAllMenuDataImport(fullPath);
        this.stats.filesProcessed++;
      }
    });

    // Remove broken imports
    this.log('\n🗑️  Removing broken imports...', 'yellow');
    filesWithBrokenImports.forEach(({ file, removeImports }) => {
      const fullPath = path.join(__dirname, '..', file);
      if (fs.existsSync(fullPath)) {
        this.removeBrokenImports(fullPath, removeImports);
        this.stats.filesProcessed++;
      }
    });

    this.printSummary();
    this.log('\n✅ Final cleanup complete!', 'green');
  }
}

// Run the cleanup
const cleanup = new FinalCleanup();
cleanup.run(); 