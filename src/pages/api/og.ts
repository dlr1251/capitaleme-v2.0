import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URLSearchParams(url.search);
  const title = searchParams.get('title') || 'Capital M Law';
  const type = searchParams.get('type') || 'article';
  const lang = searchParams.get('lang') || 'en';
  
  // Create SVG for Open Graph image
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background gradient -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#60a5fa;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e0e7ff;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bgGradient)"/>
      
      <!-- Pattern overlay -->
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1200" height="630" fill="url(#grid)"/>
      
      <!-- Logo area -->
      <circle cx="100" cy="100" r="40" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      <text x="100" y="110" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">CM</text>
      
      <!-- Main content area -->
      <rect x="200" y="80" width="900" height="470" fill="rgba(255,255,255,0.95)" rx="20" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      
      <!-- Type badge -->
      <rect x="230" y="110" width="120" height="35" fill="#1e40af" rx="17.5"/>
      <text x="290" y="132" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
        ${getTypeLabel(type, lang)}
      </text>
      
      <!-- Title -->
      <text x="230" y="200" fill="#1e40af" font-family="Arial, sans-serif" font-size="48" font-weight="bold">
        ${truncateText(title, 50)}
      </text>
      
      <!-- Subtitle -->
      <text x="230" y="250" fill="#64748b" font-family="Arial, sans-serif" font-size="24">
        ${getSubtitle(type, lang)}
      </text>
      
      <!-- Description -->
      <text x="230" y="320" fill="#475569" font-family="Arial, sans-serif" font-size="20" font-weight="300">
        ${getDescription(type, lang)}
      </text>
      
      <!-- Features list -->
      <g transform="translate(230, 380)">
        <circle cx="10" cy="10" r="4" fill="#10b981"/>
        <text x="25" y="15" fill="#374151" font-family="Arial, sans-serif" font-size="18">${getFeature1(type, lang)}</text>
        
        <circle cx="10" cy="40" r="4" fill="#10b981"/>
        <text x="25" y="45" fill="#374151" font-family="Arial, sans-serif" font-size="18">${getFeature2(type, lang)}</text>
        
        <circle cx="10" cy="70" r="4" fill="#10b981"/>
        <text x="25" y="75" fill="#374151" font-family="Arial, sans-serif" font-size="18">${getFeature3(type, lang)}</text>
      </g>
      
      <!-- Bottom branding -->
      <text x="230" y="550" fill="#64748b" font-family="Arial, sans-serif" font-size="18" font-weight="500">
        Capital M Law
      </text>
      <text x="230" y="580" fill="#94a3b8" font-family="Arial, sans-serif" font-size="16">
        ${lang === 'en' ? 'Legal Services for Expats in Colombia' : 'Servicios Legales para Extranjeros en Colombia'}
      </text>
      
      <!-- Website URL -->
      <text x="950" y="580" text-anchor="end" fill="#94a3b8" font-family="Arial, sans-serif" font-size="16">
        capitaleme.com
      </text>
    </svg>
  `;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

// Helper functions
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

function getTypeLabel(type: string, lang: string): string {
  const labels = {
    en: {
      article: 'LEGAL GUIDE',
      guide: 'EXPAT GUIDE',
      clkr: 'CLKR SERVICE',
      visa: 'VISA GUIDE',
      blog: 'EXPAT BLOG'
    },
    es: {
      article: 'GUÍA LEGAL',
      guide: 'GUÍA EXTRANJERO',
      clkr: 'SERVICIO CLKR',
      visa: 'GUÍA VISA',
      blog: 'BLOG EXTRANJERO'
    }
  };
  return labels[lang as keyof typeof labels.en][type as keyof typeof labels.en] || 'LEGAL GUIDE';
}

function getSubtitle(type: string, lang: string): string {
  const subtitles = {
    en: {
      article: 'Expert Legal Advice for Expats',
      guide: 'Complete Guide for Foreigners',
      clkr: 'Professional Legal Services',
      visa: 'Visa Process Made Easy',
      blog: 'Expat Life in Colombia'
    },
    es: {
      article: 'Asesoría Legal Experta para Extranjeros',
      guide: 'Guía Completa para Extranjeros',
      clkr: 'Servicios Legales Profesionales',
      visa: 'Proceso de Visa Simplificado',
      blog: 'Vida de Extranjero en Colombia'
    }
  };
  return subtitles[lang as keyof typeof subtitles.en][type as keyof typeof subtitles.en] || 'Expert Legal Advice';
}

function getDescription(type: string, lang: string): string {
  const descriptions = {
    en: {
      article: 'Comprehensive legal guidance tailored for expats and foreigners living in Colombia',
      guide: 'Step-by-step instructions and expert advice for navigating life in Colombia',
      clkr: 'Professional legal services trusted by hundreds of expats in Colombia',
      visa: 'Complete visa information and expert assistance for your Colombia journey',
      blog: 'Real experiences and practical advice from the expat community in Colombia'
    },
    es: {
      article: 'Orientación legal integral diseñada para extranjeros y expatriados en Colombia',
      guide: 'Instrucciones paso a paso y asesoría experta para navegar la vida en Colombia',
      clkr: 'Servicios legales profesionales confiados por cientos de extranjeros en Colombia',
      visa: 'Información completa de visas y asistencia experta para tu viaje a Colombia',
      blog: 'Experiencias reales y consejos prácticos de la comunidad extranjera en Colombia'
    }
  };
  return descriptions[lang as keyof typeof descriptions.en][type as keyof typeof descriptions.en] || 'Expert legal guidance';
}

function getFeature1(type: string, lang: string): string {
  const features = {
    en: {
      article: 'Bilingual legal support',
      guide: 'Step-by-step guidance',
      clkr: 'Expert legal team',
      visa: 'Complete visa process',
      blog: 'Real expat experiences'
    },
    es: {
      article: 'Soporte legal bilingüe',
      guide: 'Orientación paso a paso',
      clkr: 'Equipo legal experto',
      visa: 'Proceso de visa completo',
      blog: 'Experiencias reales de extranjeros'
    }
  };
  return features[lang as keyof typeof features.en][type as keyof typeof features.en] || 'Bilingual support';
}

function getFeature2(type: string, lang: string): string {
  const features = {
    en: {
      article: 'Colombia-specific expertise',
      guide: 'Local insights included',
      clkr: 'Proven track record',
      visa: 'Expert assistance',
      blog: 'Practical advice'
    },
    es: {
      article: 'Experiencia específica de Colombia',
      guide: 'Perspectivas locales incluidas',
      clkr: 'Historial comprobado',
      visa: 'Asistencia experta',
      blog: 'Consejos prácticos'
    }
  };
  return features[lang as keyof typeof features.en][type as keyof typeof features.en] || 'Colombia expertise';
}

function getFeature3(type: string, lang: string): string {
  const features = {
    en: {
      article: 'Trusted by expats',
      guide: 'Updated regularly',
      clkr: '24/7 support',
      visa: 'Success guaranteed',
      blog: 'Community insights'
    },
    es: {
      article: 'Confiado por extranjeros',
      guide: 'Actualizado regularmente',
      clkr: 'Soporte 24/7',
      visa: 'Éxito garantizado',
      blog: 'Perspectivas de la comunidad'
    }
  };
  return features[lang as keyof typeof features.en][type as keyof typeof features.en] || 'Trusted by expats';
}
