import { getCollection } from 'astro:content';

export async function getAuthorsByLanguage(lang: 'en' | 'es' = 'en') {
  try {
    const allAuthors = await getCollection('authors');
    return allAuthors.filter(author => author.data.lang === lang);
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

export async function getAllAuthors() {
  try {
    return await getCollection('authors');
  } catch (error) {
    console.error('Error fetching all authors:', error);
    return [];
  }
}

export async function getAuthorBySlug(slug: string, lang?: 'en' | 'es') {
  try {
    const allAuthors = await getCollection('authors');
    if (lang) {
      return allAuthors.find(author => 
        author.slug === slug && author.data.lang === lang
      );
    }
    return allAuthors.find(author => author.slug === slug);
  } catch (error) {
    console.error('Error fetching author by slug:', error);
    return undefined;
  }
}
