// Type definitions
interface PostData {
  title: string;
  description: string;
  category: string;
  author: string;
  authorImage?: string;
  pubDate: string | Date;
  image: { url: string };
  readTime?: string;
}

interface Post {
  slug: string;
  data: PostData;
}

interface BlogPageHeroProps {
  post: Post;
}

const BlogPageHero = ({ post }: BlogPageHeroProps) => {
  return (
    <div className="relative w-full overflow-hidden mt-[65px]">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Content */}
          <div className="md:w-1/2 z-10 order-2 md:order-1">
            <div className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full uppercase tracking-wider mb-4">
              {post.data.category || 'Blog Post'}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {post.data.title}
            </h1>
            
            <div className="w-20 h-1 bg-primary my-4"></div>
            
            <p className="text-lg text-gray-600 mb-6">
              {post.data.description}
            </p>
            
            <div className="flex items-center space-x-6 mb-8">
              {/* Author image */}
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                {post.data.authorImage ? (
                  <img 
                    src={post.data.authorImage} 
                    alt={post.data.author} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full p-2 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                )}
              </div>
              
              <div>
                <div className="font-medium text-gray-900">{post.data.author}</div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span>{post.data.pubDate.toString().slice(0, 10)}</span>
                  <span>•</span>
                  <span>{post.data.readTime}</span>
                </div>
              </div>
            </div>
            
            <a 
              href={`/en/blog/${post.slug.slice(3)}`} 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary/90 transition-colors"
            >
              Read Full Article
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
          
          {/* Image */}
          <div className="md:w-1/2 relative order-1 md:order-2">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-lg z-0 hidden md:block"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/10 rounded-lg z-0 hidden md:block"></div>
              
              {/* Main image */}
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-xl relative z-10">
                <img 
                  src={post.data.image.url} 
                  alt={post.data.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              {/* Metadata chip */}
              <div className="absolute -right-6 -bottom-6 bg-white py-2 px-4 rounded-lg shadow-lg z-20 hidden md:block">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="text-sm font-medium">{post.data.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPageHero; 