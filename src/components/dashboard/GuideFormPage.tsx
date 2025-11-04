import { useState } from 'react';
import GuideForm from './GuideForm.js';
import Toast from './Toast.js';
import { createGuide } from '../../lib/dashboard/api-guides.js';

export default function GuideFormPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await createGuide(data);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setToast({ message: 'Guide created successfully', type: 'success' });
        setTimeout(() => {
          window.location.href = '/dashboard/guides';
        }, 1000);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to create guide', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/guides';
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Guide</h1>
        <p className="mt-2 text-gray-600">Add a new guide to the system</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
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

