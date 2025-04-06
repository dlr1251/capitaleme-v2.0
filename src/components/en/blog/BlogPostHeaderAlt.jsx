import React from 'react';

const BlogPostHeaderAlt = ({ entry }) => {
  return (
    <div className="container mx-auto px-4 mt-[80px] mb-10">
      <div className="flex flex-col md:flex-row md:items-start md:gap-8">
        <div className="md:w-2/3">
          {/* Category badge */}
          <div className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full uppercase tracking-wider mb-4">
            {entry.data.category || 'Blog Post'}
          </div>
          
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
            {entry.data.title}
          </h1>
          
          {/* Accent line */}
          <div className="w-24 h-1 bg-primary mb-6"></div>
          
          {/* Author and meta information */}
          <div className="flex items-center space-x-6 mb-8">
            {/* Author image */}
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              {entry.data.authorImage ? (
                <img 
                  src={entry.data.authorImage} 
                  alt={entry.data.author} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full p-2 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              )}
            </div>
            
            <div>
              <div className="font-medium text-gray-900">{entry.data.author}</div>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span>{entry.data.pubDate.toISOString().slice(0, 10)}</span>
                {entry.data.readTime && (
                  <>
                    <span>•</span>
                    <span>{entry.data.readTime}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured image - moved to side column */}
        {entry.data.image && entry.data.image.url && (
          <div className="md:w-1/3 mb-6 md:mb-0 md:mt-4">
            <div className="relative">
              {/* Decorative elements - made smaller */}
              <div className="absolute -top-2 -left-2 w-16 h-16 bg-primary/10 rounded-lg z-0 hidden md:block"></div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-secondary/10 rounded-lg z-0 hidden md:block"></div>
              
              <img 
                src={entry.data.image.url} 
                alt={entry.data.title} 
                className="w-full h-auto max-h-[300px] object-cover rounded-lg shadow-md relative z-10"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostHeaderAlt; 