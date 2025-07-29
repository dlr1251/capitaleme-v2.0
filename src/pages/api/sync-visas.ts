import type { APIRoute } from 'astro';
import { syncVisasToSupabase } from '../../server/lib/syncNotionToSupabase.js';

export const POST: APIRoute = async ({ request }) => {
  // Check authorization
  const authHeader = request.headers.get('Authorization');
  const expectedToken = import.meta.env.SYNC_SECRET_TOKEN;
  
  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Unauthorized' 
      }),
      { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    
    const result = await syncVisasToSupabase();
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Visa sync completed successfully',
        result
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Sync failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}; 