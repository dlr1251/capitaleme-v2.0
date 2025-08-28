import { getCollection } from 'astro:content';

export async function getTeamMembers(lang = 'en') {
  try {
    const allAuthors = await getCollection('authors');
    
    if (!allAuthors || allAuthors.length === 0) {
      return [];
    }
    
    const filteredAuthors = allAuthors.filter(author => author.data.lang === lang);
    
    const mappedAuthors = filteredAuthors.map(author => ({
      id: author.id || author.slug || author.data.email || author.data.name, // ensure id exists
      name: author.data.name || author.slug,
      role: author.data.role || '',
      image: author.data.image || '',
      email: author.data.email || '',
      bio: author.data.bio || '',
      socialLinks: author.data.socialLinks || {},
      lang: author.data.lang || 'en',
    }));
    
    return mappedAuthors;
  } catch (error) {
    console.error('Error in getTeamMembers:', error);
    return [];
  }
} 