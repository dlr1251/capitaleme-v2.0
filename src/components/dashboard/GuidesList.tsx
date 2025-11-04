import { useEffect, useState } from 'react';
import ContentList from './ContentList.js';
import Toast from './Toast.js';
import {
  getGuides,
  publishGuide,
  unpublishGuide,
  archiveGuide,
  deleteGuide,
} from '../../lib/dashboard/api-guides.js';

export default function GuidesList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      console.log('[GuidesList] Fetching guides with filter: archived=false');
      const { data, error } = await getGuides({ archived: false });
      console.log('[GuidesList] Response received:', {
        hasData: !!data,
        dataLength: data?.length || 0,
        error: error || null,
      });
      
      if (error) {
        console.error('[GuidesList] Error fetching guides:', error);
        setToast({ message: error, type: 'error' });
      } else {
        console.log('[GuidesList] Setting items:', data?.length || 0, 'items');
        setItems(data || []);
      }
    } catch (error: any) {
      console.error('[GuidesList] Exception loading guides:', error);
      setToast({ message: error.message || 'Failed to load guides', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (id: string) => {
    console.log('[GuidesList] Edit button clicked for guide id:', id);
    const editUrl = `/dashboard/guides/${id}/edit`;
    console.log('[GuidesList] Navigating to:', editUrl);
    window.location.href = editUrl;
  };

  const handleDuplicate = async (id: string) => {
    setToast({ message: 'Duplicate functionality coming soon', type: 'error' });
  };

  const handlePublish = async (id: string) => {
    const { error } = await publishGuide(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleUnpublish = async (id: string) => {
    const { error } = await unpublishGuide(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleArchive = async (id: string) => {
    const { error } = await archiveGuide(id);
    if (error) {
      setToast({ message: error, type: 'error' });
    } else {
      await loadItems();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteGuide(id);
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
          <h1 className="text-3xl font-bold text-gray-900">Guides</h1>
          <p className="mt-2 text-sm text-gray-600">Manage guide content</p>
        </div>
        <a
          href="/dashboard/guides/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm hover:opacity-90"
          style={{ backgroundColor: '#16345F' }}
        >
          New Guide
        </a>
      </div>

      <ContentList
        items={items}
        type="guides"
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

