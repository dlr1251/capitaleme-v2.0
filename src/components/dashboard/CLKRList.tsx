import { useEffect, useState } from 'react';
import ContentList from './ContentList.js';
import Toast from './Toast.js';
import {
  getCLKRArticles,
  publishCLKRArticle,
  unpublishCLKRArticle,
  archiveCLKRArticle,
  deleteCLKRArticle,
} from '../../lib/dashboard/api-clkr.js';

export default function CLKRList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      console.log('[CLKRList] Fetching CLKR articles with filter: archived=false');
      const { data, error } = await getCLKRArticles({ archived: false });
      console.log('[CLKRList] Response received:', {
        hasData: !!data,
        dataLength: data?.length || 0,
        error: error || null,
      });
      
      if (error) {
        console.error('[CLKRList] Error fetching CLKR articles:', error);
        setToast({ message: error, type: 'error' });
      } else {
        console.log('[CLKRList] Setting items:', data?.length || 0, 'items');
        setItems(data || []);
      }
    } catch (error: any) {
      console.error('[CLKRList] Exception loading CLKR articles:', error);
      setToast({ message: error.message || 'Failed to load CLKR articles', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (id: string) => {
    console.log('[CLKRList] Edit button clicked for CLKR article id:', id);
    const editUrl = `/dashboard/clkr/${id}/edit`;
    console.log('[CLKRList] Navigating to:', editUrl);
    window.location.href = editUrl;
  };

  const handleDuplicate = async (id: string) => {
    setToast({ message: 'Duplicate functionality coming soon', type: 'error' });
  };

  const handlePublish = async (id: string) => {
    const { error } = await publishCLKRArticle(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleUnpublish = async (id: string) => {
    const { error } = await unpublishCLKRArticle(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleArchive = async (id: string) => {
    const { error } = await archiveCLKRArticle(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteCLKRArticle(id);
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
          <h1 className="text-3xl font-bold text-gray-900">CLKR</h1>
          <p className="mt-2 text-sm text-gray-600">Manage CLKR articles</p>
        </div>
        <a
          href="/dashboard/clkr/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm hover:opacity-90"
          style={{ backgroundColor: '#16345F' }}
        >
          New Article
        </a>
      </div>

      <ContentList
        items={items}
        type="clkr"
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onArchive={handleArchive}
        onDelete={handleDelete}
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

