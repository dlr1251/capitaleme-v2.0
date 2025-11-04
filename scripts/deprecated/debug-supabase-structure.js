import 'dotenv/config';

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

// Test function to check Supabase table structure
async function checkSupabaseStructure() {
  logDebug('🔍 Checking Supabase table structure...');
  
  try {
    const supabaseModule = await import('../src/lib/supabase.js');
    const { supabase } = supabaseModule;
    
    if (!supabase) {
      throw new Error('Supabase client is null');
    }
    
    // Check if clkr_articles table exists and get its structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('clkr_articles')
      .select('*')
      .limit(1);
    
    if (tableError) {
      logDebug('❌ Error accessing clkr_articles table:', tableError);
      return false;
    }
    
    if (tableInfo && tableInfo.length > 0) {
      const sampleRecord = tableInfo[0];
      logDebug('📊 CLKR table structure sample:', {
        fields: Object.keys(sampleRecord),
        fieldTypes: Object.fromEntries(
          Object.entries(sampleRecord).map(([key, value]) => [key, typeof value])
        ),
        sampleRecord: sampleRecord
      });
    }
    
    // Get total count
    const { count, error: countError } = await supabase
      .from('clkr_articles')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      logDebug('❌ Error getting count:', countError);
    } else {
      logDebug(`📊 Total CLKR articles in database: ${count}`);
    }
    
    // Check by language
    const { data: enData, error: enError } = await supabase
      .from('clkr_articles')
      .select('*')
      .eq('lang', 'en');
    
    const { data: esData, error: esError } = await supabase
      .from('clkr_articles')
      .select('*')
      .eq('lang', 'es');
    
    logDebug('📊 Language distribution:', {
      english: enData?.length || 0,
      spanish: esData?.length || 0,
      enError: enError?.message || null,
      esError: esError?.message || null
    });
    
    // Check for required fields
    if (tableInfo && tableInfo.length > 0) {
      const sample = tableInfo[0];
      const requiredFields = ['id', 'title', 'slug', 'description', 'module', 'lang'];
      const missingFields = requiredFields.filter(field => !(field in sample));
      
      if (missingFields.length > 0) {
        logDebug(`❌ Missing required fields: ${missingFields.join(', ')}`);
        return false;
      } else {
        logDebug('✅ All required fields present');
      }
    }
    
    return true;
  } catch (error) {
    logDebug('❌ Error checking Supabase structure:', error);
    return false;
  }
}

// Test function to check specific CLKR articles
async function checkSpecificCLKRArticles() {
  logDebug('🔍 Checking specific CLKR articles...');
  
  try {
    const supabaseModule = await import('../src/lib/supabase.js');
    const { supabase } = supabaseModule;
    
    // Get a few sample articles
    const { data: articles, error } = await supabase
      .from('clkr_articles')
      .select('*')
      .limit(5)
      .order('last_edited', { ascending: false });
    
    if (error) {
      logDebug('❌ Error fetching sample articles:', error);
      return;
    }
    
    if (articles && articles.length > 0) {
      logDebug(`📊 Sample CLKR articles (${articles.length}):`);
      articles.forEach((article, index) => {
        logDebug(`Article ${index + 1}:`, {
          id: article.id,
          title: article.title,
          slug: article.slug,
          module: article.module,
          lang: article.lang,
          last_edited: article.last_edited
        });
      });
    } else {
      logDebug('⚠️ No CLKR articles found in database');
    }
  } catch (error) {
    logDebug('❌ Error checking specific articles:', error);
  }
}

// Test function to check for data consistency issues
async function checkDataConsistency() {
  logDebug('🔍 Checking data consistency...');
  
  try {
    const supabaseModule = await import('../src/lib/supabase.js');
    const { supabase } = supabaseModule;
    
    // Check for articles with missing required fields
    const { data: nullTitles, error: nullTitlesError } = await supabase
      .from('clkr_articles')
      .select('id, title, slug')
      .or('title.is.null,slug.is.null');
    
    const { data: nullModules, error: nullModulesError } = await supabase
      .from('clkr_articles')
      .select('id, title, module')
      .or('module.is.null');
    
    logDebug('📊 Data consistency check:', {
      articlesWithNullTitles: nullTitles?.length || 0,
      articlesWithNullSlugs: nullTitles?.length || 0,
      articlesWithNullModules: nullModules?.length || 0,
      nullTitlesError: nullTitlesError?.message || null,
      nullModulesError: nullModulesError?.message || null
    });
    
    if (nullTitles && nullTitles.length > 0) {
      logDebug('⚠️ Articles with null titles/slugs:', nullTitles);
    }
    
    if (nullModules && nullModules.length > 0) {
      logDebug('⚠️ Articles with null modules:', nullModules);
    }
    
  } catch (error) {
    logDebug('❌ Error checking data consistency:', error);
  }
}

// Main function
async function debugSupabaseStructure() {
  logDebug('🚀 Starting Supabase structure debugging...');
  
  // Step 1: Check table structure
  const structureOk = await checkSupabaseStructure();
  
  // Step 2: Check specific articles
  await checkSpecificCLKRArticles();
  
  // Step 3: Check data consistency
  await checkDataConsistency();
  
  logDebug('🏁 Supabase structure debugging completed');
}

// Run the debug function
if (import.meta.url === `file://${process.argv[1]}`) {
  debugSupabaseStructure().catch(console.error);
}

export { debugSupabaseStructure }; 