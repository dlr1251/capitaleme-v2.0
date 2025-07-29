import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Import the server-side contentData function
    const { getAllContentData } = await import('../../server/lib/contentData.js');
    
    // Test the function
    const data = await getAllContentData('en');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Server-side contentData working correctly',
      data: {
        clkrServicesCount: data.clkrServices?.length || 0,
        clkrModulesCount: data.clkrModules?.length || 0,
        totalItems: data.totalItems
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error testing server-side contentData:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Error testing server-side contentData',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};