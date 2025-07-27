// import React from 'react'; // UNUSED - commenting out
import CoverImage from './CoverImage.jsx';

// Type definitions
interface Properties {
  Nombre?: { title?: { plain_text?: string }[] };
  Description?: { rich_text?: { plain_text?: string }[] };
  Lang?: { select?: { name?: string } };
  Published?: { checkbox?: boolean };
  Slug?: { rich_text?: { plain_text?: string }[] };
}

interface Post {
  properties?: Properties;
  last_edited_time?: string;
  [key: string]: any;
}

interface BlogCardProps {
  post: Post;
  className?: string;
  lang?: 'en' | 'es';
}

const BlogCard = ({ post, className = "", lang = 'en' }: BlogCardProps) => {
  const {
    properties,
    // icon, // UNUSED - commenting out
    last_edited_time,
    // cover, // UNUSED - commenting out
  } = post;

  const title = properties?.Nombre?.title?.[0]?.plain_text || (lang === 'es' ? 'Sin título' : 'Untitled');
  const description = properties?.Description?.rich_text?.[0]?.plain_text || '';
  const postLang = properties?.Lang?.select?.name || 'en';
  const published = properties?.Published?.checkbox || false;

  // Generate slug from title
  const slug = properties?.Slug?.rich_text?.[0]?.plain_text || '';

  // Get relative time
  const getRelativeTime = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return diffInDays === 1 
        ? (lang === 'es' ? 'hace 1 día' : '1 day ago') 
        : (lang === 'es' ? `hace ${diffInDays} días` : `${diffInDays} days ago`);
    } else if (diffInHours > 0) {
      return diffInHours === 1 
        ? (lang === 'es' ? 'hace 1 hora' : '1 hour ago') 
        : (lang === 'es' ? `hace ${diffInHours} horas` : `${diffInHours} hours ago`);
    } else if (diffInMinutes > 0) {
      return diffInMinutes === 1 
        ? (lang === 'es' ? 'hace 1 minuto' : '1 minute ago') 
        : (lang === 'es' ? `hace ${diffInMinutes} minutos` : `${diffInMinutes} minutes ago`);
    } else {
      return lang === 'es' ? 'Ahora mismo' : 'Just now';
    }
  };

  return (
    <article className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 blog-card ${className}`}>
      {/* Cover Image */}
      <CoverImage post={post} />

      {/* Content */}
      <div className="p-6">
        {/* Meta info */}
        <div className="flex items-center justify-between mb-4">
          {postLang && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {postLang}
            </span>
          )}
          <span className="text-xs text-gray-500 font-medium">
            {getRelativeTime(last_edited_time)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          <a href={`/${postLang}/blog/${slug}`} className="block">
            {title}
          </a>
        </h3>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {/* Read more link */}
        <div className="flex items-center justify-between">
          <a
            href={`/${postLang}/blog/${slug}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 group/link"
          >
            {lang === 'es' ? 'Leer más' : 'Read more'}
            <svg
              className="ml-1 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
          
          {!published && (
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              {lang === 'es' ? 'Borrador' : 'Draft'}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard; 