import 'dotenv/config';
import { debugSupabaseStructure } from './debug-supabase-structure.js';
import { debugCLKRFlow } from './debug-clkr-flow.js';
import { debugFrontendFlow } from './debug-frontend-flow.js';

// Debug logging utility
function logDebug(message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  if (data) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
  console.log('---');
}

// Main comprehensive debugging function
async function comprehensiveCLKRDebug(lang = 'en') {
  logDebug('🚀 Starting comprehensive CLKR debugging...');
  logDebug(`📋 Language: ${lang}`);
  
  const results = {
    supabaseStructure: false,
    clkrFlow: false,
    frontendFlow: false,
    summary: {}
  };
  
  try {
    // Step 1: Debug Supabase structure
    logDebug('🔍 Step 1: Debugging Supabase structure...');
    await debugSupabaseStructure();
    results.supabaseStructure = true;
    logDebug('✅ Supabase structure debugging completed');
    
    // Step 2: Debug CLKR data flow
    logDebug('🔍 Step 2: Debugging CLKR data flow...');
    await debugCLKRFlow(lang);
    results.clkrFlow = true;
    logDebug('✅ CLKR data flow debugging completed');
    
    // Step 3: Debug frontend flow
    logDebug('🔍 Step 3: Debugging frontend flow...');
    await debugFrontendFlow(lang);
    results.frontendFlow = true;
    logDebug('✅ Frontend flow debugging completed');
    
  } catch (error) {
    logDebug('❌ Error during comprehensive debugging:', error);
  }
  
  // Generate summary
  logDebug('📋 Comprehensive debugging summary:', {
    supabaseStructure: results.supabaseStructure,
    clkrFlow: results.clkrFlow,
    frontendFlow: results.frontendFlow,
    allStepsCompleted: results.supabaseStructure && results.clkrFlow && results.frontendFlow
  });
  
  logDebug('🏁 Comprehensive CLKR debugging completed');
  
  return results;
}

// Run the comprehensive debug function
if (import.meta.url === `file://${process.argv[1]}`) {
  const lang = process.argv[2] || 'en';
  comprehensiveCLKRDebug(lang).catch(console.error);
}

export { comprehensiveCLKRDebug }; 