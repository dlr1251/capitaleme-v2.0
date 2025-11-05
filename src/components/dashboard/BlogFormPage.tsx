import { useState } from 'react';
import BlogForm from './BlogForm.js';
import Toast from './Toast.js';
import { createBlogPost } from '../../lib/dashboard/api-blog.js';

export default function BlogFormPage() {
  console.log('[BlogFormPage] ========== COMPONENT RENDERED ==========');
  console.log('[BlogFormPage] BlogFormPage component rendering');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  console.log('[BlogFormPage] Component state initialized:', { loading, hasToast: !!toast });

  const handleSubmit = async (data: any) => {
    console.log('[BlogFormPage] ========== HANDLE SUBMIT CALLED ==========');
    console.log('[BlogFormPage] Received data from ContentForm:', {
      title: data.title,
      slug: data.slug,
      lang: data.lang,
      published: data.published,
      hasDescription: !!data.description,
      hasContent: !!data.content,
      contentLength: data.content?.length || 0,
      fullData: data,
    });
    
    setLoading(true);
    setToast(null); // Clear any previous toast
    
    try {
      console.log('[BlogFormPage] Preparing submit data...');
      
      // Ensure published status is properly set
      const submitData = {
        ...data,
        published: data.published || false,
      };
      
      console.log('[BlogFormPage] ========== CALLING API ==========');
      console.log('[BlogFormPage] Calling createBlogPost with submitData:', submitData);
      console.log('[BlogFormPage] Published status:', submitData.published);
      console.log('[BlogFormPage] Will be saved as:', submitData.published ? 'PUBLISHED' : 'DRAFT');
      
      const result = await createBlogPost(submitData);
      
      console.log('[BlogFormPage] ========== API RESPONSE ==========');
      console.log('[BlogFormPage] createBlogPost result:', result);
      console.log('[BlogFormPage] Has data:', !!result.data);
      console.log('[BlogFormPage] Has error:', !!result.error);
      
      if (result.error) {
        console.error('[BlogFormPage] ========== API ERROR ==========');
        console.error('[BlogFormPage] Error creating blog post:', result.error);
        console.error('[BlogFormPage] Error type:', typeof result.error);
        setToast({ message: result.error, type: 'error' });
        setLoading(false);
        return;
      }
      
      if (result.data) {
        console.log('[BlogFormPage] ========== SUCCESS ==========');
        console.log('[BlogFormPage] Blog post created successfully!');
        console.log('[BlogFormPage] Blog post ID:', result.data.id);
        console.log('[BlogFormPage] Blog post title:', result.data.title);
        console.log('[BlogFormPage] Blog post published:', result.data.published);
        console.log('[BlogFormPage] Saved as:', result.data.published ? 'PUBLISHED' : 'DRAFT');
        
        const successMessage = submitData.published 
          ? 'Blog post published successfully' 
          : 'Blog post saved as draft successfully';
        console.log('[BlogFormPage] Success message:', successMessage);
        
        setToast({ 
          message: successMessage, 
          type: 'success' 
        });
        
        console.log('[BlogFormPage] Will redirect to /dashboard/blog in 1.5 seconds...');
        setTimeout(() => {
          console.log('[BlogFormPage] Redirecting now...');
          window.location.href = '/dashboard/blog';
        }, 1500);
      } else {
        console.error('[BlogFormPage] ========== NO DATA ERROR ==========');
        console.error('[BlogFormPage] No data returned from createBlogPost');
        console.error('[BlogFormPage] Result object:', result);
        setToast({ message: 'Failed to create blog post: No data returned', type: 'error' });
        setLoading(false);
      }
    } catch (error: any) {
      console.error('[BlogFormPage] Exception in handleSubmit:', error);
      setToast({ message: error.message || 'Failed to create blog post', type: 'error' });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/blog';
  };

  console.log('[BlogFormPage] Rendering JSX...');
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
        <p className="mt-2 text-gray-600">Add a new blog post to the system</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {console.log('[BlogFormPage] About to render BlogForm component')}
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

