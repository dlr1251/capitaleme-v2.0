import type { APIRoute } from 'astro';
import { clearMenuDataCache } from '../../utils/menuDataOptimized.js';

export const GET: APIRoute = async () => {
  try {
    clearMenuDataCache();
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Cache cleared successfully' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 