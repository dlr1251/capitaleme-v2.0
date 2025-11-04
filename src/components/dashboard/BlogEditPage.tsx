import { useEffect, useState } from 'react';
import BlogForm from './BlogForm.js';
import Toast from './Toast.js';
import { getBlogPostById, updateBlogPost } from '../../lib/dashboard/api-blog.js';

interface BlogEditPageProps {
  id: string;
}

export default function BlogEditPage({ id }: BlogEditPageProps) {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    setLoadingData(true);
    try {
      const { data, error } = await getBlogPostById(id);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setInitialData(data);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to load blog post', type: 'error' });
    } finally {
      setLoadingData(false);
    }
  }

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await updateBlogPost(id, data);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setToast({ message: 'Blog post updated successfully', type: 'success' });
        setTimeout(() => {
          window.location.href = '/dashboard/blog';
        }, 1000);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to update blog post', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/blog';
  };

  if (loadingData) {
    return <div className="text-center py-12">Loading blog post data...</div>;
  }

  if (!initialData) {
    return <div className="text-center py-12 text-red-600">Blog post not found</div>;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="mt-2 text-gray-600">Update blog post information</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <BlogForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>

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

