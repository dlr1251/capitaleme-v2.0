import 'dotenv/config';
import { getAllContentData } from '../src/server/lib/contentData.js';
import { getCLKRArticlesFromSupabase } from '../src/server/lib/syncNotionToSupabase.js';

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

// Test function to check Supabase connection
async function testSupabaseConnection() {
  logDebug('🔍 Testing Supabase connection...');
  
  try {
    const supabaseModule = await import('../src/lib/supabase.js');
    const { supabase } = supabaseModule;
    
    if (!supabase) {
      throw new Error('Supabase client is null');
    }
    
    logDebug('✅ Supabase client loaded successfully');
    
    // Test a simple query
    const { data, error } = await supabase
      .from('clkr_articles')
      .select('count')
      .limit(1);
    
    if (error) {
      logDebug('❌ Supabase query error:', error);
      return false;
    }
    
    logDebug('✅ Supabase connection test passed');
    return true;
  } catch (error) {
    logDebug('❌ Supabase connection test failed:', error);
    return false;
  }
}

// Test function to check raw CLKR data from Supabase
async function testRawCLKRData(lang = 'en') {
  logDebug(`🔍 Testing raw CLKR data fetch for lang: ${lang}`);
  
  try {
    const rawData = await getCLKRArticlesFromSupabase(lang);
    
    logDebug(`📊 Raw CLKR data results:`, {
      count: rawData?.length || 0,
      isArray: Array.isArray(rawData),
      firstItem: rawData?.[0] || null,
      sampleFields: rawData?.[0] ? Object.keys(rawData[0]) : []
    });
    
    if (rawData && rawData.length > 0) {
      logDebug('✅ Raw CLKR data fetch successful');
      return rawData;
    } else {
      logDebug('⚠️ Raw CLKR data fetch returned empty array');
      return [];
    }
  } catch (error) {
    logDebug('❌ Raw CLKR data fetch failed:', error);
    return [];
  }
}

// Test function to check processed CLKR data
async function testProcessedCLKRData(lang = 'en') {
  logDebug(`🔍 Testing processed CLKR data for lang: ${lang}`);
  
  try {
    const allContentData = await getAllContentData(lang);
    
    logDebug(`📊 Processed CLKR data results:`, {
      clkrServicesCount: allContentData.clkrServices?.length || 0,
      clkrModulesCount: allContentData.clkrModules?.length || 0,
      clkrServices: allContentData.clkrServices || [],
      clkrModules: allContentData.clkrModules || []
    });
    
    if (allContentData.clkrServices && allContentData.clkrServices.length > 0) {
      logDebug('✅ Processed CLKR data successful');
      return allContentData;
    } else {
      logDebug('⚠️ Processed CLKR data returned empty services');
      return allContentData;
    }
  } catch (error) {
    logDebug('❌ Processed CLKR data failed:', error);
    return null;
  }
}

// Test function to check data structure consistency
function testDataStructure(rawData, processedData) {
  logDebug('🔍 Testing data structure consistency...');
  
  if (!rawData || rawData.length === 0) {
    logDebug('❌ No raw data to test');
    return false;
  }
  
  if (!processedData || !processedData.clkrServices) {
    logDebug('❌ No processed data to test');
    return false;
  }
  
  const rawCount = rawData.length;
  const processedCount = processedData.clkrServices.length;
  
  logDebug(`📊 Data structure comparison:`, {
    rawCount,
    processedCount,
    difference: rawCount - processedCount,
    modulesFound: processedData.clkrModules?.length || 0
  });
  
  if (rawCount !== processedCount) {
    logDebug('⚠️ Data count mismatch detected');
    return false;
  }
  
  logDebug('✅ Data structure consistency test passed');
  return true;
}

// Test function to check specific field mapping
function testFieldMapping(rawData, processedData) {
  logDebug('🔍 Testing field mapping...');
  
  if (!rawData?.[0] || !processedData?.clkrServices?.[0]) {
    logDebug('❌ No sample data for field mapping test');
    return false;
  }
  
  const rawSample = rawData[0];
  const processedSample = processedData.clkrServices[0];
  
  logDebug('📊 Field mapping comparison:', {
    rawFields: Object.keys(rawSample),
    processedFields: Object.keys(processedSample),
    rawSample: rawSample,
    processedSample: processedSample
  });
  
  // Check required fields
  const requiredFields = ['id', 'title', 'slug', 'description', 'module'];
  const missingFields = requiredFields.filter(field => !processedSample[field]);
  
  if (missingFields.length > 0) {
    logDebug(`❌ Missing required fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  logDebug('✅ Field mapping test passed');
  return true;
}

// Main debugging function
async function debugCLKRFlow(lang = 'en') {
  logDebug('🚀 Starting CLKR data flow debugging...');
  
  // Step 1: Test Supabase connection
  const connectionOk = await testSupabaseConnection();
  if (!connectionOk) {
    logDebug('❌ Stopping debug due to connection failure');
    return;
  }
  
  // Step 2: Test raw data fetch
  const rawData = await testRawCLKRData(lang);
  
  // Step 3: Test processed data
  const processedData = await testProcessedCLKRData(lang);
  
  // Step 4: Test data structure consistency
  if (rawData && processedData) {
    const structureOk = testDataStructure(rawData, processedData);
    const mappingOk = testFieldMapping(rawData, processedData);
    
    logDebug('📋 Final debugging summary:', {
      connectionOk,
      rawDataCount: rawData?.length || 0,
      processedDataCount: processedData?.clkrServices?.length || 0,
      structureOk,
      mappingOk,
      modulesFound: processedData?.clkrModules?.length || 0
    });
  }
  
  logDebug('🏁 CLKR debugging completed');
}

// Run the debug function
if (import.meta.url === `file://${process.argv[1]}`) {
  const lang = process.argv[2] || 'en';
  debugCLKRFlow(lang).catch(console.error);
}

export { debugCLKRFlow }; 