export interface SocialSharingOptions {
  title: string;
  description?: string;
  url: string;
  image?: string;
  hashtags?: string[];
  via?: string;
  lang?: 'en' | 'es';
}

export interface SocialSharingUrls {
  facebook: string;
  twitter: string;
  linkedin: string;
  whatsapp: string;
  telegram: string;
  email: string;
  copy: string;
}

export const generateSocialSharingUrls = (options: SocialSharingOptions): SocialSharingUrls => {
  const {
    title,
    description = '',
    url,
    image = '',
    hashtags = [],
    via = 'CapitalMLaw',
    lang = 'en'
  } = options;

  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(url);
  const encodedImage = encodeURIComponent(image);
  const encodedHashtags = hashtags.map(tag => `%23${tag}`).join('');
  const encodedVia = encodeURIComponent(via);

  // Create a comprehensive sharing text
  const sharingText = `${title}${description ? ` - ${description}` : ''} ${url}`;
  const encodedSharingText = encodeURIComponent(sharingText);

  // Facebook sharing with Open Graph optimization
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}&hashtag=${encodedHashtags}`;

  // Twitter/X sharing with enhanced SEO
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=${encodedVia}&hashtags=${encodedHashtags}`;

  // LinkedIn sharing for professional content
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;

  // WhatsApp sharing with rich formatting
  const whatsappText = `*${title}*${description ? `\n\n${description}` : ''}\n\n${url}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  // Telegram sharing
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedSharingText}`;

  // Email sharing with rich content
  const emailSubject = `${title} - Capital M Law`;
  const emailBody = `${lang === 'es' ? 'Hola,\n\nTe comparto este artículo interesante:' : 'Hello,\n\nI wanted to share this interesting article with you:'}\n\n${title}${description ? `\n\n${description}` : ''}\n\n${url}\n\n${lang === 'es' ? 'Saludos,' : 'Best regards,'}\nCapital M Law`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  // Copy to clipboard text (formatted for better readability)
  const copyText = `${title}${description ? `\n${description}` : ''}\n\n${url}\n\n${lang === 'es' ? 'Compartido desde Capital M Law' : 'Shared from Capital M Law'}`;

  return {
    facebook: facebookUrl,
    twitter: twitterUrl,
    linkedin: linkedinUrl,
    whatsapp: whatsappUrl,
    telegram: telegramUrl,
    email: emailUrl,
    copy: copyText
  };
};

export const shareToSocial = async (platform: keyof SocialSharingUrls, options: SocialSharingOptions): Promise<void> => {
  const urls = generateSocialSharingUrls(options);
  
  if (platform === 'copy') {
    try {
      await navigator.clipboard.writeText(urls.copy);
      // You could show a toast notification here
      console.log('Content copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = urls.copy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    return;
  }

  const url = urls[platform];
  if (url) {
    window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  }
};

export const generateOpenGraphTags = (options: SocialSharingOptions): Record<string, string> => {
  const {
    title,
    description = '',
    url,
    image = '',
    lang = 'en'
  } = options;

  return {
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:image': image,
    'og:type': 'article',
    'og:site_name': 'Capital M Law',
    'og:locale': lang === 'es' ? 'es_ES' : 'en_US',
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:url': url,
    'twitter:image': image,
    'twitter:site': '@CapitalMLaw',
    'twitter:creator': '@CapitalMLaw'
  };
};

export const generateSchemaMarkup = (options: SocialSharingOptions): object => {
  const {
    title,
    description = '',
    url,
    image = '',
    lang = 'en'
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    image: image,
    author: {
      '@type': 'Organization',
      name: 'Capital M Law',
      url: 'https://capitaleme.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Capital M Law',
      url: 'https://capitaleme.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://capitaleme.com/logo.png'
      }
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    inLanguage: lang === 'es' ? 'es-ES' : 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };
};
