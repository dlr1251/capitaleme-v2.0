import { useState } from 'react';
import GuideForm from './GuideForm.js';
import Toast from './Toast.js';
import { createGuide } from '../../lib/dashboard/api-guides.js';

export default function GuideFormPage() {
  console.log('[GuideFormPage] ========== COMPONENT RENDERED ==========');
  console.log('[GuideFormPage] GuideFormPage component rendering');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  console.log('[GuideFormPage] Component state initialized:', { loading, hasToast: !!toast });

  const handleSubmit = async (data: any) => {
    console.log('[GuideFormPage] ========== HANDLE SUBMIT CALLED ==========');
    console.log('[GuideFormPage] Received data from ContentForm:', {
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
      console.log('[GuideFormPage] Preparing submit data...');
      
      const submitData = {
        ...data,
        published: data.published || false,
      };
      
      console.log('[GuideFormPage] ========== CALLING API ==========');
      console.log('[GuideFormPage] Calling createGuide with submitData:', submitData);
      console.log('[GuideFormPage] Published status:', submitData.published);
      console.log('[GuideFormPage] Will be saved as:', submitData.published ? 'PUBLISHED' : 'DRAFT');
      
      const result = await createGuide(submitData);
      
      console.log('[GuideFormPage] ========== API RESPONSE ==========');
      console.log('[GuideFormPage] createGuide result:', result);
      console.log('[GuideFormPage] Has data:', !!result.data);
      console.log('[GuideFormPage] Has error:', !!result.error);
      
      if (result.error) {
        console.error('[GuideFormPage] ========== API ERROR ==========');
        console.error('[GuideFormPage] Error creating guide:', result.error);
        setToast({ message: result.error, type: 'error' });
        setLoading(false);
        return;
      }
      
      if (result.data) {
        console.log('[GuideFormPage] ========== SUCCESS ==========');
        console.log('[GuideFormPage] Guide created successfully!');
        console.log('[GuideFormPage] Guide ID:', result.data.id);
        console.log('[GuideFormPage] Guide published:', result.data.published);
        console.log('[GuideFormPage] Saved as:', result.data.published ? 'PUBLISHED' : 'DRAFT');
        
        const successMessage = submitData.published 
          ? 'Guide published successfully' 
          : 'Guide saved as draft successfully';
        console.log('[GuideFormPage] Success message:', successMessage);
        
        setToast({ 
          message: successMessage, 
          type: 'success' 
        });
        
        console.log('[GuideFormPage] Will redirect to /dashboard/guides in 1.5 seconds...');
        setTimeout(() => {
          console.log('[GuideFormPage] Redirecting now...');
          window.location.href = '/dashboard/guides';
        }, 1500);
      } else {
        console.error('[GuideFormPage] ========== NO DATA ERROR ==========');
        console.error('[GuideFormPage] No data returned from createGuide');
        setToast({ message: 'Failed to create guide: No data returned', type: 'error' });
        setLoading(false);
      }
    } catch (error: any) {
      console.error('[GuideFormPage] Exception in handleSubmit:', error);
      setToast({ message: error.message || 'Failed to create guide', type: 'error' });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/guides';
  };

  console.log('[GuideFormPage] Rendering JSX...');
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Guide</h1>
        <p className="mt-2 text-gray-600">Add a new guide to the system</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {console.log('[GuideFormPage] About to render GuideForm component')}
        <GuideForm
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

