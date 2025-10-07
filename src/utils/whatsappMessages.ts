/**
 * Utility functions for generating WhatsApp messages based on page context
 */

export type PageType = 'home' | 'clkr' | 'visa' | 'blog' | 'guide' | 'contact' | 'about' | 'real-estate';

/**
 * Determines the page type based on the current pathname
 */
export function getPageTypeFromPathname(pathname: string): PageType {
  if (pathname === '/' || pathname === '/en' || pathname === '/es') {
    return 'home';
  }
  
  if (pathname.includes('/clkr')) {
    return 'clkr';
  }
  
  if (pathname.includes('/visa')) {
    return 'visa';
  }
  
  if (pathname.includes('/blog')) {
    return 'blog';
  }
  
  if (pathname.includes('/guide')) {
    return 'guide';
  }
  
  if (pathname.includes('/real-estate')) {
    return 'real-estate';
  }
  
  if (pathname.includes('/contact')) {
    return 'contact';
  }
  
  if (pathname.includes('/about')) {
    return 'about';
  }
  
  return 'home'; // default fallback
}

/**
 * Extracts category information from pathname for visa pages
 */
export function getVisaCategoryFromPathname(pathname: string): string {
  const visaMatch = pathname.match(/\/visa[s]?\/([^\/]+)/);
  if (visaMatch) {
    const category = visaMatch[1];
    // Convert URL-friendly format to readable format
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  return '';
}

/**
 * Generates a WhatsApp message based on page context
 */
export function generateWhatsAppMessage(
  pageType: PageType,
  pageTitle: string,
  category: string = '',
  lang: 'en' | 'es' = 'en'
): string {
  const baseMessage = lang === 'es' 
    ? 'Hola Capital M Team, estuve visitando su sitio web'
    : 'Hello Capital M Team, I was visiting your website';

  switch (pageType) {
    case 'home':
      return lang === 'es'
        ? 'Hola Capital M Team, estuve visitando su sitio web y tengo preguntas sobre sus servicios'
        : 'Hello Capital M Team, I was visiting your website and have questions on your services';
    
    case 'clkr':
      return lang === 'es'
        ? `Hola Capital M Team, estuve leyendo su artículo sobre "${pageTitle}" y tengo algunas preguntas al respecto`
        : `Hello Capital M Team, I was reading your article on "${pageTitle}" and have some questions about it`;
    
    case 'visa':
      const visaCategory = category || pageTitle;
      return lang === 'es'
        ? `Hola Capital M Team, estuve leyendo sobre ${visaCategory} y me gustaría hablar con ustedes`
        : `Hello Capital M Team, I was reading on the ${visaCategory} and would like to talk with you`;
    
    case 'blog':
      return lang === 'es'
        ? `Hola Capital M Team, estuve leyendo su artículo "${pageTitle}" y tengo algunas preguntas`
        : `Hello Capital M Team, I was reading your article "${pageTitle}" and have some questions`;
    
    case 'guide':
      return lang === 'es'
        ? `Hola Capital M Team, estuve leyendo su guía "${pageTitle}" y necesito más información`
        : `Hello Capital M Team, I was reading your guide "${pageTitle}" and need more information`;
    
    case 'real-estate':
      return lang === 'es'
        ? `Hola Capital M Team, estuve viendo la propiedad "${pageTitle}" y me interesa conocer más`
        : `Hello Capital M Team, I was viewing the property "${pageTitle}" and I'm interested in learning more`;
    
    case 'contact':
      return lang === 'es'
        ? 'Hola Capital M Team, me gustaría contactarlos para más información sobre sus servicios'
        : 'Hello Capital M Team, I would like to contact you for more information about your services';
    
    case 'about':
      return lang === 'es'
        ? 'Hola Capital M Team, estuve leyendo sobre ustedes y me gustaría conocer más sobre sus servicios'
        : 'Hello Capital M Team, I was reading about you and would like to learn more about your services';
    
    default:
      return lang === 'es'
        ? 'Hola Capital M Team, tengo preguntas sobre sus servicios'
        : 'Hello Capital M Team, I have questions about your services';
  }
}

/**
 * Gets WhatsApp button props based on current page context
 */
export function getWhatsAppButtonProps(
  pathname: string,
  pageTitle: string = '',
  lang: 'en' | 'es' = 'en',
  customMessage?: string
) {
  const pageType = getPageTypeFromPathname(pathname);
  let category = '';
  
  if (pageType === 'visa') {
    category = getVisaCategoryFromPathname(pathname);
  }
  
  const message = customMessage || generateWhatsAppMessage(pageType, pageTitle, category, lang);
  
  return {
    message,
    lang,
    pageType,
    pageTitle,
    category
  };
}
