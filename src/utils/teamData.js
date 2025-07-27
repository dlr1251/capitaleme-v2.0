import { getCollection } from 'astro:content';

export async function getTeamMembers(lang = 'en') {
  const allAuthors = await getCollection('authors');
  return allAuthors
    .filter(author => !author.data.lang || author.data.lang === lang)
    .map(author => ({
      id: author.id || author.slug || author.data.email || author.data.name, // ensure id exists
      name: author.data.name || author.slug,
      role: author.data.role || '',
      image: author.data.image || '',
      email: author.data.email || '',
      bio: author.data.bio || '',
      socialLinks: author.data.socialLinks,
      ...author.data,
    }));
} 