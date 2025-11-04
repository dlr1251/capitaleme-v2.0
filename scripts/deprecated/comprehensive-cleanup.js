#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  srcDir: path.join(__dirname, '../src'),
  extensions: ['.jsx', '.tsx', '.js', '.ts', '.astro'],
  ignoreDirs: ['node_modules', 'dist', '.astro'],
  
  // Patterns to remove
  patterns: {
    unusedReactImports: /^import React from ['"]react['"];?\s*$/gm,
    unusedReactImportsInDestructuring: /import\s*{\s*[^}]*React[^}]*}\s*from\s*['"]react['"];?\s*$/gm,
    consoleLogs: /console\.(log|warn|error|info)\([^)]*\);?\s*$/gm,
    todoComments: /\/\/\s*TODO:.*$/gm,
    fixmeComments: /\/\/\s*FIXME:.*$/gm,
    unusedVariableComments: /\/\/\s*UNUSED.*$/gm,
    commentedOutCode: /\/\/\s*.*=.*;?\s*\/\/\s*UNUSED.*$/gm
  },
  
  // Files to completely remove
  filesToRemove: [
    'debug-notion-images.js',
    'src/components/pages/home/HomePageVisas.tsx', // Legacy file
    'src/components/es/features/visa-services/VisasSectionFilterSearch.tsx', // Unused
    'src/components/es/features/visa-services/LatestBlogSection.tsx', // Unused
    'src/components/es/features/visa-services/ServiceProcess.tsx', // Unused
    'src/components/es/features/visa-services/VisasHero.tsx', // Unused
    'src/components/es/features/visa-services/ConsultationSection.tsx', // Unused
    'src/components/es/features/real-estate/RealEstateGuide.tsx', // Unused
    'src/components/es/features/real-estate/CLKRRepository.tsx', // Unused
    'src/components/es/features/real-estate/Calculator.tsx', // Unused
    'src/components/es/features/real-estate/PropertyGallery.tsx', // Unused
    'src/components/es/features/real-estate/ServicesGrid.tsx', // Unused
    'src/components/es/features/real-estate/SellerFeatures.tsx', // Unused
    'src/components/es/ui/cards/GoogleReviews.tsx', // Unused
    'src/components/es/blog/BlogCard.tsx', // Unused
    'src/components/es/blog/BlogExplorer.tsx', // Unused
    'src/components/es/blog/CoverImage.tsx', // Unused
    'src/components/es/blog/BlogPostsList.tsx', // Unused
    'src/components/es/blog/LatestFromBlog.astro', // Unused
    'src/components/es/blog/BlogPageLatest.astro', // Unused
    'src/components/es/common/ContactForm.astro', // Unused
    'src/components/es/contact/SectionOne.astro', // Unused
    'src/components/es/contact/SectionTwo.astro', // Unused
    'src/components/es/home/HomePageVisas.tsx', // Unused
    'src/components/es/home/ReviewsSection.tsx', // Unused
    'src/components/es/real-estate/RealEstateGuide.tsx', // Unused
    'src/components/es/services/Section_2.astro', // Unused
    'src/components/es/services/Section_3.astro', // Unused
    'src/components/es/services/Section_4.astro', // Unused
    'src/components/es/ui/cards/PropertyCard.tsx', // Unused
    'src/components/es/ui/forms/PropertyFilters.tsx', // Unused
    'src/components/es/visas/ApostilleCountries.tsx', // Unused
    'src/components/es/visas/Section_1.astro', // Unused
    'src/components/es/visas/VisaAssistanceService.astro', // Unused
    'src/components/es/visas/VisasSectionLegacy.tsx', // Unused
    'src/components/es/visas/VisasSectionFilterSearch.tsx', // Unused
  ],
  
  // Directories to remove
  dirsToRemove: [
    'src/content/posts',
    'src/content/resources', 
    'src/content/visas'
  ]
};

class ComprehensiveCleanup {
  constructor() {
    this.stats = {
      filesProcessed: 0,
      filesRemoved: 0,
      unusedImportsRemoved: 0,
      consoleLogsRemoved: 0,
      todosFound: 0,
      fixmesFound: 0,
      commentedCodeRemoved: 0
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

  // Remove unused React imports
  removeUnusedReactImports(content) {
    let newContent = content;
    
    // Remove standalone React imports
    newContent = newContent.replace(CONFIG.patterns.unusedReactImports, '');
    
    // Remove React from destructuring imports
    newContent = newContent.replace(CONFIG.patterns.unusedReactImportsInDestructuring, (match) => {
      const withoutReact = match.replace(/React,?\s*/, '').replace(/,\s*React/, '');
      return withoutReact.includes('{') && withoutReact.match(/\{[^}]*\}/)[0].trim() === '{}' 
        ? '' 
        : withoutReact;
    });
    
    return newContent;
  }

  // Remove console.log statements
  removeConsoleLogs(content) {
    return content.replace(CONFIG.patterns.consoleLogs, '');
  }

  // Remove commented out code
  removeCommentedCode(content) {
    return content.replace(CONFIG.patterns.commentedOutCode, '');
  }

  // Count TODOs and FIXMEs
  countTODOs(content) {
    const todos = content.match(CONFIG.patterns.todoComments) || [];
    const fixmes = content.match(CONFIG.patterns.fixmeComments) || [];
    this.stats.todosFound += todos.length;
    this.stats.fixmesFound += fixmes.length;
  }

  // Process a single file
  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let newContent = content;
      
      // Remove unused React imports
      newContent = this.removeUnusedReactImports(newContent);
      
      // Remove console.log statements
      newContent = this.removeConsoleLogs(newContent);
      
      // Remove commented out code
      newContent = this.removeCommentedCode(newContent);
      
      // Count TODOs and FIXMEs
      this.countTODOs(newContent);
      
      // Write back if content changed
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        this.log(`✓ Processed: ${filePath}`, 'green');
      }
      
      this.stats.filesProcessed++;
      
    } catch (error) {
      this.log(`✗ Error processing ${filePath}: ${error.message}`, 'red');
    }
  }

  // Remove unused files
  removeUnusedFiles() {
    CONFIG.filesToRemove.forEach(filePath => {
      const fullPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          this.log(`🗑️  Removed: ${filePath}`, 'red');
          this.stats.filesRemoved++;
        } catch (error) {
          this.log(`✗ Error removing ${filePath}: ${error.message}`, 'red');
        }
      }
    });
  }

  // Remove unused directories
  removeUnusedDirectories() {
    CONFIG.dirsToRemove.forEach(dirPath => {
      const fullPath = path.join(__dirname, '..', dirPath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.rmSync(fullPath, { recursive: true, force: true });
          this.log(`🗑️  Removed directory: ${dirPath}`, 'red');
        } catch (error) {
          this.log(`✗ Error removing directory ${dirPath}: ${error.message}`, 'red');
        }
      }
    });
  }

  // Walk directory and process files
  walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && !CONFIG.ignoreDirs.includes(file)) {
        this.walkDir(filePath);
      } else if (CONFIG.extensions.some(ext => file.endsWith(ext))) {
        this.processFile(filePath);
      }
    });
  }

  // Print cleanup summary
  printSummary() {
    this.log('\n📊 Comprehensive Cleanup Summary:', 'magenta');
    this.log('==================================', 'magenta');
    this.log(`Files processed: ${this.stats.filesProcessed}`, 'blue');
    this.log(`Files removed: ${this.stats.filesRemoved}`, 'red');
    this.log(`Console.log statements removed: ${this.stats.consoleLogsRemoved}`, 'green');
    this.log(`TODO comments found: ${this.stats.todosFound}`, 'yellow');
    this.log(`FIXME comments found: ${this.stats.fixmesFound}`, 'red');
    this.log(`Commented code removed: ${this.stats.commentedCodeRemoved}`, 'green');
  }

  // Run the cleanup
  run() {
    this.log('🧹 Starting comprehensive cleanup...', 'cyan');
    
    // Remove unused files
    this.log('\n🗑️  Removing unused files...', 'yellow');
    this.removeUnusedFiles();
    
    // Remove unused directories
    this.log('\n🗑️  Removing unused directories...', 'yellow');
    this.removeUnusedDirectories();
    
    // Process all files
    this.log('\n🔧 Processing files...', 'yellow');
    this.walkDir(CONFIG.srcDir);
    
    // Print summary
    this.printSummary();
    
    this.log('\n✅ Comprehensive cleanup complete!', 'green');
  }
}

// Run the cleanup
const cleanup = new ComprehensiveCleanup();
cleanup.run(); 