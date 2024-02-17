import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const placeId = 'ChIJcYiJq-kpRI4R1daaSuAwIz8';
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY; // Ensure your API key is stored securely in .env

  if (!apiKey) {
    return new Response("Google Places API key is not defined in the environment variables.", { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

  try {
    const response = await fetch(url);

    // First, check if the response is OK and Content-Type is application/json
    
    if (!response.ok) {
      console.error('Failed to fetch:', response.statusText);
      return new Response('Error fetching reviews due to non-OK response from the API.', { status: response.status });
    }

    if (!response.headers.get("Content-Type")?.includes("application/json")) {
      console.error('Non-JSON response received:', await response.text());
      return new Response('Error fetching reviews due to unexpected response format.', { status: 500 });
    }

    // Once checks are passed, parse the JSON
    const data = await response.json();

    if (data.result?.reviews) {
      return new Response(JSON.stringify(data.result.reviews), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      console.error('Reviews not found in the response');
      return new Response('Reviews not found in the API response.', { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch reviews' }), { status: 500 });
  }
};
