// Team data utilities for dynamic team information
import { getCollection } from 'astro:content';

// Get all team members from authors collection
export async function getTeamMembers(lang = 'en') {
  try {
    const authors = await getCollection('authors');
    
    const teamMembers = authors
      .map((author, index) => {
        const imagePath = author.data.image;
        const publicImagePath = `/images/team/${imagePath.split('/').pop()}`;
        
        return {
          id: author.id,
          name: author.data.name,
          role: author.data.role,
          bio: author.data.bio,
          image: publicImagePath,
          linkedin: author.data.linkedin || null,
          email: author.data.email || null,
          order: author.data.order || index + 1
        };
      })
      .sort((a, b) => a.order - b.order);
    
    return teamMembers;
  } catch (error) {
    
    return [];
  }
}

// Get a specific team member by name
export async function getTeamMemberByName(name, lang = 'en') {
  try {
    const authors = await getCollection('authors');
    const author = authors.find(a => 
      a.data.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(a.data.name.toLowerCase())
    );
    
    if (author) {
      return {
        name: author.data.name || '',
        role: author.data.role || '',
        email: author.data.email || '',
        image: `/images/team/${author.data.image || 'default.jpg'}`,
        bio: author.data.bio || '',
        fullBio: author.body || author.data.bio || '',
        socialLinks: author.data.socialLinks || {}
      };
    }
    
    return null;
  } catch (error) {
    
    return null;
  }
}

// Get team members with enhanced information
export async function getEnhancedTeamMembers(lang = 'en') {
  try {
    const authors = await getCollection('authors');
    
    // Sort authors by their filename prefix
    const sortedAuthors = authors.sort((a, b) => {
      const aNum = parseInt(a.id.split('_')[0]);
      const bNum = parseInt(b.id.split('_')[0]);
      return aNum - bNum;
    });

    return sortedAuthors.map(author => {
      // Enhanced bio based on role
      let enhancedBio = author.data.bio || '';
      let fullBio = author.body || author.data.bio || '';
      
      // Add role-specific enhancements
      if (author.data.role && (author.data.role.toLowerCase().includes('abogado') || author.data.role.toLowerCase().includes('attorney'))) {
        enhancedBio += lang === 'en' 
          ? ' Specialized in Colombian legal processes and international client relations.'
          : ' Especializado en procesos legales colombianos y relaciones con clientes internacionales.';
      }
      
      return {
        name: author.data.name || '',
        role: author.data.role || '',
        email: author.data.email || '',
        image: `/images/team/${author.data.image || 'default.jpg'}`,
        bio: enhancedBio,
        fullBio: fullBio || enhancedBio,
        socialLinks: author.data.socialLinks || {},
        specialties: author.data.specialties || [],
        education: author.data.education || '',
        experience: author.data.experience || ''
      };
    });
  } catch (error) {
    
    return [];
  }
} 