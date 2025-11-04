import { useState } from 'react';
import BlogForm from './BlogForm.js';
import Toast from './Toast.js';
import { createBlogPost } from '../../lib/dashboard/api-blog.js';

export default function BlogFormPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await createBlogPost(data);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setToast({ message: 'Blog post created successfully', type: 'success' });
        setTimeout(() => {
          window.location.href = '/dashboard/blog';
        }, 1000);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to create blog post', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/blog';
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
        <p className="mt-2 text-gray-600">Add a new blog post to the system</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <BlogForm
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

