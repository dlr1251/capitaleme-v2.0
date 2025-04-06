import React, { useState } from 'react';

// Assuming `posts` is the array of all posts
const BlogPostsList = ({ posts }) => {
  const [filters, setFilters] = useState({ author: '', category: '', startDate: '', endDate: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesAuthor = filters.author ? post.data.author === filters.author : true;
    const matchesCategory = filters.category ? post.data.category === filters.category : true;
    const matchesStartDate = filters.startDate ? new Date(post.data.pubDate) >= new Date(filters.startDate) : true;
    const matchesEndDate = filters.endDate ? new Date(post.data.pubDate) <= new Date(filters.endDate) : true;

    return matchesAuthor && matchesCategory && matchesStartDate && matchesEndDate;
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

  return (
    <div>
      <div className="filters">
        <input type="text" name="author" value={filters.author} onChange={handleFilterChange} placeholder="Filter by author" />
        <input type="text" name="category" value={filters.category} onChange={handleFilterChange} placeholder="Filter by category" />
        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} placeholder="Start date" />
        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} placeholder="End date" />
      </div>

      <div className="posts grid grid-cols-1 md:grid-cols-4 gap-3">
        {paginatedPosts.map(post => (
          <a key={post.slug} href={`/en/blog/${post.slug.slice(3)}`} className="block border rounded p-5 hover:shadow hover:shadow-xl">
            <div className="flex justify-between">
              <img src={post.data.image.url} alt="" className="object-cover rounded" />
            </div>
            <div className="p-5">
              <div className="text-sm text-slate-900">{post.data.author}</div>
              <div className="text-sm text-slate-500">{post.data.pubDate.toString().slice(0, 10)}</div>
              <div className="text-primary text-lg font-bold mt-2">{post.data.title}</div>
              <div className="text-sm text-slate-700">{post.data.readTime}</div>
              <p className="font-light py-4">{post.data.description}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogPostsList;
