// Menu data utilities for dynamic megamenus - OPTIMIZED VERSION
import { getCollection } from 'astro:content';
import { getVisasFromSupabase, getGuidesFromSupabase, getCLKRArticlesFromSupabase } from '../lib/syncNotionToSupabase.js';

// Function to match author by email from authors collection
async function matchAuthorByEmail(authorEmail) {
  try {
    const authors = await getCollection('authors');
    const emailPrefix = authorEmail.split('@')[0]; // Get the part before @
    
    const matchedAuthor = authors.find(author => {
      const authorEmailPrefix = author.data.email?.split('@')[0];
      return authorEmailPrefix === emailPrefix;
    });

    if (matchedAuthor) {
      return {
        name: matchedAuthor.data.name,
        avatar: `/images/team/${matchedAuthor.data.image}`,
        role: matchedAuthor.data.role
      };
    }
    
    // Return default author if no match found
    return {
      name: 'Capital M Law',
      avatar: '/images/team/danielluque.jpg',
      role: 'Legal Expert'
    };
  } catch (error) {
    
    return {
      name: 'Capital M Law',
      avatar: '/images/team/danielluque.jpg',
      role: 'Legal Expert'
    };
  }
}

// Cache for storing fetched data
let menuDataCache = {
  data: null,
  timestamp: null,
  lang: null
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Check if cache is valid
function isCacheValid(lang) {
  if (!menuDataCache.data || !menuDataCache.timestamp || menuDataCache.lang !== lang) {
    return false;
  }
  return (Date.now() - menuDataCache.timestamp) < CACHE_DURATION;
}

// Clear cache
function clearCache() {
  menuDataCache = {
    data: null,
    timestamp: null,
    lang: null
  };
}

// Export clearCache for external use
export { clearCache };

// Fetch all databases from Supabase
async function fetchAllDatabases(lang) {
  try {
    // Fetch all databases from Supabase
    const [visasData, guidesData, clkrData] = await Promise.all([
      getVisasFromSupabase(lang),
      getGuidesFromSupabase(lang),
      getCLKRArticlesFromSupabase(lang)
    ]);

    // Blog data is still placeholder for now
    const blogData = [];

    return {
      visasData,
      guidesData,
      clkrData,
      blogData
    };
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    throw error;
  }
}

// Process visas data
function processVisasData(visasData, lang) {
  const allVisas = visasData
    .filter(visa => {
      // Filter by language
      return visa.lang === lang;
    })
    .map(visa => {
      return {
        id: visa.id,
        title: visa.title || '',
        slug: visa.slug || '',
        description: visa.description || '',
        category: visa.category || 'visa',
        country: visa.country || '',
        countries: visa.countries || [],
        isPopular: visa.is_popular || false,
        beneficiaries: visa.beneficiaries || '',
        workPermit: visa.work_permit || '',
        processingTime: visa.processing_time || '',
        requirements: visa.requirements || '',
        url: `/${lang}/visas/${visa.slug || visa.id}`,
        lastEdited: visa.last_edited || visa.updated_at || '',
        emoji: visa.emoji || '📋',
        alcance: visa.alcance || '',
        duration: visa.duration || ''
      };
    });

  // Get unique filter options
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

// Process guides data
function processGuidesData(guidesData, lang) {
  const allGuides = guidesData
    .filter(guide => {
      const isPublished = guide.published === true;
      const title = guide.title || '';
      const slug = guide.slug || '';
      return isPublished && title && slug && guide.lang === lang;
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

  // Get unique categories
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

// Process CLKR data
function processCLKRData(clkrData, lang) {
  const allCLKRServices = clkrData
    .filter(service => {
      // Filter by language
      return service.lang === lang;
    })
    .map(service => {
      return {
        id: service.id,
        title: service.title || '',
        slug: service.slug || '',
        description: service.description || '',
        module: service.module || 'CLKR',
        href: `/${lang}/clkr/${service.slug || service.id}`,
        lastEdited: service.last_edited || service.updated_at || '',
        readingTime: service.reading_time || 5
      };
    });

  // Get unique modules
  const modules = [...new Set(allCLKRServices.map(service => service.module).filter(Boolean))].sort();

  return {
    allCLKRServices,
    modules
  };
}

// Process blog data
async function processBlogData(blogData, lang) {
  const allBlogPosts = await Promise.all(
    blogData
      .filter(page => {
        const pageLang = page.properties.Lang?.select?.name;
        const isPublished = page.properties.Published?.checkbox === true;
        const title = page.properties.Nombre?.title?.[0]?.plain_text || '';
        
        const isCorrectLang = (pageLang === 'En' && lang === 'en') || (pageLang === 'Es' && lang === 'es');
        
        return isCorrectLang && isPublished && title;
      })
      .map(async page => {
        const properties = page.properties;
        const title = properties.Nombre?.title?.[0]?.plain_text || '';
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const authorEmail = properties.Author?.rich_text?.[0]?.plain_text || null;
        
        // Match author by email
        const authorInfo = authorEmail ? await matchAuthorByEmail(authorEmail) : {
          name: 'Capital M Law',
          avatar: '/images/team/danielluque.jpg',
          role: 'Legal Expert'
        };
        
        // Extract cover image from Notion
        let coverImage = '';
        
        // Try to get cover image from page cover
        if (page.cover) {
          if (page.cover.type === 'external' && page.cover.external) {
            coverImage = page.cover.external.url;
          } else if (page.cover.type === 'file' && page.cover.file) {
            coverImage = page.cover.file.url;
          }
        }
        
        // If no cover, try to get from files property
        if (!coverImage && properties.CoverImage?.files?.length > 0) {
          const file = properties.CoverImage.files[0];
          if (file.type === 'external' && file.external) {
            coverImage = file.external.url;
          } else if (file.type === 'file' && file.file) {
            coverImage = file.file.url;
          }
        }
        
        // If no cover, try to get from Image property
        if (!coverImage && properties.Image?.files?.length > 0) {
          const file = properties.Image.files[0];
          if (file.type === 'external' && file.external) {
            coverImage = file.external.url;
          } else if (file.type === 'file' && file.file) {
            coverImage = file.file.url;
          }
        }
        
        // Fallback to hardcoded image if no cover found
        if (!coverImage) {
          coverImage = getImagePath(slug, title);
        }
        
        return {
          id: page.id,
          title,
          slug,
          description: properties.Description?.rich_text?.[0]?.plain_text || '',
          excerpt: properties.Description?.rich_text?.[0]?.plain_text || '',
          image: coverImage,
          date: properties.PubDate?.date?.start || page.last_edited_time,
          pubDate: properties.PubDate?.date?.start || page.last_edited_time,
          href: `/${lang}/blog/${slug}`,
          isFeatured: properties.Featured?.checkbox || false,
          lastEdited: page.last_edited_time,
          author: authorInfo,
          readingTime: 5 // Default reading time
        };
      })
  );

  // Sort after processing all authors
  allBlogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    allBlogPosts,
    latestNews: allBlogPosts.slice(0, 5),
    featuredPosts: allBlogPosts.filter(post => post.isFeatured).slice(0, 3)
  };
}

// Helper function to get image path for blog posts
function getImagePath(slug, title = '') {
  // First try exact slug matches
  switch (slug) {
    case 'counting-your-days':
      return '/blog/counting-your-days.webp';
    case 'dnv-confusion':
      return '/blog/dnv-confusion/img-1.webp';
    case 'gringo-prices':
      return '/blog/gringo-prices/img-1.webp';
    case 'apostille':
      return '/blog/apostille/img-1.webp';
    case 'real-estate-vs-business-investment-visas':
      return '/blog/real-estate/img-1.webp';
    case 'on-gringo-prices':
      return '/blog/gringo-prices/img-1.webp';
    case 'the-digital-nomad-visa-confusion':
      return '/blog/dnv-confusion/img-1.webp';
    case 'the-realtors-in-colombia-an-unregulated-landscape':
      return '/blog/real-estate/img-2.webp';
    default:
      // Try to match based on title keywords
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('gringo') || lowerTitle.includes('prices')) {
        return '/blog/gringo-prices/img-1.webp';
      }
      if (lowerTitle.includes('dnv') || lowerTitle.includes('digital nomad') || lowerTitle.includes('nomad')) {
        return '/blog/dnv-confusion/img-1.webp';
      }
      if (lowerTitle.includes('real estate') || lowerTitle.includes('realtor') || lowerTitle.includes('property')) {
        return '/blog/real-estate/img-1.webp';
      }
      if (lowerTitle.includes('apostille') || lowerTitle.includes('document')) {
        return '/blog/apostille/img-1.webp';
      }
      if (lowerTitle.includes('counting') || lowerTitle.includes('days') || lowerTitle.includes('time')) {
        return '/blog/counting-your-days.webp';
      }
      // Default fallback
      return '/blog/counting-your-days.webp';
  }
}

// Get featured property from Astro collections
async function getFeaturedProperty(lang) {
  try {
    const properties = await getCollection('properties', ({ data }) => {
      return data.lang === lang && data.featured === true;
    });
    
    if (properties.length > 0) {
      const property = properties[0];
      return {
        title: property.data.title,
        href: `/${lang}/real-estate/properties/${property.slug}`,
        image: property.data.featuredImage || property.data.images?.[0] || '/images/real-estate/placeholder.jpg',
        price: property.data.price || '',
        location: property.data.location || 'Medellín, Colombia'
      };
    }
    
    return null;
  } catch (error) {
    
    return null;
  }
}

// Main optimized function to get all menu data
export async function getAllMenuData(lang = 'en') {
  // Check cache first
  if (isCacheValid(lang)) {
    
    return menuDataCache.data;
  }

  
  try {
    // Fetch all databases in parallel
    const { visasData, guidesData, clkrData, blogData } = await fetchAllDatabases(lang);
    
    // Process all data
    const visasProcessed = processVisasData(visasData, lang);
    const guidesProcessed = processGuidesData(guidesData, lang);
    const clkrProcessed = processCLKRData(clkrData, lang);
    const blogProcessed = await processBlogData(blogData, lang);
    
    // Get featured property (this is from Astro collections, not Notion)
    const featuredProperty = await getFeaturedProperty(lang);
    
    // Get visa guides (specific guides for visas megamenu)
    const visasGuides = guidesProcessed.allGuides
      .filter(guide => {
        const title = guide.title.toLowerCase();
        return title.includes('cedula') || 
               title.includes('cédula') ||
               title.includes('movimientos migratorios') ||
               title.includes('migratory movements') ||
               title.includes('salvoconducto');
      })
      .slice(0, 4);

    // Get real estate articles from CLKR
    const realEstateArticles = clkrProcessed.allCLKRServices
      .filter(service => {
        const module = service.module.toLowerCase();
        const title = service.title.toLowerCase();
        return module.includes('real estate') || 
               module.includes('urbanism') ||
               module.includes('inmobiliario') ||
               title.includes('real estate') ||
               title.includes('property') ||
               title.includes('inmobiliario') ||
               title.includes('propiedad');
      })
      .slice(0, 6); // Show more articles

    // Compile final data structure
    const menuData = {
      // Visas data
      popularVisas: visasProcessed.popularVisas,
      visasGuides,
      allVisas: visasProcessed.allVisas,
      visaCountries: visasProcessed.countries,
      visaTypes: visasProcessed.visaTypes,
      popularVisasFiltered: visasProcessed.popularVisas,
      visaFilters: visasProcessed.filters,
      
      // Guides data
      guides: guidesProcessed.allGuides,
      allGuides: guidesProcessed.allGuides,
      guideCategories: guidesProcessed.categories,
      popularGuidesFiltered: guidesProcessed.popularGuides,
      guideFilters: guidesProcessed.filters,
      
      // CLKR data
      clkrServices: clkrProcessed.allCLKRServices,
      clkrModules: clkrProcessed.modules,
      
      // Blog data
      latestNews: blogProcessed.latestNews,
      featuredPosts: blogProcessed.featuredPosts,
      
      // Real estate data
      featuredProperty,
      realEstateArticles,
      
      // Metadata
      lastUpdated: new Date().toISOString(),
      totalItems: {
        visas: visasProcessed.allVisas.length,
        guides: guidesProcessed.allGuides.length,
        clkr: clkrProcessed.allCLKRServices.length,
        blog: blogProcessed.allBlogPosts.length
      }
    };

    // Cache the data
    menuDataCache = {
      data: menuData,
      timestamp: Date.now(),
      lang
    };

    
    return menuData;
    
  } catch (error) {
    
    // Return fallback data - never return null
    const fallbackData = {
      popularVisas: [],
      visasGuides: [],
      allVisas: [],
      visaCountries: [],
      visaTypes: [],
      popularVisasFiltered: [],
      visaFilters: { countries: [], visaTypes: [], hasPopular: false },
      guides: [],
      allGuides: [],
      guideCategories: [],
      popularGuidesFiltered: [],
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

    // Cache the fallback data as well
    menuDataCache = {
      data: fallbackData,
      timestamp: Date.now(),
      lang
    };

    return fallbackData;
  }
}

// Function to clear cache (useful for development or when data needs to be refreshed)
export function clearMenuDataCache() {
  clearCache();
  
}

// Legacy functions for backward compatibility
export async function getPopularVisasFromNotion(lang = 'en') {
  const menuData = await getAllMenuData(lang);
  return menuData.popularVisas;
}

export async function getVisasGuides(lang = 'en') {
  const menuData = await getAllMenuData(lang);
  return menuData.visasGuides;
}

export async function getAllVisasFromNotion(lang = 'en') {
  const menuData = await getAllMenuData(lang);
  return menuData.allVisas;
}

export async function getPopularVisas(lang = 'en') {
  const menuData = await getAllMenuData(lang);
  return menuData.popularVisas;
}

export async function getGuides(lang = 'en') {
  const menuData = await getAllMenuData(lang);
  return menuData.guides;
}

export async function getCLKRServices(lang = 'en') {
  const menuData = await getAllMenuData(lang);
  return {
    entries: menuData.clkrServices,
    modules: menuData.clkrModules
  };
}

export async function getLatestNews(lang = 'en') {
  const menuData = await getAllMenuData(lang);
  return menuData.latestNews;
}

export async function getAllVisasWithFilters(lang = 'en') {
  const menuData = await getAllMenuData(lang);
  return {
    allVisas: menuData.allVisas,
    countries: menuData.visaCountries,
    visaTypes: menuData.visaTypes,
    popularVisas: menuData.popularVisasFiltered,
    filters: menuData.visaFilters
  };
}

export async function getAllGuidesWithFilters(lang = 'en') {
  const menuData = await getAllMenuData(lang);
  return {
    allGuides: menuData.allGuides,
    categories: menuData.guideCategories,
    popularGuides: menuData.popularGuidesFiltered,
    filters: menuData.guideFilters
  };
}

// Function to filter visas based on selected criteria
export function filterVisas(visas, filters) {
  return visas.filter(visa => {
    // Country filter
    if (filters.country && filters.country !== 'All' && visa.country !== filters.country) {
      return false;
    }
    
    // Visa type filter
    if (filters.visaType && filters.visaType !== 'All' && visa.category !== filters.visaType) {
      return false;
    }
    
    // Popular filter
    if (filters.popular && !visa.isPopular) {
      return false;
    }
    
    return true;
  });
}

// Function to filter guides based on selected criteria
export function filterGuides(guides, filters) {
  return guides.filter(guide => {
    // Category filter
    if (filters.category && filters.category !== 'All' && guide.category !== filters.category) {
      return false;
    }
    
    // Featured filter
    if (filters.featured && !guide.isFeatured) {
      return false;
    }
    
    return true;
  });
} 