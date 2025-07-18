// React import removed - not needed in React 17+
import CoverImage from './CoverImage.tsx';

export interface BlogPost {
  id: string;
  properties?: {
    Nombre?: { title?: { plain_text?: string }[] };
    Description?: { rich_text?: { plain_text?: string }[] };
    Lang?: { select?: { name?: string } };
    Published?: { checkbox?: boolean };
    Featured?: { checkbox?: boolean };
  };
  icon?: { type?: string; emoji?: string };
  last_edited_time?: string;
  cover?: { type?: string; external?: { url: string }; file?: { url: string } };
}

const BlogCard = ({ post, className = "" }: { post: BlogPost; className?: string }) => {
  const {
    properties,
    icon,
    last_edited_time,
    cover
  } = post;

  const title = properties?.Nombre?.title?.[0]?.plain_text || 'Sin título';
  const description = properties?.Description?.rich_text?.[0]?.plain_text || '';
  const lang = properties?.Lang?.select?.name || '';
  const published = properties?.Published?.checkbox || false;

  // Generate slug from title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return diffInDays === 1 ? 'hace 1 día' : `hace ${diffInDays} días`;
    } else if (diffInHours > 0) {
      return diffInHours === 1 ? 'hace 1 hora' : `hace ${diffInHours} horas`;
    } else if (diffInMinutes > 0) {
      return diffInMinutes === 1 ? 'hace 1 minuto' : `hace ${diffInMinutes} minutos`;
    } else {
      return 'Ahora mismo';
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
          {lang && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {lang}
            </span>
          )}
          <span className="text-xs text-gray-500 font-medium">
            {getRelativeTime(last_edited_time || '')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          <a href={`/es/blog2/${slug}`} className="block">
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
            href={`/es/blog2/${slug}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 group/link"
          >
            Leer más
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
              Borrador
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard; 