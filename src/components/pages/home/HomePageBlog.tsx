import { useState, useEffect } from 'react';

// Type definitions
interface BlogPost {
  id: number;
  title: string;
  description: string;
  author: string;
  readTime: string;
  pubDate: string;
  image: string;
  tags: string[];
  slug: string;
}

const HomePageBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // For now, we'll use mock data until we integrate with Notion
        const mockPosts: BlogPost[] = [
          {
            id: 1,
            title: 'Counting your days under Tourism Permits',
            description: 'General and specific immigration rules when visiting Colombia',
            author: 'Daniel Luque',
            readTime: '8 min',
            pubDate: '2022-12-01',
            image: '/blog/counting-your-days/img-1.webp',
            tags: ['Immigration Law', 'Tourism', 'Digital Nomads'],
            slug: 'counting-your-days'
          },
          {
            id: 2,
            title: 'DNV Confusion: Understanding Colombian Immigration',
            description: 'Navigating the complexities of Colombian immigration procedures',
            author: 'Daniel Luque',
            readTime: '6 min',
            pubDate: '2023-01-15',
            image: '/blog/dnv-confusion/img-1.webp',
            tags: ['Immigration Law', 'DNV', 'Legal Procedures'],
            slug: 'dnv-confusion'
          },
          {
            id: 3,
            title: 'On Gringo Prices: Understanding Foreigner Pricing in Colombia',
            description: 'A comprehensive guide to pricing differences for foreigners in Colombia',
            author: 'Daniel Luque',
            readTime: '10 min',
            pubDate: '2023-02-20',
            image: '/blog/gringo-prices/img-1.webp',
            tags: ['Culture', 'Pricing', 'Living in Colombia'],
            slug: 'on-gringo-prices'
          },
          {
            id: 4,
            title: 'Real Estate vs Business Visa: Which is Right for You?',
            description: 'Comparing visa options for investors and entrepreneurs in Colombia',
            author: 'Daniel Luque',
            readTime: '12 min',
            pubDate: '2023-03-10',
            image: '/blog/real-estate-vs-business-visa/img-1.webp',
            tags: ['Visa Services', 'Real Estate', 'Business'],
            slug: 'real-estate-vs-business-visa'
          },
          {
            id: 5,
            title: 'How to Extend Your Tourism Permit in Colombia',
            description: 'Step-by-step guide to extending your stay in Colombia',
            author: 'Daniel Luque',
            readTime: '4 min',
            pubDate: '2023-04-05',
            image: '/blog/how-to-extend-tourism-permit/img-1.webp',
            tags: ['Tourism', 'Permits', 'Immigration'],
            slug: 'how-to-extend-tourism-permit'
          }
        ];
        
        setPosts(mockPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            📚 Legal Insights & Resources
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Latest from Our
            <span className="block text-secondary">Legal Blog</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Stay informed with expert insights on Colombian immigration, real estate, and legal matters. 
            Our comprehensive guides help you navigate Colombia's legal landscape with confidence.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Post - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-2">
                    {featuredPost.tags.slice(0, 2).map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {featuredPost.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(featuredPost.pubDate)}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-primary mb-4 leading-tight">
                  {featuredPost.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.description}
                </p>
                
                <a 
                  href={`/en/blog/${featuredPost.slug}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white font-semibold rounded-lg hover:from-secondary/80 hover:to-primary/80 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  Read Full Article
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Recent Posts - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Posts
              </h3>
              
              <div className="space-y-6">
                {recentPosts.map((post: BlogPost, index: number) => (
                  <article key={post.id} className="group">
                    <div className="flex gap-4">
                      <img 
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span>{formatDate(post.pubDate)}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        
                        <a href={`/en/blog/${post.slug}`}>
                          <h4 className="text-sm font-semibold text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                            {post.title}
                          </h4>
                        </a>
                        
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 1).map((tag: string, index: number) => (
                            <span 
                              key={index}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <a 
                  href="/en/blog"
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/80 transition-all duration-300"
                >
                  View All Posts
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Legal Insights</h3>
            <p className="text-lg mb-6 opacity-90">
              Get the latest updates on Colombian immigration, real estate, and legal matters delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageBlog; 