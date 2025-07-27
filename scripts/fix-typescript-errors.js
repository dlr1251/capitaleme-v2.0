#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files that need specific fixes
const fileFixes = {
  'src/components/core/layout/Navbar.tsx': {
    removeLines: ['const getUrlForLang = (path: string, targetLang: string) => {', '  // Implementation', '};'],
    removeImports: ['getUrlForLang']
  },
  'src/components/core/layout/NavbarMobile.tsx': {
    removeVariables: ['realEstateArticles', 'mobileActiveSection', 'isLanguageChanging', 'setLang'],
    removeImports: ['realEstateArticles']
  },
  'src/components/core/layout/mega-menus/BlogMegaMenu.tsx': {
    removeVariables: ['scrollContainerRef', 'scrollLeft', 'setScrollLeft', 'startX', 'setStartX', 'isDragging', 'setIsDragging'],
    removeImports: ['useCallback', 'getPageTitle', 'getPageDescription', 'getPageSelectValue']
  },
  'src/components/core/layout/mega-menus/NewsMegaMenu.tsx': {
    removeVariables: ['handleTouchEnd', 'handleTouchMove', 'handleTouchStart', 'handleMouseLeave', 'handleMouseUp', 'handleMouseMove', 'handleMouseDown'],
    removeImports: ['getPageTitle', 'getPageDescription', 'getPageSelectValue']
  },
  'src/components/core/navigation/TableOfContents.astro': {
    removeVariables: ['title']
  },
  'src/components/es/blog/BlogCard.tsx': {
    removeVariables: ['icon', 'cover']
  },
  'src/components/es/blog/BlogExplorer.tsx': {
    removeVariables: ['index'],
    removeImports: ['React']
  },
  'src/components/es/blog/CoverImage.tsx': {
    removeImports: ['React']
  },
  'src/components/es/features/blog/BlogPageLatest.astro': {
    removeFunctions: ['getFeaturedImagePath', 'getImagePath']
  },
  'src/components/es/features/real-estate/CLKRRepository.tsx': {
    removeImports: ['FunnelIcon']
  },
  'src/components/es/features/visa-services/LatestBlogSection.tsx': {
    removeVariables: ['index']
  },
  'src/components/es/features/visa-services/ServiceProcess.tsx': {
    removeImports: ['QuestionMarkCircleIcon']
  },
  'src/components/es/features/visa-services/VisasSectionFilterSearch.tsx': {
    removeVariables: ['visas', 'lang', 'intro'],
    removeImports: ['normalizeYesNo', 'countries', 'Country', 'Fuse']
  }
};

class TypeScriptErrorFixer {
  constructor() {
    this.stats = {
      filesProcessed: 0,
      errorsFixed: 0
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

  // Remove unused variables
  removeUnusedVariables(content, variables) {
    let newContent = content;
    
    variables.forEach(variable => {
      // Remove variable declarations
      const varRegex = new RegExp(`\\b${variable}\\b\\s*=\\s*[^;]+;?\\s*`, 'g');
      newContent = newContent.replace(varRegex, '');
      
      // Remove from destructuring
      const destructuringRegex = new RegExp(`\\b${variable}\\b\\s*,?\\s*`, 'g');
      newContent = newContent.replace(destructuringRegex, '');
    });
    
    return newContent;
  }

  // Remove unused imports
  removeUnusedImports(content, imports) {
    let newContent = content;
    
    imports.forEach(importName => {
      // Remove from destructuring imports
      const importRegex = new RegExp(`import\\s*{[^}]*\\b${importName}\\b[^}]*}\\s*from\\s*['"][^'"]+['"];?\\s*`, 'g');
      newContent = newContent.replace(importRegex, (match) => {
        const withoutImport = match.replace(new RegExp(`\\b${importName}\\b\\s*,?\\s*`, 'g'), '');
        return withoutImport.includes('{') && withoutImport.match(/\{[^}]*\}/)[0].trim() === '{}' 
          ? '' 
          : withoutImport;
      });
      
      // Remove standalone imports
      const standaloneRegex = new RegExp(`import\\s+${importName}\\s+from\\s+['"][^'"]+['"];?\\s*`, 'g');
      newContent = newContent.replace(standaloneRegex, '');
    });
    
    return newContent;
  }

  // Remove unused functions
  removeUnusedFunctions(content, functions) {
    let newContent = content;
    
    functions.forEach(funcName => {
      const funcRegex = new RegExp(`function\\s+${funcName}\\s*\\([^)]*\\)\\s*{[^}]*}`, 'gs');
      newContent = newContent.replace(funcRegex, '');
    });
    
    return newContent;
  }

  // Remove specific lines
  removeSpecificLines(content, lines) {
    let newContent = content;
    
    lines.forEach(line => {
      const lineRegex = new RegExp(`.*${line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*\\n?`, 'g');
      newContent = newContent.replace(lineRegex, '');
    });
    
    return newContent;
  }

  // Process a single file
  processFile(filePath, fixes) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let newContent = content;
      
      if (fixes.removeVariables) {
        newContent = this.removeUnusedVariables(newContent, fixes.removeVariables);
      }
      
      if (fixes.removeImports) {
        newContent = this.removeUnusedImports(newContent, fixes.removeImports);
      }
      
      if (fixes.removeFunctions) {
        newContent = this.removeUnusedFunctions(newContent, fixes.removeFunctions);
      }
      
      if (fixes.removeLines) {
        newContent = this.removeSpecificLines(newContent, fixes.removeLines);
      }
      
      // Write back if content changed
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        this.log(`✓ Fixed: ${filePath}`, 'green');
        this.stats.errorsFixed++;
      }
      
      this.stats.filesProcessed++;
      
    } catch (error) {
      this.log(`✗ Error processing ${filePath}: ${error.message}`, 'red');
    }
  }

  // Print summary
  printSummary() {
    this.log('\n📊 TypeScript Error Fix Summary:', 'magenta');
    this.log('================================', 'magenta');
    this.log(`Files processed: ${this.stats.filesProcessed}`, 'blue');
    this.log(`Errors fixed: ${this.stats.errorsFixed}`, 'green');
  }

  // Run the fixer
  run() {
    this.log('🔧 Fixing TypeScript errors...', 'cyan');
    
    Object.entries(fileFixes).forEach(([filePath, fixes]) => {
      const fullPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(fullPath)) {
        this.processFile(fullPath, fixes);
      }
    });
    
    this.printSummary();
    this.log('\n✅ TypeScript error fixes complete!', 'green');
  }
}

// Run the fixer
const fixer = new TypeScriptErrorFixer();
fixer.run(); 