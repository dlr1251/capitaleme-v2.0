import { useEffect, useState } from 'react';
import { getVisas } from '../../lib/dashboard/api-visas.js';
import { getGuides } from '../../lib/dashboard/api-guides.js';
import { getCLKRArticles } from '../../lib/dashboard/api-clkr.js';
import { getBlogPosts } from '../../lib/dashboard/api-blog.js';
import {
  DocumentTextIcon,
  BookOpenIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    visas: { total: 0, published: 0, drafts: 0 },
    guides: { total: 0, published: 0, drafts: 0 },
    clkr: { total: 0, published: 0, drafts: 0 },
    blog: { total: 0, published: 0, drafts: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [visasRes, guidesRes, clkrRes, blogRes] = await Promise.all([
          getVisas({ archived: false }),
          getGuides({ archived: false }),
          getCLKRArticles({ archived: false }),
          getBlogPosts({ archived: false }),
        ]);

        setStats({
          visas: {
            total: visasRes.data?.length || 0,
            published: visasRes.data?.filter((v: any) => v.published).length || 0,
            drafts: visasRes.data?.filter((v: any) => !v.published).length || 0,
          },
          guides: {
            total: guidesRes.data?.length || 0,
            published: guidesRes.data?.filter((g: any) => g.published).length || 0,
            drafts: guidesRes.data?.filter((g: any) => !g.published).length || 0,
          },
          clkr: {
            total: clkrRes.data?.length || 0,
            published: clkrRes.data?.filter((c: any) => c.published).length || 0,
            drafts: clkrRes.data?.filter((c: any) => !c.published).length || 0,
          },
          blog: {
            total: blogRes.data?.length || 0,
            published: blogRes.data?.filter((b: any) => b.published).length || 0,
            drafts: blogRes.data?.filter((b: any) => !b.published).length || 0,
          },
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = [
    {
      name: 'Visas',
      href: '/dashboard/visas',
      icon: DocumentTextIcon,
      stats: stats.visas,
    },
    {
      name: 'Guides',
      href: '/dashboard/guides',
      icon: BookOpenIcon,
      stats: stats.guides,
    },
    {
      name: 'CLKR',
      href: '/dashboard/clkr',
      icon: DocumentTextIcon,
      stats: stats.clkr,
    },
    {
      name: 'Blog',
      href: '/dashboard/blog',
      icon: NewspaperIcon,
      stats: stats.blog,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent" style={{ borderColor: '#16345F' }}></div>
          <p className="mt-4 text-sm text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Manage your content and resources</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <a
            key={card.name}
            href={card.href}
            className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
            style={{ borderColor: '#E5E7EB' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#16345F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 rounded-lg p-2.5 transition-colors" style={{ backgroundColor: '#F0F4F8' }}>
                    <card.icon className="h-6 w-6" style={{ color: '#16345F' }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {card.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.stats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center rounded-full px-2.5 py-1 font-medium" style={{ backgroundColor: '#E6F7F3', color: '#00AA81' }}>
                {card.stats.published} published
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
                {card.stats.drafts} drafts
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

