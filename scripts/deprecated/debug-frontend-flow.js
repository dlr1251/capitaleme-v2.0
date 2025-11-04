import 'dotenv/config';
import { getAllContentData } from '../src/server/lib/contentData.js';

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

// Test function to simulate frontend data fetching
async function testFrontendDataFetch(lang = 'en') {
  logDebug(`🔍 Testing frontend data fetch for lang: ${lang}`);
  
  try {
    const contentData = await getAllContentData(lang);
    
    logDebug('📊 Frontend data structure:', {
      hasCLKRServices: !!contentData.clkrServices,
      clkrServicesCount: contentData.clkrServices?.length || 0,
      hasCLKRModules: !!contentData.clkrModules,
      clkrModulesCount: contentData.clkrModules?.length || 0,
      totalItems: contentData.totalItems,
      lastUpdated: contentData.lastUpdated
    });
    
    if (contentData.clkrServices && contentData.clkrServices.length > 0) {
      logDebug('✅ Frontend data fetch successful');
      return contentData;
    } else {
      logDebug('⚠️ Frontend data fetch returned empty CLKR services');
      return contentData;
    }
  } catch (error) {
    logDebug('❌ Frontend data fetch failed:', error);
    return null;
  }
}

// Test function to check component data requirements
function testComponentDataRequirements(contentData) {
  logDebug('🔍 Testing component data requirements...');
  
  if (!contentData) {
    logDebug('❌ No content data to test');
    return false;
  }
  
  // Check what CLKR components expect
  const componentRequirements = {
    CLKRModuleExplorer: ['clkrServices', 'clkrModules'],
    CLKRSidebar: ['clkrServices', 'clkrModules'],
    HomePageCLKR: ['clkrServices', 'clkrModules']
  };
  
  const missingRequirements = {};
  
  Object.entries(componentRequirements).forEach(([component, requirements]) => {
    const missing = requirements.filter(req => !contentData[req] || contentData[req].length === 0);
    if (missing.length > 0) {
      missingRequirements[component] = missing;
    }
  });
  
  if (Object.keys(missingRequirements).length > 0) {
    logDebug('❌ Missing data for components:', missingRequirements);
    return false;
  } else {
    logDebug('✅ All component data requirements met');
    return true;
  }
}

// Test function to check data transformation
function testDataTransformation(contentData) {
  logDebug('🔍 Testing data transformation...');
  
  if (!contentData?.clkrServices || contentData.clkrServices.length === 0) {
    logDebug('❌ No CLKR services to test transformation');
    return false;
  }
  
  const sampleService = contentData.clkrServices[0];
  
  // Check required fields for frontend components
  const requiredFields = ['id', 'title', 'slug', 'description', 'module', 'url'];
  const missingFields = requiredFields.filter(field => !sampleService[field]);
  
  if (missingFields.length > 0) {
    logDebug(`❌ Missing required fields in transformed data: ${missingFields.join(', ')}`);
    return false;
  }
  
  // Check URL format
  const urlPattern = /^\/[a-z]{2}\/clkr\/[a-z0-9-]+$/;
  if (!urlPattern.test(sampleService.url)) {
    logDebug(`❌ Invalid URL format: ${sampleService.url}`);
    return false;
  }
  
  logDebug('✅ Data transformation test passed');
  return true;
}

// Test function to check module grouping
function testModuleGrouping(contentData) {
  logDebug('🔍 Testing module grouping...');
  
  if (!contentData?.clkrServices || !contentData?.clkrModules) {
    logDebug('❌ No CLKR data to test module grouping');
    return false;
  }
  
  const services = contentData.clkrServices;
  const modules = contentData.clkrModules;
  
  // Check if all services have valid modules
  const servicesWithModules = services.filter(service => service.module && modules.includes(service.module));
  const servicesWithoutModules = services.filter(service => !service.module || !modules.includes(service.module));
  
  logDebug('📊 Module grouping analysis:', {
    totalServices: services.length,
    servicesWithValidModules: servicesWithModules.length,
    servicesWithoutValidModules: servicesWithoutModules.length,
    uniqueModules: modules.length,
    modules: modules
  });
  
  if (servicesWithoutModules.length > 0) {
    logDebug('⚠️ Services without valid modules:', servicesWithoutModules.map(s => ({ id: s.id, title: s.title, module: s.module })));
  }
  
  return servicesWithoutModules.length === 0;
}

// Test function to simulate component rendering
function testComponentRendering(contentData) {
  logDebug('🔍 Testing component rendering simulation...');
  
  if (!contentData?.clkrServices || contentData.clkrServices.length === 0) {
    logDebug('❌ No CLKR services to test rendering');
    return false;
  }
  
  // Simulate CLKRModuleExplorer component
  const modules = contentData.clkrModules || [];
  const services = contentData.clkrServices || [];
  
  const moduleGroups = {};
  modules.forEach(module => {
    moduleGroups[module] = services.filter(service => service.module === module);
  });
  
  logDebug('📊 Component rendering simulation:', {
    totalModules: modules.length,
    totalServices: services.length,
    moduleGroups: Object.fromEntries(
      Object.entries(moduleGroups).map(([module, services]) => [module, services.length])
    )
  });
  
  // Check if any modules have no services
  const emptyModules = Object.entries(moduleGroups).filter(([module, services]) => services.length === 0);
  if (emptyModules.length > 0) {
    logDebug('⚠️ Empty modules found:', emptyModules.map(([module]) => module));
  }
  
  return emptyModules.length === 0;
}

// Main debugging function
async function debugFrontendFlow(lang = 'en') {
  logDebug('🚀 Starting frontend flow debugging...');
  
  // Step 1: Test frontend data fetch
  const contentData = await testFrontendDataFetch(lang);
  
  if (!contentData) {
    logDebug('❌ Stopping debug due to data fetch failure');
    return;
  }
  
  // Step 2: Test component data requirements
  const requirementsOk = testComponentDataRequirements(contentData);
  
  // Step 3: Test data transformation
  const transformationOk = testDataTransformation(contentData);
  
  // Step 4: Test module grouping
  const groupingOk = testModuleGrouping(contentData);
  
  // Step 5: Test component rendering
  const renderingOk = testComponentRendering(contentData);
  
  logDebug('📋 Frontend debugging summary:', {
    dataFetchOk: !!contentData,
    requirementsOk,
    transformationOk,
    groupingOk,
    renderingOk,
    clkrServicesCount: contentData?.clkrServices?.length || 0,
    clkrModulesCount: contentData?.clkrModules?.length || 0
  });
  
  logDebug('🏁 Frontend flow debugging completed');
}

// Run the debug function
if (import.meta.url === `file://${process.argv[1]}`) {
  const lang = process.argv[2] || 'en';
  debugFrontendFlow(lang).catch(console.error);
}

export { debugFrontendFlow }; 