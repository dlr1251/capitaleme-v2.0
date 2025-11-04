import { useState } from 'react';
import VisaForm from './VisaForm.js';
import Toast from './Toast.js';
import { createVisa } from '../../lib/dashboard/api-visas.js';

export default function VisaFormPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await createVisa(data);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setToast({ message: 'Visa created successfully', type: 'success' });
        setTimeout(() => {
          window.location.href = '/dashboard/visas';
        }, 1000);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to create visa', type: 'error' });
    } finally {
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

