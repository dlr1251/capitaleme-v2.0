import React, { useState } from 'react';

const BlogPostsListAlt = ({ posts }) => {
  const [filters, setFilters] = useState({ author: '', category: '', startDate: '', endDate: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 8;

  // Get unique categories and authors for filter dropdowns
  const categories = [...new Set(posts.map(post => post.data.category))].filter(Boolean);
  const authors = [...new Set(posts.map(post => post.data.author))].filter(Boolean);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesAuthor = filters.author ? post.data.author === filters.author : true;
    const matchesCategory = filters.category ? post.data.category === filters.category : true;
    const matchesStartDate = filters.startDate ? new Date(post.data.pubDate) >= new Date(filters.startDate) : true;
    const matchesEndDate = filters.endDate ? new Date(post.data.pubDate) <= new Date(filters.endDate) : true;
    const matchesSearch = searchTerm 
      ? post.data.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.data.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesAuthor && matchesCategory && matchesStartDate && matchesEndDate && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ author: '', category: '', startDate: '', endDate: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search and filter section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-12">
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <select 
              name="author" 
              value={filters.author} 
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">All Authors</option>
              {authors.map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input 
              type="date" 
              name="startDate" 
              value={filters.startDate} 
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input 
              type="date" 
              name="endDate" 
              value={filters.endDate} 
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          
          <button 
            onClick={clearFilters}
            className="px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium flex items-center gap-2 md:self-stretch"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        </div>
      </div>

      {/* Results counter */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-gray-600">
          Showing <span className="font-semibold">{filteredPosts.length}</span> results
        </div>
      </div>

      {/* Posts grid */}
      {paginatedPosts.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-300 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            onClick={clearFilters}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {paginatedPosts.map(post => (
            <a key={post.slug} href={`/en/blog/${post.slug.slice(3)}`} className="group block overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-full">
              <div className="aspect-[16/9] overflow-hidden">
                <img 
                  src={post.data.image.url} 
                  alt={post.data.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {post.data.category || 'Article'}
                  </div>
                  <div className="text-xs text-gray-500">{post.data.readTime}</div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.data.title}
                </h3>
                
                <p className="text-gray-600 line-clamp-3 mb-4 text-sm">
                  {post.data.description}
                </p>
                
                <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden mr-3">
                    {post.data.authorImage ? (
                      <img 
                        src={post.data.authorImage} 
                        alt={post.data.author} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full p-1.5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{post.data.author}</div>
                    <div className="text-xs text-gray-500">{post.data.pubDate.toString().slice(0, 10)}</div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button 
                key={i + 1} 
                onClick={() => setCurrentPage(i + 1)} 
                className={`w-10 h-10 rounded-md flex items-center justify-center ${
                  currentPage === i + 1 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostsListAlt; 