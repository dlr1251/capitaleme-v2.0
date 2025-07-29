import type { APIRoute } from 'astro';
import { getAllMenuData } from '../../utils/menuDataOptimized.js';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const lang = searchParams.get('lang') || 'en';
    
    // Get menu data which includes CLKR articles
    const menuData = await getAllMenuData(lang);
    
    // Extract CLKR articles and modules
    const clkrArticles = menuData?.clkrServices || [];
    const modules = menuData?.clkrModules || [];
    
    // Return only CLKR data, not the entire menu data
    return new Response(JSON.stringify({
      entries: clkrArticles,
      modules: modules,
      total: clkrArticles.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to fetch CLKR articles',
      entries: [],
      modules: [],
      total: 0
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 