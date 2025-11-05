import { useEffect, useState } from 'react';
import ContentList from './ContentList.js';
import Toast from './Toast.js';
import {
  getVisas,
  publishVisa,
  unpublishVisa,
  archiveVisa,
  deleteVisa,
} from '../../lib/dashboard/api-visas.js';

export default function VisasList() {
  console.log('[VisasList] ========== COMPONENT RENDERING ==========');
  console.log('[VisasList] VisasList component function called - component is rendering');
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  console.log('[VisasList] State initialized - loading:', loading, 'items:', items.length);

  useEffect(() => {
    console.log('[VisasList] ========== useEffect TRIGGERED ==========');
    console.log('[VisasList] Component mounted - useEffect triggered');
    console.log('[VisasList] Initial state - loading:', loading, 'items:', items.length);
    console.log('[VisasList] typeof window:', typeof window);
    console.log('[VisasList] typeof fetch:', typeof fetch);
    
    // Verify we're in browser environment
    if (typeof window === 'undefined') {
      console.error('[VisasList] ERROR: Running in SSR mode - useEffect should not run here');
      return;
    }
    
    console.log('[VisasList] Browser environment confirmed, calling loadItems IMMEDIATELY');
    console.log('[VisasList] About to call loadItems() to fetch ALL visas from Supabase');
    
    // Call loadItems immediately - no delay
    loadItems().catch((error) => {
      console.error('[VisasList] FATAL ERROR in loadItems:', error);
    });
  }, []);

  async function loadItems() {
    console.log('[VisasList] ========== LOADING VISAS FROM SUPABASE ==========');
    console.log('[VisasList] loadItems() FUNCTION CALLED - starting API request');
    console.log('[VisasList] This will fetch ALL visas from Supabase "visas" table via /api/dashboard/visas');
    console.log('[VisasList] Setting loading state to true');
    setLoading(true);
    const startTime = Date.now();
    
    try {
      console.log('[VisasList] ========== MAKING API CALL ==========');
      console.log('[VisasList] Checking if getVisas function exists...');
      console.log('[VisasList] getVisas function exists:', typeof getVisas === 'function');
      console.log('[VisasList] getVisas:', getVisas);
      
      if (typeof getVisas !== 'function') {
        throw new Error('getVisas is not a function! Cannot make API call.');
      }
      
      console.log('[VisasList] Calling getVisas({ archived: false }) to fetch non-archived visas');
      console.log('[VisasList] This API call will query Supabase table: "visas"');
      console.log('[VisasList] API endpoint: /api/dashboard/visas');
      
      const result = await getVisas({ archived: false });
      const elapsed = Date.now() - startTime;
      
      console.log('[VisasList] getVisas completed in', elapsed, 'ms');
      console.log('[VisasList] Result:', {
        hasData: !!result.data,
        dataIsArray: Array.isArray(result.data),
        dataLength: result.data?.length || 0,
        error: result.error || null,
        firstItem: result.data?.[0] ? {
          id: result.data[0].id,
          title: result.data[0].title,
          lang: result.data[0].lang,
          published: result.data[0].published,
          archived: result.data[0].archived,
        } : null,
      });
      
      const { data, error } = result;
      
      if (error) {
        console.error('[VisasList] Error in response:', error);
        setToast({ message: error, type: 'error' });
        setLoading(false);
        return;
      }
      
      console.log('[VisasList] No error, processing data. Data type:', typeof data, 'Is array:', Array.isArray(data));
      console.log('[VisasList] Data length:', data?.length || 0);
      
      if (data && Array.isArray(data)) {
        console.log('[VisasList] ========== SUCCESS: Data from Supabase "visas" table ==========');
        console.log('[VisasList] Setting', data.length, 'visas from Supabase "visas" table');
        console.log('[VisasList] First visa:', data[0] ? {
          id: data[0].id,
          title: data[0].title,
          lang: data[0].lang,
          published: data[0].published,
          archived: data[0].archived,
          source: 'Supabase "visas" table',
        } : 'No items');
        setItems(data);
        console.log('[VisasList] Items state updated with', data.length, 'visas from Supabase');
      } else {
        console.warn('[VisasList] WARNING: Data is not an array:', data);
        console.warn('[VisasList] Data type:', typeof data);
        console.warn('[VisasList] Setting empty array - no visas found in Supabase "visas" table');
        setItems([]);
      }
      
      console.log('[VisasList] Setting loading to false - ContentList will now display content');
      setLoading(false);
      console.log('[VisasList] ================================================================');
    } catch (error: any) {
      const elapsed = Date.now() - startTime;
      console.error('[VisasList] Exception after', elapsed, 'ms:', error);
      console.error('[VisasList] Error stack:', error.stack);
      console.error('[VisasList] Error details:', {
        name: error.name,
        message: error.message,
        cause: error.cause,
      });
      setToast({ message: error.message || 'Failed to load visas', type: 'error' });
      setLoading(false);
    }
  }

  const handleEdit = (id: string) => {
    console.log('[VisasList] Edit button clicked for visa id:', id);
    const editUrl = `/dashboard/visas/${id}/edit`;
    console.log('[VisasList] Navigating to:', editUrl);
    window.location.href = editUrl;
  };

  const handleDuplicate = async (id: string) => {
    // TODO: Implement duplicate
    setToast({ message: 'Duplicate functionality coming soon', type: 'error' });
  };

  const handlePublish = async (id: string) => {
    const { error } = await publishVisa(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleUnpublish = async (id: string) => {
    const { error } = await unpublishVisa(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleArchive = async (id: string) => {
    const { error } = await archiveVisa(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteVisa(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  console.log('[VisasList] ========== RENDERING JSX ==========');
  console.log('[VisasList] About to return JSX, items:', items.length, 'loading:', loading);
  
  return (
    <>
      {console.log('[VisasList] Inside JSX return - component is definitely rendering!')}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visas</h1>
          <p className="mt-2 text-sm text-gray-600">Manage visa content</p>
        </div>
        <a
          href="/dashboard/visas/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm hover:opacity-90"
          style={{ backgroundColor: '#16345F' }}
        >
          New Visa
        </a>
      </div>

      <ContentList
        items={items}
        type="visas"
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

