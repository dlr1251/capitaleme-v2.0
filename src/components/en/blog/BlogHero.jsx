import React from 'react';

const BlogHero = ({ post }) => {
  return (
    <div className="relative w-full h-[65vh] overflow-hidden">
      {/* Background Image */}
      <img 
        src={post.data.image.url} 
        alt={post.data.title} 
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/90"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 sm:px-8">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          {post.data.title}
        </h1>
        <p className="text-white text-lg sm:text-xl mb-4 max-w-screen-xl mx-auto" >
          {post.data.description}
        </p>
        <div className="text-white text-sm sm:text-base flex justify-center space-x-4 mb-6">
          <span>{post.data.author}</span>
          <span>|</span>
          <span>{post.data.pubDate.toString().slice(0, 10)}</span>
          <span>|</span>
          <span>{post.data.readTime}</span>
        </div>
        <a href={`/blog/${post.slug.slice(3)}`} className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
          Read Full Post
        </a>
      </div>
    </div>
  );
};

export default BlogHero;
