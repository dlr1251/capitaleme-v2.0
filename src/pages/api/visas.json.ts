import type { APIRoute } from 'astro';
import { fetchAllVisas } from '../../scripts/fetchNotionVisasToJson.ts';

export const GET: APIRoute = async () => {
  try {
    const visas = await fetchAllVisas();
    return new Response(JSON.stringify(visas), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch visas', details: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 