#!/usr/bin/env node

/**
 * Capital M Law - Project Cleanup Script
 * This script helps identify and clean up common issues in the codebase
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  srcDir: path.join(__dirname, '../src'),
  extensions: ['.jsx', '.tsx', '.js', '.ts'],
  ignoreDirs: ['node_modules', 'dist', '.astro'],
  patterns: {
    unusedReactImports: /^import React from ['"]react['"];?\s*$/gm,
    unusedVariables: /const\s+(\w+)\s*=\s*[^;]+;\s*\/\/\s*unused/gi,
    consoleLogs: /console\.(log|warn|error|info)\([^)]*\);?\s*$/gm,
    todoComments: /\/\/\s*TODO:.*$/gm,
    fixmeComments: /\/\/\s*FIXME:.*$/gm
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
      unusedVariablesRemoved: 0,
      consoleLogsRemoved: 0,
      todosFound: 0,
      fixmesFound: 0
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  // Find all files recursively
  findFiles(dir, extensions = ['.jsx', '.tsx', '.js', '.ts']) {
    const files = [];
    
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
    
    return files;
  }

  // Remove unused React imports
  removeUnusedReactImports(content) {
    const originalContent = content;
    let newContent = content;
    
    // Remove React imports that are not needed in React 17+
    newContent = newContent.replace(CONFIG.patterns.unusedReactImports, '');
    
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

  // Count TODO and FIXME comments
  countTODOs(content) {
    const todos = content.match(CONFIG.patterns.todoComments) || [];
    const fixmes = content.match(CONFIG.patterns.fixmeComments) || [];
    
    this.stats.todosFound += todos.length;
    this.stats.fixmesFound += fixmes.length;
    
    return { todos, fixmes };
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

  // Run the cleanup
  async run() {
    this.log('🧹 Starting Capital M Law Project Cleanup...', 'cyan');
    this.log('==========================================', 'cyan');
    
    // Find all files
    const files = this.findFiles(CONFIG.srcDir);
    this.log(`Found ${files.length} files to process`, 'blue');
    
    // Process each file
    for (const file of files) {
      this.processFile(file);
    }
    
    // Print summary
    this.printSummary();
    
    // Run TypeScript check
    this.runTypeScriptCheck();
  }

  // Print cleanup summary
  printSummary() {
    this.log('\n📊 Cleanup Summary:', 'magenta');
    this.log('==================', 'magenta');
    this.log(`Files processed: ${this.stats.filesProcessed}`, 'blue');
    this.log(`Unused React imports removed: ${this.stats.unusedImportsRemoved}`, 'green');
    this.log(`Console.log statements removed: ${this.stats.consoleLogsRemoved}`, 'green');
    this.log(`TODO comments found: ${this.stats.todosFound}`, 'yellow');
    this.log(`FIXME comments found: ${this.stats.fixmesFound}`, 'red');
  }

  // Run TypeScript check
  runTypeScriptCheck() {
    this.log('\n🔍 Running TypeScript check...', 'cyan');
    
    try {
      const result = execSync('npx tsc --noEmit', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      this.log('✓ TypeScript check passed!', 'green');
    } catch (error) {
      this.log('✗ TypeScript check failed:', 'red');
      this.log(error.stdout || error.message, 'red');
    }
  }
}

// Run the cleanup
const cleanup = new ProjectCleanup();
cleanup.run().catch(console.error); 