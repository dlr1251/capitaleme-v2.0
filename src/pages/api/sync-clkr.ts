import type { APIRoute } from 'astro';
import { syncCLKRToSupabase } from '../../lib/syncNotionToSupabase.js';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'CLKR Sync API',
    description: 'This endpoint accepts POST requests only',
    usage: 'Send a POST request with Authorization: Bearer <token> header',
    methods: ['POST']
  }), {
    status: 405,
    headers: { 
      'Content-Type': 'application/json',
      'Allow': 'POST'
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check for authorization (you can add your own auth logic here)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    // Add your token validation here
    // if (token !== process.env.SYNC_SECRET_TOKEN) {
    //   return new Response(JSON.stringify({ error: 'Invalid token' }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    
    const result = await syncCLKRToSupabase();

    return new Response(JSON.stringify({
      success: true,
      message: 'CLKR sync completed successfully',
      result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 