import { useEffect, useState } from 'react';
import VisaForm from './VisaForm.js';
import Toast from './Toast.js';
import { getVisaById, updateVisa } from '../../lib/dashboard/api-visas.js';

interface VisaEditPageProps {
  id: string;
}

export default function VisaEditPage({ id }: VisaEditPageProps) {
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
      const { data, error } = await getVisaById(id);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setInitialData(data);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to load visa', type: 'error' });
    } finally {
      setLoadingData(false);
    }
  }

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await updateVisa(id, data);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setToast({ message: 'Visa updated successfully', type: 'success' });
        setTimeout(() => {
          window.location.href = '/dashboard/visas';
        }, 1000);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to update visa', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/visas';
  };

  if (loadingData) {
    return <div className="text-center py-12">Loading visa data...</div>;
  }

  if (!initialData) {
    return <div className="text-center py-12 text-red-600">Visa not found</div>;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Visa</h1>
        <p className="mt-2 text-gray-600">Update visa information</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <VisaForm
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

