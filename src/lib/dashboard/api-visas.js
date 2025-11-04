import { getAuthToken } from './auth-token.js';

const API_BASE = '/api/dashboard/visas';

export async function getVisas(filters = {}) {
  try {
    console.log('[api-visas] ========== GETTING VISAS FROM SUPABASE ==========');
    console.log('[api-visas] getVisas called with filters:', filters);
    console.log('[api-visas] This will fetch from Supabase "visas" table');
    const token = await getAuthToken();
    const params = new URLSearchParams();
    
    if (filters.lang) params.append('lang', filters.lang);
    if (filters.published !== undefined) params.append('published', filters.published.toString());
    if (filters.archived !== undefined) params.append('archived', filters.archived.toString());
    
    const url = `${API_BASE}${params.toString() ? '?' + params.toString() : ''}`;
    console.log('[api-visas] Fetching from URL:', url);
    console.log('[api-visas] This endpoint queries Supabase table: "visas"');
    
    console.log('[api-visas] Making fetch request to:', url);
    const fetchStartTime = Date.now();
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const fetchElapsed = Date.now() - fetchStartTime;
    console.log('[api-visas] Fetch completed in', fetchElapsed, 'ms');
    console.log('[api-visas] Response status:', response.status, response.statusText);
    console.log('[api-visas] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        const text = await response.text();
        console.error('[api-visas] Failed to parse error response, raw text:', text);
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      console.error('[api-visas] API error response:', errorData);
      throw new Error(errorData.error || `Failed to fetch visas: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('[api-visas] Response parsed successfully');
    console.log('[api-visas] ========== DATA FROM SUPABASE "visas" TABLE ==========');
    console.log('[api-visas] Response data structure:', {
      hasData: !!result.data,
      dataIsArray: Array.isArray(result.data),
      dataLength: result.data?.length || 0,
      dataType: typeof result.data,
      keys: result.data ? Object.keys(result.data).slice(0, 5) : [],
      firstItem: result.data?.[0] ? {
        id: result.data[0].id,
        title: result.data[0].title,
        archived: result.data[0].archived,
        published: result.data[0].published,
        lang: result.data[0].lang,
        table: 'visas (from Supabase)',
      } : null,
    });
    console.log('[api-visas] Total visas returned from Supabase "visas" table:', result.data?.length || 0);
    console.log('[api-visas] =====================================================');
    
    return { data: result.data, error: null };
  } catch (error) {
    console.error('[api-visas] Exception:', error);
    return { data: null, error: error.message };
  }
}

export async function getVisaById(id) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}?id=${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch visa');
    }

    const result = await response.json();
    // The API returns an array with single item when id is provided
    const visa = result.data?.[0] || null;
    return { data: visa, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function createVisa(visaData) {
  try {
    const token = await getAuthToken();
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visaData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create visa');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function updateVisa(id, visaData) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visaData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update visa');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function deleteVisa(id) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete visa');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function publishVisa(id) {
  return updateVisa(id, { published: true });
}

export async function unpublishVisa(id) {
  return updateVisa(id, { published: false });
}

export async function archiveVisa(id) {
  return updateVisa(id, { archived: true });
}

export async function unarchiveVisa(id) {
  return updateVisa(id, { archived: false });
}

