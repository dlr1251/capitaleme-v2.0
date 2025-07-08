import type { APIRoute } from 'astro';
import { syncNotionToAlgolia } from '../../lib/syncNotionToAlgolia.js';

export const GET: APIRoute = async () => {
  try {
    await syncNotionToAlgolia();
    return new Response(JSON.stringify({ message: 'Sync successful' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Sync failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};