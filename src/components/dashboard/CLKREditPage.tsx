import { useEffect, useState } from 'react';
import CLKRForm from './CLKRForm.js';
import Toast from './Toast.js';
import { getCLKRArticleById, updateCLKRArticle } from '../../lib/dashboard/api-clkr.js';

interface CLKREditPageProps {
  id: string;
}

export default function CLKREditPage({ id }: CLKREditPageProps) {
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
      const { data, error } = await getCLKRArticleById(id);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setInitialData(data);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to load CLKR article', type: 'error' });
    } finally {
      setLoadingData(false);
    }
  }

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await updateCLKRArticle(id, data);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setToast({ message: 'CLKR article updated successfully', type: 'success' });
        setTimeout(() => {
          window.location.href = '/dashboard/clkr';
        }, 1000);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to update CLKR article', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/clkr';
  };

  if (loadingData) {
    return <div className="text-center py-12">Loading CLKR article data...</div>;
  }

  if (!initialData) {
    return <div className="text-center py-12 text-red-600">CLKR article not found</div>;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit CLKR Article</h1>
        <p className="mt-2 text-gray-600">Update CLKR article information</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <CLKRForm
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

