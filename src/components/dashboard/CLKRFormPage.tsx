import { useState } from 'react';
import CLKRForm from './CLKRForm.js';
import Toast from './Toast.js';
import { createCLKRArticle } from '../../lib/dashboard/api-clkr.js';

export default function CLKRFormPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await createCLKRArticle(data);
      if (error) {
        setToast({ message: error, type: 'error' });
      } else {
        setToast({ message: 'CLKR article created successfully', type: 'success' });
        setTimeout(() => {
          window.location.href = '/dashboard/clkr';
        }, 1000);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to create CLKR article', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/clkr';
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New CLKR Article</h1>
        <p className="mt-2 text-gray-600">Add a new CLKR article to the system</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <CLKRForm
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

