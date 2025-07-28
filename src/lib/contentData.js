import 'dotenv/config';
import { getCLKRArticlesFromSupabase, getVisasFromSupabase, getGuidesFromSupabase } from './syncNotionToSupabase.js';
import fs from 'fs';
import { Client } from '@notionhq/client';

// Debug the import
console.log('[DEBUG] getCLKRArticlesFromSupabase imported:', typeof getCLKRArticlesFromSupabase);
console.log('[DEBUG] getVisasFromSupabase imported:', typeof getVisasFromSupabase);
console.log('[DEBUG] getGuidesFromSupabase imported:', typeof getGuidesFromSupabase);

// Create Notion client function
function createNotionClient() {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error('NOTION_API_KEY is not set in environment variables');
  }
  return new Client({ auth: apiKey });
}

// --- Debug logging utility (for CLKR fetches) ---
function logToFile(message, data) {
  fs.appendFileSync('supabase-debug.log', `${new Date().toISOString()} ${message} ${JSON.stringify(data)}\n`);
}

// --- Database IDs (Notion, for future use) ---
const DATABASE_IDS = {
  VISAS: 'eea50d4ca9a64f329585bd8b64a583a6',
  GUIDES: '1cb0a3cd15e3800188b5fb088dafe97c',
  CLKR: '20d0a3cd15e38169928fff5c6f2b219c',
  BLOG: '2130a3cd15e38019bc9fce1432312c6c'
};

// --- In-memory cache for all content data ---
let contentDataCache = {
  data: null,
  timestamp: null,
  lang: null
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function isCacheValid(lang) {
  if (!contentDataCache.data || !contentDataCache.timestamp || contentDataCache.lang !== lang) {
    return false;
  }
  return (Date.now() - contentDataCache.timestamp) < CACHE_DURATION;
}

function clearContentDataCache() {
  contentDataCache = {
    data: null,
    timestamp: null,
    lang: null
  };
}

// --- Fetch all raw data (Supabase/Notion) ---
async function fetchAllDatabases(lang) {
  try {
    console.log(`[RUNTIME DEBUG] fetchAllDatabases called with lang: ${lang}`);
    
    // Fetch visas from Supabase
    let visasData = [];
    try {
      visasData = await getVisasFromSupabase(lang);
      console.log(`Fetched ${visasData.length} visas from Supabase for ${lang}`);
    } catch (error) {
      console.error('Error fetching visas from Supabase:', error);
      visasData = [];
    }
    
    let guidesData;
    try {
      guidesData = await getGuidesFromSupabase(lang);
      if (!guidesData || guidesData.length === 0) throw new Error('No guides found in Supabase');
    } catch {
      guidesData = [];
    }
    
    // Fetch CLKR data from Supabase
    let clkrData = [];
    try {
      console.log(`[RUNTIME DEBUG] Calling getCLKRArticlesFromSupabase for lang: ${lang}`);
      clkrData = await getCLKRArticlesFromSupabase(lang);
      console.log(`[RUNTIME DEBUG] getCLKRArticlesFromSupabase returned ${clkrData.length} articles`);
      console.log(`[RUNTIME DEBUG] First CLKR article:`, clkrData[0]);
      console.log(`Fetched ${clkrData.length} CLKR articles from Supabase for ${lang}`);
    } catch (error) {
      console.error('[RUNTIME DEBUG] Error fetching CLKR articles from Supabase:', error);
      console.error('[RUNTIME DEBUG] Error stack:', error.stack);
      clkrData = [];
    }
    
    // Only fetch blog from Notion (placeholders for now)
    const [blogData] = await Promise.all([
      []  // Placeholder for blog
    ]);
    
    console.log(`[RUNTIME DEBUG] fetchAllDatabases returning:`, {
      visasData: visasData.length,
      guidesData: guidesData.length,
      clkrData: clkrData.length,
      blogData: blogData.length
    });
    
    return {
      visasData,
      guidesData,
      clkrData,
      blogData
    };
  } catch (error) {
    console.error('[RUNTIME DEBUG] Error in fetchAllDatabases:', error);
    throw error;
  }
}

// --- Data normalization for each content type ---
function processVisasData(visasData, lang) {
  const allVisas = visasData
    .filter(visa => {
      // Filter by language
      return visa.lang === lang;
    })
    .map(visa => {
      // Convert string values to booleans for the component
      const beneficiariesBool = visa.beneficiaries === 'Yes' || visa.beneficiaries === true;
      const workPermitBool = visa.work_permit === 'Yes' || visa.work_permit === true || 
                             visa.work_permit === 'Open work permit' || 
                             visa.work_permit === 'Work permit';
      
      return {
        id: visa.id,
        title: visa.title || '',
        slug: visa.slug || '',
        description: visa.description || '',
        category: visa.category || 'visa',
        country: visa.country || '',
        countries: visa.countries || [],
        isPopular: visa.is_popular || false,
        beneficiaries: beneficiariesBool,
        workPermit: workPermitBool,
        processingTime: visa.processing_time || '',
        requirements: visa.requirements || '',
        url: `/${lang}/visas/${visa.slug || visa.id}`,
        lastEdited: visa.last_edited || visa.updated_at || '',
        emoji: visa.emoji || '📋',
        alcance: visa.alcance || '',
        duration: visa.duration || '',
        emojis: visa.emoji ? [visa.emoji] : ['📋']
      };
    });
  const countries = [...new Set(allVisas.map(visa => visa.country).filter(Boolean))].sort();
  const visaTypes = [...new Set(allVisas.map(visa => visa.category).filter(Boolean))].sort();
  const popularVisas = allVisas.filter(visa => visa.isPopular).slice(0, 4);
  return {
    allVisas,
    countries,
    visaTypes,
    popularVisas,
    filters: {
      countries,
      visaTypes,
      hasPopular: popularVisas.length > 0
    }
  };
}

function processGuidesData(guidesData, lang) {
  const allGuides = guidesData
    .filter(guide => {
      const isPublished = guide.published === true;
      const title = guide.title || '';
      const slug = guide.slug || '';
      return isPublished && title && slug;
    })
    .map(guide => {
      return {
        id: guide.id,
        title: guide.title || '',
        slug: guide.slug || '',
        description: guide.description || '',
        category: guide.category || 'guide',
        url: `/${lang}/guides/${guide.slug || guide.id}`,
        lastEdited: guide.last_edited || guide.updated_at || '',
        isFeatured: guide.featured || false
      };
    });
  const categories = [...new Set(allGuides.map(guide => guide.category).filter(Boolean))].sort();
  const popularGuides = allGuides.filter(guide => guide.isFeatured).slice(0, 4);
  return {
    allGuides,
    categories,
    popularGuides,
    filters: {
      categories,
      hasPopular: popularGuides.length > 0
    }
  };
}

async function processCLKRData(clkrArticles, lang) {
  try {
    console.log(`[RUNTIME DEBUG] processCLKRData called with ${clkrArticles?.length || 0} articles`);
    
    if (!clkrArticles || clkrArticles.length === 0) {
      console.log(`[RUNTIME DEBUG] No CLKR articles found, returning empty result`);
      return {
        allCLKRServices: [],
        modules: []
      };
    }
    
    console.log(`[RUNTIME DEBUG] Processing CLKR articles:`, clkrArticles);
    
    // Transform articles into services format
    const allCLKRServices = clkrArticles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      description: article.description,
      module: article.module,
      url: `/${lang}/clkr/${article.slug}`,
      lastEdited: article.last_edited,
      readingTime: article.reading_time || 5
    }));
    
    console.log(`[RUNTIME DEBUG] Processed ${allCLKRServices.length} CLKR services`);
    console.log(`[RUNTIME DEBUG] First processed service:`, allCLKRServices[0]);
    
    // Extract unique modules
    const modules = [...new Set(allCLKRServices.map(service => service.module).filter(Boolean))].sort();
    console.log(`[RUNTIME DEBUG] Found ${modules.length} unique modules:`, modules);
    
    console.log(`[RUNTIME DEBUG] processCLKRData returning:`, { allCLKRServices, modules });
    
    return {
      allCLKRServices,
      modules
    };
  } catch (error) {
    console.error(`[RUNTIME DEBUG] processCLKRData error:`, error);
    console.error(`[RUNTIME DEBUG] Error stack:`, error.stack);
    return {
      allCLKRServices: [],
      modules: []
    };
  }
}

async function processBlogData(blogData, lang) {
  const allBlogPosts = await Promise.all(
    blogData
      .filter(page => {
        const pageLang = page.properties?.Lang?.select?.name;
        const isPublished = page.properties?.Published?.checkbox === true;
        const title = page.properties?.Nombre?.title?.[0]?.plain_text || '';
        return ((pageLang === 'En' && lang === 'en') || (pageLang === 'Es' && lang === 'es')) && isPublished && title;
      })
      .map(async page => {
        const properties = page.properties;
        const title = properties.Nombre?.title?.[0]?.plain_text || '';
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return {
          id: page.id,
          title,
          slug,
          description: properties.Description?.rich_text?.[0]?.plain_text || '',
          excerpt: properties.Description?.rich_text?.[0]?.plain_text || '',
          image: '',
          date: properties.PubDate?.date?.start || page.last_edited_time,
          pubDate: properties.PubDate?.date?.start || page.last_edited_time,
          href: `/${lang}/blog/${slug}`,
          isFeatured: properties.Featured?.checkbox || false,
          lastEdited: page.last_edited_time,
          author: {},
          readingTime: 5
        };
      })
  );
  allBlogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return {
    allBlogPosts,
    latestNews: allBlogPosts.slice(0, 5),
    featuredPosts: allBlogPosts.filter(post => post.isFeatured).slice(0, 3)
  };
}

// --- Main: get all processed content data (with cache) ---
async function getAllContentData(lang = 'en') {
  // Siempre obtener datos frescos para asegurar que los datos de CLKR se carguen
  // clearContentDataCache(); // Comentado para evitar problemas de caché
  
  try {
    const { visasData, guidesData, clkrData, blogData } = await fetchAllDatabases(lang);
    const visasProcessed = processVisasData(visasData, lang);
    const guidesProcessed = processGuidesData(guidesData, lang);
    const clkrProcessed = await processCLKRData(clkrData, lang);
    const blogProcessed = await processBlogData(blogData, lang);
    
    console.log(`[DEBUG] CLKR data processed:`, clkrProcessed);
    console.log(`[DEBUG] CLKR services count:`, clkrProcessed.allCLKRServices?.length);
    
    const contentData = {
      // Visas
      allVisas: visasProcessed.allVisas,
      visaCountries: visasProcessed.countries,
      visaTypes: visasProcessed.visaTypes,
      popularVisas: visasProcessed.popularVisas,
      visaFilters: visasProcessed.filters,
      // Guides
      allGuides: guidesProcessed.allGuides,
      guideCategories: guidesProcessed.categories,
      popularGuides: guidesProcessed.popularGuides,
      guideFilters: guidesProcessed.filters,
      // CLKR
      clkrServices: clkrProcessed.allCLKRServices,
      clkrModules: clkrProcessed.modules,
      // Blog
      latestNews: blogProcessed.latestNews,
      featuredPosts: blogProcessed.featuredPosts,
      // Real estate (placeholder)
      featuredProperty: null,
      realEstateArticles: [],
      // Meta
      lastUpdated: new Date().toISOString(),
      totalItems: {
        visas: visasProcessed.allVisas.length,
        guides: guidesProcessed.allGuides.length,
        clkr: clkrProcessed.allCLKRServices.length,
        blog: blogProcessed.allBlogPosts.length
      }
    };
    
    // Actualizar el caché con los datos frescos
    contentDataCache = {
      data: contentData,
      timestamp: Date.now(),
      lang
    };
    
    console.log(`[DEBUG] Final contentData.clkrServices length:`, contentData.clkrServices?.length);
    
    return contentData;
  } catch (error) {
    console.error('Error in getAllContentData:', error);
    // Return empty structure on error
    return {
      allVisas: [],
      visaCountries: [],
      visaTypes: [],
      popularVisas: [],
      visaFilters: { countries: [], visaTypes: [], hasPopular: false },
      allGuides: [],
      guideCategories: [],
      popularGuides: [],
      guideFilters: { categories: [], hasPopular: false },
      clkrServices: [],
      clkrModules: [],
      latestNews: [],
      featuredPosts: [],
      featuredProperty: null,
      realEstateArticles: [],
      lastUpdated: new Date().toISOString(),
      totalItems: { visas: 0, guides: 0, clkr: 0, blog: 0 }
    };
  }
}

// --- CLKR menu data (from Supabase) ---
async function getCLKRMenuData(lang = 'en') {
  const clkrData = await getCLKRArticlesFromSupabase(lang);
  return await processCLKRData(clkrData, lang);
}

// --- Guides Export Helper ---
async function getGuides(lang = 'en') {
  if (isCacheValid(lang) && contentDataCache.data?.allGuides) {
    return contentDataCache.data.allGuides;
  }
  const data = await getAllContentData(lang);
  return data.allGuides;
}

// --- Exports ---
export {
  getAllContentData,
  getCLKRMenuData,
  clearContentDataCache as clearMenuDataCache,
  getGuides
};
