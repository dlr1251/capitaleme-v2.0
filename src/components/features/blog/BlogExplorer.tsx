// import React, { useState, useMemo } from 'react'; // UNUSED React import - commenting out
import { useState, useMemo } from 'react';
import BlogCard from './BlogCard.jsx';
import type { NotionPage } from '../../../utils/notionTypes.js';
import { getPageTitle, getPageDescription, getPageSelectValue } from '../../../utils/notionHelpers.js';

interface BlogExplorerProps {
  posts?: NotionPage[];
  className?: string;
}

const BlogExplorer = ({ posts = [], className = "" }: BlogExplorerProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  // Get unique categories from posts
  const categories = useMemo(() => {
    const cats = posts
      .map((post: NotionPage) => getPageSelectValue(post, 'Category'))
      .filter((cat: string | undefined | null): cat is string => typeof cat === 'string' && Boolean(cat));
    return ['all', ...new Set(cats)];
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter((post: NotionPage) => {
      const title = getPageTitle(post, 'Nombre');
      const description = getPageDescription(post, 'Description');
      const category = getPageSelectValue(post, 'Category');
      
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort posts
    filtered.sort((a: NotionPage, b: NotionPage) => {
      if (sortBy === 'date') {
        return new Date(b.last_edited_time).getTime() - new Date(a.last_edited_time).getTime();
      } else if (sortBy === 'title') {
        const titleA = getPageTitle(a, 'Nombre');
        const titleB = getPageTitle(b, 'Nombre');
        return titleA.localeCompare(titleB);
      }
      return 0;
    });

    return filtered;
  }, [posts, searchTerm, selectedCategory, sortBy]);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((category: string) => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>

        {/* Sort Options */}
        <select
          value={sortBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredPosts.length} of {posts.length} posts
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post: NotionPage) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BlogExplorer; 