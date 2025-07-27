// Global declaration for supabase
declare global {
  var supabase: any;
}

// Import supabase with type assertion
const supabase = (await import('./supabase.js')).supabase as any;

// Static fallback blog posts
const STATIC_BLOG_POSTS = {
  en: [
    {
      id: 'counting-your-days',
      title: 'Counting Your Days',
      slug: 'counting-your-days',
      description: 'Understanding Colombian immigration time limits',
      content: 'Content about counting days for Colombian immigration...',
      category: 'Immigration',
      image: '/blog/counting-your-days/img-1.webp',
      lang: 'en',
      published: true,
      featured: true,
      author: 'Daniel Luque',
      pub_date: '2024-01-15',
      last_edited: '2024-01-20',
      reading_time: 5,
      tags: ['immigration', 'colombia', 'visa'],
      notion_id: null,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    {
      id: 'dnv-confusion',
      title: 'DNV Confusion',
      slug: 'dnv-confusion',
      description: 'Decoding Colombia\'s Digital Nomad Visa requirements',
      content: 'Content about DNV confusion...',
      category: 'Visa',
      image: '/blog/dnv-confusion/img-1.webp',
      lang: 'en',
      published: true,
      featured: true,
      author: 'María Fernanda Duarte',
      pub_date: '2024-01-12',
      last_edited: '2024-01-18',
      reading_time: 4,
      tags: ['dnv', 'digital-nomad', 'visa'],
      notion_id: null,
      created_at: '2024-01-12T00:00:00Z',
      updated_at: '2024-01-18T00:00:00Z'
    },
    {
      id: 'gringo-prices',
      title: 'On Gringo Prices',
      slug: 'gringo-prices',
      description: 'Understanding cost differences in Colombia',
      content: 'Content about gringo prices...',
      category: 'Lifestyle',
      image: '/blog/gringo-prices/img-1.webp',
      lang: 'en',
      published: true,
      featured: false,
      author: 'Mateo Martínez',
      pub_date: '2024-01-10',
      last_edited: '2024-01-16',
      reading_time: 6,
      tags: ['lifestyle', 'costs', 'colombia'],
      notion_id: null,
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-16T00:00:00Z'
    },
    {
      id: 'apostille',
      title: 'Apostille Services Guide',
      slug: 'apostille',
      description: 'Complete guide to apostille services in Colombia',
      content: 'Content about apostille services...',
      category: 'Legal',
      image: '/blog/apostille/img-1.webp',
      lang: 'en',
      published: true,
      featured: false,
      author: 'Daniel Luque',
      pub_date: '2024-01-08',
      last_edited: '2024-01-14',
      reading_time: 7,
      tags: ['apostille', 'legal', 'documents'],
      notion_id: null,
      created_at: '2024-01-08T00:00:00Z',
      updated_at: '2024-01-14T00:00:00Z'
    }
  ],
  es: [
    {
      id: 'counting-your-days',
      title: 'Contando Tus Días',
      slug: 'counting-your-days',
      description: 'Entendiendo los límites de tiempo de inmigración colombiana',
      content: 'Contenido sobre contar días para inmigración colombiana...',
      category: 'Inmigración',
      image: '/blog/counting-your-days/img-1.webp',
      lang: 'es',
      published: true,
      featured: true,
      author: 'Daniel Luque',
      pub_date: '2024-01-15',
      last_edited: '2024-01-20',
      reading_time: 5,
      tags: ['inmigración', 'colombia', 'visa'],
      notion_id: null,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    {
      id: 'dnv-confusion',
      title: 'Confusión DNV',
      slug: 'dnv-confusion',
      description: 'Descifrando los requisitos de la Visa de Nómada Digital',
      content: 'Contenido sobre confusión DNV...',
      category: 'Visa',
      image: '/blog/dnv-confusion/img-1.webp',
      lang: 'es',
      published: true,
      featured: true,
      author: 'María Fernanda Duarte',
      pub_date: '2024-01-12',
      last_edited: '2024-01-18',
      reading_time: 4,
      tags: ['dnv', 'nómada-digital', 'visa'],
      notion_id: null,
      created_at: '2024-01-12T00:00:00Z',
      updated_at: '2024-01-18T00:00:00Z'
    },
    {
      id: 'gringo-prices',
      title: 'Sobre Precios Gringo',
      slug: 'gringo-prices',
      description: 'Entendiendo las diferencias de costo en Colombia',
      content: 'Contenido sobre precios gringo...',
      category: 'Estilo de Vida',
      image: '/blog/gringo-prices/img-1.webp',
      lang: 'es',
      published: true,
      featured: false,
      author: 'Mateo Martínez',
      pub_date: '2024-01-10',
      last_edited: '2024-01-16',
      reading_time: 6,
      tags: ['estilo-de-vida', 'costos', 'colombia'],
      notion_id: null,
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-16T00:00:00Z'
    },
    {
      id: 'apostille',
      title: 'Guía de Servicios de Apostilla',
      slug: 'apostille',
      description: 'Guía completa de servicios de apostilla en Colombia',
      content: 'Contenido sobre servicios de apostilla...',
      category: 'Legal',
      image: '/blog/apostille/img-1.webp',
      lang: 'es',
      published: true,
      featured: false,
      author: 'Daniel Luque',
      pub_date: '2024-01-08',
      last_edited: '2024-01-14',
      reading_time: 7,
      tags: ['apostilla', 'legal', 'documentos'],
      notion_id: null,
      created_at: '2024-01-08T00:00:00Z',
      updated_at: '2024-01-14T00:00:00Z'
    }
  ]
};

// Blog post interface
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  image: string;
  lang: string;
  published: boolean;
  featured: boolean;
  author: string;
  pub_date: string;
  last_edited: string;
  reading_time?: number;
  tags?: string[];
  notion_id?: string;
  created_at: string;
  updated_at: string;
}

// Options interface for blog post queries
interface BlogPostOptions {
  limit?: number;
  featured?: boolean;
  category?: string | null;
  published?: boolean;
}

// Fetch blog posts from Supabase
export async function getBlogPostsFromSupabase(lang = 'en', options: BlogPostOptions = {}) {
  const {
    limit = 50,
    featured = false,
    category = null,
    published = true
  } = options;

  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('lang', lang)
      .eq('published', published);

    if (featured) {
      query = query.eq('featured', true);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query.order('pub_date', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }

    // If no data from Supabase, use static fallback
    if (!data || data.length === 0) {
      console.log('No blog posts from Supabase, using static fallback');
      let staticPosts = STATIC_BLOG_POSTS[lang as keyof typeof STATIC_BLOG_POSTS] || [];
      
      if (featured) {
        staticPosts = staticPosts.filter(post => post.featured);
      }
      
      if (category) {
        staticPosts = staticPosts.filter(post => post.category === category);
      }
      
      if (limit) {
        staticPosts = staticPosts.slice(0, limit);
      }
      
      return staticPosts;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBlogPostsFromSupabase:', error);
    // Return static fallback on error
    let staticPosts = STATIC_BLOG_POSTS[lang as keyof typeof STATIC_BLOG_POSTS] || [];
    
    if (featured) {
      staticPosts = staticPosts.filter(post => post.featured);
    }
    
    if (category) {
      staticPosts = staticPosts.filter(post => post.category === category);
    }
    
    if (limit) {
      staticPosts = staticPosts.slice(0, limit);
    }
    
    return staticPosts;
  }
}

// Fetch latest blog posts
export async function getLatestBlogPosts(lang = 'en', limit = 10) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('lang', lang)
      .eq('published', true)
      .order('pub_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching latest blog posts:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getLatestBlogPosts:', error);
    return [];
  }
}

// Fetch featured blog posts
export async function getFeaturedBlogPosts(lang = 'en', limit = 5) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('lang', lang)
      .eq('published', true)
      .eq('featured', true)
      .order('pub_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured blog posts:', error);
      throw error;
    }

    // If no data from Supabase, use static fallback
    if (!data || data.length === 0) {
      console.log('No featured blog posts from Supabase, using static fallback');
      const staticPosts = STATIC_BLOG_POSTS[lang as keyof typeof STATIC_BLOG_POSTS] || [];
      return staticPosts.filter(post => post.featured).slice(0, limit);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFeaturedBlogPosts:', error);
    // Return static fallback on error
    const staticPosts = STATIC_BLOG_POSTS[lang as keyof typeof STATIC_BLOG_POSTS] || [];
    return staticPosts.filter(post => post.featured).slice(0, limit);
  }
}

// Fetch blog post by slug
export async function getBlogPostBySlug(slug: string, lang = 'en') {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('lang', lang)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching blog post by slug:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getBlogPostBySlug:', error);
    // Try to find in static fallback
    const staticPosts = STATIC_BLOG_POSTS[lang as keyof typeof STATIC_BLOG_POSTS] || [];
    const staticPost = staticPosts.find(post => post.slug === slug);
    return staticPost || null;
  }
}

// Fetch blog categories
export async function getBlogCategories(lang = 'en') {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('lang', lang)
      .eq('published', true)
      .not('category', 'is', null);

    if (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }

    const categories = Array.from(new Set(data?.map((item: any) => item.category).filter(Boolean)));
    
    // If no categories from Supabase, use static fallback
    if (!categories || categories.length === 0) {
      console.log('No blog categories from Supabase, using static fallback');
      const staticPosts = STATIC_BLOG_POSTS[lang as keyof typeof STATIC_BLOG_POSTS] || [];
      return Array.from(new Set(staticPosts.map(post => post.category).filter(Boolean)));
    }
    
    return categories;
  } catch (error) {
    console.error('Error in getBlogCategories:', error);
    // Return static fallback on error
    const staticPosts = STATIC_BLOG_POSTS[lang as keyof typeof STATIC_BLOG_POSTS] || [];
    return Array.from(new Set(staticPosts.map(post => post.category).filter(Boolean)));
  }
}

// Get relative time string
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  } else if (diffInHours > 0) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  } else if (diffInMinutes > 0) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  } else {
    return 'Just now';
  }
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Get category styling
export function getCategoryStyling(category: string) {
  const categoryLower = category?.toLowerCase() || '';
  
  if (categoryLower.includes('immigration') || categoryLower.includes('visa')) {
    return {
      gradient: 'from-blue-500 to-indigo-600',
      icon: '🛂',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    };
  } else if (categoryLower.includes('business') || categoryLower.includes('company')) {
    return {
      gradient: 'from-green-500 to-emerald-600',
      icon: '💼',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    };
  } else if (categoryLower.includes('lifestyle') || categoryLower.includes('life')) {
    return {
      gradient: 'from-purple-500 to-pink-600',
      icon: '🏠',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    };
  } else if (categoryLower.includes('legal') || categoryLower.includes('law')) {
    return {
      gradient: 'from-orange-500 to-red-600',
      icon: '⚖️',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200'
    };
  } else if (categoryLower.includes('tax') || categoryLower.includes('finance')) {
    return {
      gradient: 'from-teal-500 to-cyan-600',
      icon: '💰',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-200'
    };
  } else {
    return {
      gradient: 'from-slate-500 to-gray-600',
      icon: '📄',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-200'
    };
  }
}

// Generate gradient based on text
export function generateGradient(text: string): string {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-400 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-orange-400 to-red-500',
    'from-teal-400 to-blue-500',
    'from-indigo-500 to-purple-600',
    'from-pink-400 to-red-500',
    'from-yellow-400 to-orange-500'
  ];
  
  const hash = text.split('').reduce((a: number, b: string) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
} 