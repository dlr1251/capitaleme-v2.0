// SEO utilities for expats and foreigners in Colombia
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonicalUrl?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  readingTime?: number;
  lang: 'en' | 'es';
  type: 'article' | 'guide' | 'clkr' | 'visa' | 'blog';
}

// Target keywords for expats and foreigners in Colombia
const EXPAT_KEYWORDS = {
  en: [
    'expat Colombia',
    'foreigner Colombia',
    'living in Colombia',
    'Colombia visa',
    'Colombia immigration',
    'Colombia legal services',
    'expat legal advice Colombia',
    'foreigner legal help Colombia',
    'Colombia residency',
    'Colombia citizenship',
    'Colombia real estate',
    'Colombia business',
    'Medellin expat',
    'Bogota expat',
    'Cartagena expat',
    'Colombia expat community',
    'Colombia foreign investment',
    'Colombia tax advice',
    'Colombia property law',
    'Colombia immigration lawyer'
  ],
  es: [
    'extranjero Colombia',
    'expatriado Colombia',
    'vivir en Colombia',
    'visa Colombia',
    'inmigración Colombia',
    'servicios legales Colombia',
    'asesoría legal extranjeros Colombia',
    'ayuda legal extranjeros Colombia',
    'residencia Colombia',
    'ciudadanía Colombia',
    'bienes raíces Colombia',
    'negocios Colombia',
    'extranjero Medellín',
    'extranjero Bogotá',
    'extranjero Cartagena',
    'comunidad extranjeros Colombia',
    'inversión extranjera Colombia',
    'asesoría fiscal Colombia',
    'derecho inmobiliario Colombia',
    'abogado inmigración Colombia'
  ]
};

// Generate SEO-optimized title
export function generateSEOTitle(
  baseTitle: string, 
  type: SEOData['type'], 
  lang: 'en' | 'es'
): string {
  const suffixes = {
    en: {
      article: ' | Legal Guide for Expats in Colombia',
      guide: ' | Expat Guide Colombia',
      clkr: ' | CLKR Legal Services Colombia',
      visa: ' | Colombia Visa for Expats',
      blog: ' | Expat Life Colombia'
    },
    es: {
      article: ' | Guía Legal para Extranjeros en Colombia',
      guide: ' | Guía para Extranjeros Colombia',
      clkr: ' | Servicios Legales CLKR Colombia',
      visa: ' | Visa Colombia para Extranjeros',
      blog: ' | Vida de Extranjero Colombia'
    }
  };

  const suffix = suffixes[lang][type];
  const maxLength = 60; // Optimal for SEO
  const titleWithSuffix = `${baseTitle}${suffix}`;
  
  return titleWithSuffix.length > maxLength 
    ? `${baseTitle} | ${lang === 'en' ? 'Expat Colombia' : 'Extranjero Colombia'}`
    : titleWithSuffix;
}

// Generate SEO-optimized description
export function generateSEODescription(
  content: string,
  type: SEOData['type'],
  lang: 'en' | 'es',
  customDescription?: string
): string {
  if (customDescription) {
    return customDescription.length > 160 
      ? customDescription.substring(0, 157) + '...'
      : customDescription;
  }

  const templates = {
    en: {
      article: 'Complete legal guide for expats and foreigners in Colombia. Expert advice on {topic}. Get professional legal assistance for your life in Colombia.',
      guide: 'Step-by-step guide for expats in Colombia. Learn everything about {topic} as a foreigner living in Colombia. Expert legal advice included.',
      clkr: 'Professional legal services for expats in Colombia. Expert assistance with {topic}. Trusted by hundreds of foreigners in Colombia.',
      visa: 'Complete visa guide for foreigners in Colombia. Learn about {topic} visa requirements, process, and expert legal assistance.',
      blog: 'Expat life in Colombia: {topic}. Real experiences, practical advice, and legal insights for foreigners living in Colombia.'
    },
    es: {
      article: 'Guía legal completa para extranjeros y expatriados en Colombia. Asesoría experta sobre {topic}. Obtén asistencia legal profesional para tu vida en Colombia.',
      guide: 'Guía paso a paso para extranjeros en Colombia. Aprende todo sobre {topic} como extranjero viviendo en Colombia. Incluye asesoría legal experta.',
      clkr: 'Servicios legales profesionales para extranjeros en Colombia. Asistencia experta con {topic}. Confiado por cientos de extranjeros en Colombia.',
      visa: 'Guía completa de visas para extranjeros en Colombia. Aprende sobre requisitos, proceso y asistencia legal experta para {topic}.',
      blog: 'Vida de extranjero en Colombia: {topic}. Experiencias reales, consejos prácticos e información legal para extranjeros viviendo en Colombia.'
    }
  };

  const template = templates[lang][type];
  const topic = extractTopicFromContent(content);
  const description = template.replace('{topic}', topic);
  
  return description.length > 160 
    ? description.substring(0, 157) + '...'
    : description;
}

// Extract topic from content for better SEO
function extractTopicFromContent(content: string): string {
  // Simple topic extraction - can be enhanced
  const sentences = content.split(/[.!?]/).slice(0, 3);
  const firstSentence = sentences[0]?.trim();
  
  if (!firstSentence) return 'legal matters';
  
  // Clean up and limit length
  const topic = firstSentence
    .replace(/^#+\s*/, '') // Remove markdown headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*([^*]+)\*/g, '$1'); // Remove italic formatting
  
  return topic.length > 50 ? topic.substring(0, 47) + '...' : topic;
}

// Generate targeted keywords
export function generateKeywords(
  baseKeywords: string[],
  type: SEOData['type'],
  lang: 'en' | 'es',
  additionalTopics?: string[]
): string[] {
  const baseExpatKeywords = EXPAT_KEYWORDS[lang];
  const typeSpecificKeywords = getTypeSpecificKeywords(type, lang);
  
  const allKeywords = [
    ...baseKeywords,
    ...baseExpatKeywords.slice(0, 8), // Top 8 expat keywords
    ...typeSpecificKeywords,
    ...(additionalTopics || [])
  ];

  // Remove duplicates and limit to 15 keywords for optimal SEO
  return [...new Set(allKeywords)].slice(0, 15);
}

// Get type-specific keywords
function getTypeSpecificKeywords(type: SEOData['type'], lang: 'en' | 'es'): string[] {
  const keywords = {
    en: {
      article: ['legal advice Colombia', 'expat legal help', 'Colombia law'],
      guide: ['expat guide Colombia', 'foreigner guide', 'Colombia living guide'],
      clkr: ['CLKR legal services', 'Colombia legal firm', 'expat lawyer Colombia'],
      visa: ['Colombia visa process', 'immigration Colombia', 'visa requirements'],
      blog: ['expat life Colombia', 'foreigner experience', 'Colombia lifestyle']
    },
    es: {
      article: ['asesoría legal Colombia', 'ayuda legal extranjeros', 'derecho Colombia'],
      guide: ['guía extranjero Colombia', 'guía extranjero', 'guía vivir Colombia'],
      clkr: ['servicios legales CLKR', 'firma legal Colombia', 'abogado extranjeros Colombia'],
      visa: ['proceso visa Colombia', 'inmigración Colombia', 'requisitos visa'],
      blog: ['vida extranjero Colombia', 'experiencia extranjero', 'estilo vida Colombia']
    }
  };

  return keywords[lang][type];
}

// Generate Open Graph data
export function generateOpenGraphData(seoData: SEOData): {
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogImage: string;
  ogUrl: string;
  ogSiteName: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
} {
  const baseUrl = 'https://capitaleme.com';
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(seoData.title)}&type=${seoData.type}&lang=${seoData.lang}`;
  
  return {
    ogTitle: seoData.ogTitle || seoData.title,
    ogDescription: seoData.ogDescription || seoData.description,
    ogType: 'article',
    ogImage,
    ogUrl: seoData.canonicalUrl || baseUrl,
    ogSiteName: seoData.lang === 'en' ? 'Capital M Law - Legal Services for Expats in Colombia' : 'Capital M Law - Servicios Legales para Extranjeros en Colombia',
    twitterCard: 'summary_large_image',
    twitterTitle: seoData.twitterTitle || seoData.title,
    twitterDescription: seoData.twitterDescription || seoData.description,
    twitterImage: ogImage
  };
}

// Generate structured data (JSON-LD)
export function generateStructuredData(seoData: SEOData, content?: string): object {
  const baseUrl = 'https://capitaleme.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seoData.title,
    description: seoData.description,
    image: `${baseUrl}/api/og?title=${encodeURIComponent(seoData.title)}&type=${seoData.type}&lang=${seoData.lang}`,
    author: {
      '@type': 'Organization',
      name: 'Capital M Law',
      url: baseUrl,
      logo: `${baseUrl}/icons/logo.png`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Capital M Law',
      url: baseUrl,
      logo: `${baseUrl}/icons/logo.png`
    },
    datePublished: seoData.publishedTime,
    dateModified: seoData.modifiedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': seoData.canonicalUrl || baseUrl
    },
    keywords: seoData.keywords.join(', '),
    inLanguage: seoData.lang,
    about: {
      '@type': 'Thing',
      name: seoData.lang === 'en' ? 'Legal Services for Expats in Colombia' : 'Servicios Legales para Extranjeros en Colombia'
    },
    audience: {
      '@type': 'Audience',
      audienceType: seoData.lang === 'en' ? 'Expats and Foreigners in Colombia' : 'Extranjeros y Expatriados en Colombia'
    },
    ...(content && {
      articleBody: content.substring(0, 500) + '...'
    })
  };
}

// Generate canonical URL
export function generateCanonicalUrl(pathname: string, lang: 'en' | 'es'): string {
  const baseUrl = 'https://capitaleme.com';
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${baseUrl}${cleanPath}`;
}

// Generate sitemap priority based on content type
export function getSitemapPriority(type: SEOData['type']): number {
  const priorities = {
    article: 0.8,
    guide: 0.9,
    clkr: 0.9,
    visa: 0.8,
    blog: 0.7
  };
  return priorities[type];
}

// Generate change frequency for sitemap
export function getChangeFrequency(type: SEOData['type']): string {
  const frequencies = {
    article: 'monthly',
    guide: 'monthly',
    clkr: 'weekly',
    visa: 'monthly',
    blog: 'weekly'
  };
  return frequencies[type];
}
