import { useState } from 'react';
import CLKRForm from './CLKRForm.js';
import Toast from './Toast.js';
import { createCLKRArticle } from '../../lib/dashboard/api-clkr.js';

export default function CLKRFormPage() {
  console.log('[CLKRFormPage] ========== COMPONENT RENDERED ==========');
  console.log('[CLKRFormPage] CLKRFormPage component rendering');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  console.log('[CLKRFormPage] Component state initialized:', { loading, hasToast: !!toast });

  const handleSubmit = async (data: any) => {
    console.log('[CLKRFormPage] ========== HANDLE SUBMIT CALLED ==========');
    console.log('[CLKRFormPage] Received data from ContentForm:', {
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
    setToast(null);
    
    try {
      console.log('[CLKRFormPage] Preparing submit data...');
      
      const submitData = {
        ...data,
        published: data.published || false,
      };
      
      console.log('[CLKRFormPage] ========== CALLING API ==========');
      console.log('[CLKRFormPage] Calling createCLKRArticle with submitData:', submitData);
      console.log('[CLKRFormPage] Published status:', submitData.published);
      console.log('[CLKRFormPage] Will be saved as:', submitData.published ? 'PUBLISHED' : 'DRAFT');
      
      const result = await createCLKRArticle(submitData);
      
      console.log('[CLKRFormPage] ========== API RESPONSE ==========');
      console.log('[CLKRFormPage] createCLKRArticle result:', result);
      console.log('[CLKRFormPage] Has data:', !!result.data);
      console.log('[CLKRFormPage] Has error:', !!result.error);
      
      if (result.error) {
        console.error('[CLKRFormPage] ========== API ERROR ==========');
        console.error('[CLKRFormPage] Error creating CLKR article:', result.error);
        setToast({ message: result.error, type: 'error' });
        setLoading(false);
        return;
      }
      
      if (result.data) {
        console.log('[CLKRFormPage] ========== SUCCESS ==========');
        console.log('[CLKRFormPage] CLKR article created successfully!');
        console.log('[CLKRFormPage] CLKR article ID:', result.data.id);
        console.log('[CLKRFormPage] CLKR article published:', result.data.published);
        console.log('[CLKRFormPage] Saved as:', result.data.published ? 'PUBLISHED' : 'DRAFT');
        
        const successMessage = submitData.published 
          ? 'CLKR article published successfully' 
          : 'CLKR article saved as draft successfully';
        console.log('[CLKRFormPage] Success message:', successMessage);
        
        setToast({ 
          message: successMessage, 
          type: 'success' 
        });
        
        console.log('[CLKRFormPage] Will redirect to /dashboard/clkr in 1.5 seconds...');
        setTimeout(() => {
          console.log('[CLKRFormPage] Redirecting now...');
          window.location.href = '/dashboard/clkr';
        }, 1500);
      } else {
        console.error('[CLKRFormPage] ========== NO DATA ERROR ==========');
        console.error('[CLKRFormPage] No data returned from createCLKRArticle');
        setToast({ message: 'Failed to create CLKR article: No data returned', type: 'error' });
        setLoading(false);
      }
    } catch (error: any) {
      console.error('[CLKRFormPage] Exception in handleSubmit:', error);
      setToast({ message: error.message || 'Failed to create CLKR article', type: 'error' });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/clkr';
  };

  console.log('[CLKRFormPage] Rendering JSX...');
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New CLKR Article</h1>
        <p className="mt-2 text-gray-600">Add a new CLKR article to the system</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {console.log('[CLKRFormPage] About to render CLKRForm component')}
        <CLKRForm
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

