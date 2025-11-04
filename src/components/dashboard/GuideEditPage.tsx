import { useEffect, useState } from 'react';
import GuideForm from './GuideForm.js';
import Toast from './Toast.js';
import { getGuideById, updateGuide } from '../../lib/dashboard/api-guides.js';

interface GuideEditPageProps {
  id: string;
}

export default function GuideEditPage({ id }: GuideEditPageProps) {
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
      const { data, error } = await getGuideById(id);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setInitialData(data);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to load guide', type: 'error' });
    } finally {
      setLoadingData(false);
    }
  }

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await updateGuide(id, data);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setToast({ message: 'Guide updated successfully', type: 'success' });
        setTimeout(() => {
          window.location.href = '/dashboard/guides';
        }, 1000);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to update guide', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/guides';
  };

  if (loadingData) {
    return <div className="text-center py-12">Loading guide data...</div>;
  }

  if (!initialData) {
    return <div className="text-center py-12 text-red-600">Guide not found</div>;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Guide</h1>
        <p className="mt-2 text-gray-600">Update guide information</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <GuideForm
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

