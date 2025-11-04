#!/usr/bin/env node

/**
 * Consolidated Cleanup Script
 * Limpia el proyecto eliminando código no utilizado, console.logs, etc.
 * Consolidado desde cleanup-project.js, comprehensive-cleanup.js, final-cleanup.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  srcDir: path.join(__dirname, '../..', 'src'),
  extensions: ['.jsx', '.tsx', '.js', '.ts', '.astro'],
  ignoreDirs: ['node_modules', 'dist', '.astro'],
  patterns: {
    unusedReactImports: /^import React from ['"]react['"];?\s*$/gm,
    unusedReactImportsInDestructuring: /import\s*{\s*[^}]*React[^}]*}\s*from\s*['"]react['"];?\s*$/gm,
    consoleLogs: /console\.(log|warn|error|info)\([^)]*\);?\s*$/gm,
    todoComments: /\/\/\s*TODO:.*$/gm,
    fixmeComments: /\/\/\s*FIXME:.*$/gm,
    unusedVariableComments: /\/\/\s*UNUSED.*$/gm,
    commentedOutCode: /\/\/\s*.*=.*;?\s*\/\/\s*UNUSED.*$/gm
  }
};

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

class ProjectCleanup {
  constructor() {
    this.stats = {
      filesProcessed: 0,
      unusedImportsRemoved: 0,
      consoleLogsRemoved: 0,
      todosFound: 0,
      fixmesFound: 0
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  // Find all files recursively
  findFiles(dir, extensions = CONFIG.extensions) {
    const files = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !CONFIG.ignoreDirs.includes(item)) {
          files.push(...this.findFiles(fullPath, extensions));
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
    
    return files;
  }

  // Remove unused React imports
  removeUnusedReactImports(content) {
    const originalContent = content;
    let newContent = content;
    
    // Remove React imports that are not needed in React 17+
    newContent = newContent.replace(CONFIG.patterns.unusedReactImports, '');
    newContent = newContent.replace(CONFIG.patterns.unusedReactImportsInDestructuring, '');
    
    if (newContent !== originalContent) {
      this.stats.unusedImportsRemoved++;
      return newContent;
    }
    
    return content;
  }

  // Remove console.log statements
  removeConsoleLogs(content) {
    const originalContent = content;
    let newContent = content;
    
    newContent = newContent.replace(CONFIG.patterns.consoleLogs, '');
    
    if (newContent !== originalContent) {
      this.stats.consoleLogsRemoved++;
      return newContent;
    }
    
    return content;
  }

  // Find TODOs and FIXMEs
  findComments(content) {
    const todos = content.match(CONFIG.patterns.todoComments);
    const fixmes = content.match(CONFIG.patterns.fixmeComments);
    
    if (todos) this.stats.todosFound += todos.length;
    if (fixmes) this.stats.fixmesFound += fixmes.length;
  }

  // Process a single file
  processFile(filePath, options = {}) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Remove unused React imports
      if (options.removeUnusedImports !== false) {
        const newContent = this.removeUnusedReactImports(content);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
      
      // Remove console.logs
      if (options.removeConsoleLogs !== false) {
        const newContent = this.removeConsoleLogs(content);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
      
      // Find comments (read-only, doesn't modify)
      if (options.findComments !== false) {
        this.findComments(content);
      }
      
      // Write back if modified
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
      }
      
      return false;
    } catch (error) {
      this.log(`❌ Error processing ${filePath}: ${error.message}`, 'red');
      return false;
    }
  }

  // Run cleanup
  run(options = {}) {
    const {
      removeUnusedImports = true,
      removeConsoleLogs = true,
      findComments = true
    } = options;

    this.log('🧹 Starting project cleanup...', 'blue');
    this.log('═══════════════════════════════════════════\n', 'blue');

    const files = this.findFiles(CONFIG.srcDir);
    this.log(`📁 Found ${files.length} files to process\n`, 'cyan');

    let processedCount = 0;

    files.forEach(file => {
      this.stats.filesProcessed++;
      const modified = this.processFile(file, {
        removeUnusedImports,
        removeConsoleLogs,
        findComments
      });
      
      if (modified) {
        processedCount++;
        const relativePath = path.relative(CONFIG.srcDir, file);
        this.log(`✅ Cleaned: ${relativePath}`, 'green');
      }
    });

    // Print summary
    this.log('\n═══════════════════════════════════════════', 'blue');
    this.log('📊 Cleanup Summary', 'blue');
    this.log('═══════════════════════════════════════════\n', 'blue');
    
    this.log(`Files processed: ${this.stats.filesProcessed}`, 'cyan');
    this.log(`Files modified: ${processedCount}`, 'cyan');
    this.log(`Unused imports removed: ${this.stats.unusedImportsRemoved}`, 'green');
    this.log(`Console.logs removed: ${this.stats.consoleLogsRemoved}`, 'green');
    this.log(`TODOs found: ${this.stats.todosFound}`, 'yellow');
    this.log(`FIXMEs found: ${this.stats.fixmesFound}`, 'yellow');
    
    this.log('\n✅ Cleanup complete!', 'green');
    
    return this.stats;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const options = {
    removeUnusedImports: args.includes('--keep-imports') ? false : true,
    removeConsoleLogs: args.includes('--keep-logs') ? false : true,
    findComments: !args.includes('--skip-comments')
  };

  const cleanup = new ProjectCleanup();
  cleanup.run(options);
  
  console.log('\n💡 Usage:');
  console.log('   --keep-imports    Don\'t remove unused React imports');
  console.log('   --keep-logs       Don\'t remove console.log statements');
  console.log('   --skip-comments   Don\'t scan for TODOs/FIXMEs');
}

main().catch(console.error);

