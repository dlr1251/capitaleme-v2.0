import { useEffect, useState } from 'react';
import ContentList from './ContentList.js';
import Toast from './Toast.js';
import {
  getBlogPosts,
  publishBlogPost,
  unpublishBlogPost,
  archiveBlogPost,
  deleteBlogPost,
} from '../../lib/dashboard/api-blog.js';

export default function BlogList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      console.log('[BlogList] Fetching blog posts with filter: archived=false');
      const { data, error } = await getBlogPosts({ archived: false });
      console.log('[BlogList] Response received:', {
        hasData: !!data,
        dataLength: data?.length || 0,
        error: error || null,
      });
      
      if (error) {
        console.error('[BlogList] Error fetching blog posts:', error);
        setToast({ message: error, type: 'error' });
      } else {
        console.log('[BlogList] Setting items:', data?.length || 0, 'items');
        setItems(data || []);
      }
    } catch (error: any) {
      console.error('[BlogList] Exception loading blog posts:', error);
      setToast({ message: error.message || 'Failed to load blog posts', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (id: string) => {
    console.log('[BlogList] Edit button clicked for blog post id:', id);
    const editUrl = `/dashboard/blog/${id}/edit`;
    console.log('[BlogList] Navigating to:', editUrl);
    window.location.href = editUrl;
  };

  const handleDuplicate = async (id: string) => {
    setToast({ message: 'Duplicate functionality coming soon', type: 'error' });
  };

  const handlePublish = async (id: string) => {
    const { error } = await publishBlogPost(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleUnpublish = async (id: string) => {
    const { error } = await unpublishBlogPost(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleArchive = async (id: string) => {
    const { error } = await archiveBlogPost(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteBlogPost(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="mt-2 text-sm text-gray-600">Manage blog posts</p>
        </div>
        <a
          href="/dashboard/blog/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm hover:opacity-90"
          style={{ backgroundColor: '#16345F' }}
        >
          New Post
        </a>
      </div>

      <ContentList
        items={items}
        type="blog"
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onRefresh={loadItems}
        loading={loading}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

