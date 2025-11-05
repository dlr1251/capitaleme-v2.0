import { getAuthToken } from './auth-token.js';

const API_BASE = '/api/dashboard/blog';

export async function getBlogPosts(filters = {}) {
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
      throw new Error(error.error || 'Failed to fetch blog posts');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function getBlogPostById(id) {
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
      throw new Error(error.error || 'Failed to fetch blog post');
    }

    const result = await response.json();
    const post = result.data?.[0] || null;
    return { data: post, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function createBlogPost(postData) {
  try {
    console.log('[api-blog] createBlogPost called with:', { title: postData.title, slug: postData.slug, published: postData.published });
    const token = await getAuthToken();
    console.log('[api-blog] Got auth token, making POST request');
    
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    console.log('[api-blog] Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = 'Failed to create blog post';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        console.error('[api-blog] API error:', errorMessage);
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        console.error('[api-blog] Failed to parse error response:', e);
      }
      return { data: null, error: errorMessage };
    }

    const result = await response.json();
    console.log('[api-blog] Blog post created successfully:', result.data?.id);
    return { data: result.data, error: null };
  } catch (error) {
    console.error('[api-blog] Exception creating blog post:', error);
    return { data: null, error: error.message || 'Failed to create blog post' };
  }
}

export async function updateBlogPost(id, postData) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update blog post');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function deleteBlogPost(id) {
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
      throw new Error(error.error || 'Failed to delete blog post');
    }

    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function publishBlogPost(id) {
  return updateBlogPost(id, { published: true });
}

export async function unpublishBlogPost(id) {
  return updateBlogPost(id, { published: false });
}

export async function archiveBlogPost(id) {
  return updateBlogPost(id, { archived: true });
}

export async function unarchiveBlogPost(id) {
  return updateBlogPost(id, { archived: false });
}

