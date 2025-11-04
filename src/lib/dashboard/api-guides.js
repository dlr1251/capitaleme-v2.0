import { getAuthToken } from './auth-token.js';

const API_BASE = '/api/dashboard/guides';

export async function getGuides(filters = {}) {
  try {
    const token = await getAuthToken();
    const params = new URLSearchParams();
    
    if (filters.lang) params.append('lang', filters.lang);
    if (filters.published !== undefined) params.append('published', filters.published.toString());
    if (filters.archived !== undefined) params.append('archived', filters.archived.toString());
    
    const url = `${API_BASE}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch guides');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function getGuideById(id) {
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
      throw new Error(error.error || 'Failed to fetch guide');
    }

    const result = await response.json();
    return { data: result.data?.[0] || null, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function createGuide(guideData) {
  try {
    const token = await getAuthToken();
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guideData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create guide');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function updateGuide(id, guideData) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guideData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update guide');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function deleteGuide(id) {
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
      throw new Error(error.error || 'Failed to delete guide');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function publishGuide(id) {
  return updateGuide(id, { published: true });
}

export async function unpublishGuide(id) {
  return updateGuide(id, { published: false });
}

export async function archiveGuide(id) {
  return updateGuide(id, { archived: true });
}

export async function unarchiveGuide(id) {
  return updateGuide(id, { archived: false });
}

