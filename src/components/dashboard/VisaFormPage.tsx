import { useState } from 'react';
import VisaForm from './VisaForm.js';
import Toast from './Toast.js';
import { createVisa } from '../../lib/dashboard/api-visas.js';

export default function VisaFormPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (data: any) => {
    console.log('[VisaFormPage] ========== HANDLE SUBMIT CALLED ==========');
    console.log('[VisaFormPage] Received data from ContentForm:', {
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
      console.log('[VisaFormPage] Preparing submit data...');
      
      const submitData = {
        ...data,
        published: data.published || false,
      };
      
      console.log('[VisaFormPage] ========== CALLING API ==========');
      console.log('[VisaFormPage] Calling createVisa with submitData:', submitData);
      console.log('[VisaFormPage] Published status:', submitData.published);
      console.log('[VisaFormPage] Will be saved as:', submitData.published ? 'PUBLISHED' : 'DRAFT');
      
      const result = await createVisa(submitData);
      
      console.log('[VisaFormPage] ========== API RESPONSE ==========');
      console.log('[VisaFormPage] createVisa result:', result);
      console.log('[VisaFormPage] Has data:', !!result.data);
      console.log('[VisaFormPage] Has error:', !!result.error);
      
      if (result.error) {
        console.error('[VisaFormPage] ========== API ERROR ==========');
        console.error('[VisaFormPage] Error creating visa:', result.error);
        setToast({ message: result.error, type: 'error' });
        setLoading(false);
        return;
      }
      
      if (result.data) {
        console.log('[VisaFormPage] ========== SUCCESS ==========');
        console.log('[VisaFormPage] Visa created successfully!');
        console.log('[VisaFormPage] Visa ID:', result.data.id);
        console.log('[VisaFormPage] Visa published:', result.data.published);
        console.log('[VisaFormPage] Saved as:', result.data.published ? 'PUBLISHED' : 'DRAFT');
        
        const successMessage = submitData.published 
          ? 'Visa published successfully' 
          : 'Visa saved as draft successfully';
        console.log('[VisaFormPage] Success message:', successMessage);
        
        setToast({ 
          message: successMessage, 
          type: 'success' 
        });
        
        console.log('[VisaFormPage] Will redirect to /dashboard/visas in 1.5 seconds...');
        setTimeout(() => {
          console.log('[VisaFormPage] Redirecting now...');
          window.location.href = '/dashboard/visas';
        }, 1500);
      } else {
        console.error('[VisaFormPage] ========== NO DATA ERROR ==========');
        console.error('[VisaFormPage] No data returned from createVisa');
        setToast({ message: 'Failed to create visa: No data returned', type: 'error' });
        setLoading(false);
      }
    } catch (error: any) {
      console.error('[VisaFormPage] Exception in handleSubmit:', error);
      setToast({ message: error.message || 'Failed to create visa', type: 'error' });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/visas';
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Visa</h1>
        <p className="mt-2 text-gray-600">Add a new visa to the system</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <VisaForm
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

