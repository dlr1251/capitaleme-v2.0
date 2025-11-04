export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug) {
    return { valid: false, error: 'Slug is required' };
  }
  
  if (slug.length < 3) {
    return { valid: false, error: 'Slug must be at least 3 characters' };
  }
  
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' };
  }
  
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { valid: false, error: 'Slug cannot start or end with a hyphen' };
  }
  
  return { valid: true };
}

export function validateTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }
  
  if (title.length > 255) {
    return { valid: false, error: 'Title must be less than 255 characters' };
  }
  
  return { valid: true };
}

export function validateLang(lang: string): { valid: boolean; error?: string } {
  if (!lang) {
    return { valid: false, error: 'Language is required' };
  }
  
  if (lang !== 'en' && lang !== 'es') {
    return { valid: false, error: 'Language must be either "en" or "es"' };
  }
  
  return { valid: true };
}

export function validateCountries(countries: string[]): { valid: boolean; error?: string } {
  if (!Array.isArray(countries)) {
    return { valid: false, error: 'Countries must be an array' };
  }
  
  return { valid: true };
}

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim();
}

export function sanitizeTextArea(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim();
}

