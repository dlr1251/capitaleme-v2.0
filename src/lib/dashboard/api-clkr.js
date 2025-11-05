import { getAuthToken } from './auth-token.js';

const API_BASE = '/api/dashboard/clkr';

export async function getCLKRArticles(filters = {}) {
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
      throw new Error(error.error || 'Failed to fetch CLKR articles');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function getCLKRArticleById(id) {
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
      throw new Error(error.error || 'Failed to fetch CLKR article');
    }

    const result = await response.json();
    const article = result.data?.[0] || null;
    return { data: article, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function createCLKRArticle(articleData) {
  try {
    console.log('[api-clkr] createCLKRArticle called with:', { title: articleData.title, slug: articleData.slug, published: articleData.published });
    const token = await getAuthToken();
    console.log('[api-clkr] Got auth token, making POST request');
    
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    console.log('[api-clkr] Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = 'Failed to create CLKR article';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        console.error('[api-clkr] API error:', errorMessage);
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        console.error('[api-clkr] Failed to parse error response:', e);
      }
      return { data: null, error: errorMessage };
    }

    const result = await response.json();
    console.log('[api-clkr] CLKR article created successfully:', result.data?.id);
    return { data: result.data, error: null };
  } catch (error) {
    console.error('[api-clkr] Exception creating CLKR article:', error);
    return { data: null, error: error.message || 'Failed to create CLKR article' };
  }
}

export async function updateCLKRArticle(id, articleData) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update CLKR article');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function deleteCLKRArticle(id) {
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
      throw new Error(error.error || 'Failed to delete CLKR article');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function publishCLKRArticle(id) {
  return updateCLKRArticle(id, { published: true });
}

export async function unpublishCLKRArticle(id) {
  return updateCLKRArticle(id, { published: false });
}

export async function archiveCLKRArticle(id) {
  return updateCLKRArticle(id, { archived: true });
}

export async function unarchiveCLKRArticle(id) {
  return updateCLKRArticle(id, { archived: false });
}

