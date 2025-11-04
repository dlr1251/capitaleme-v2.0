import { useState } from 'react';
import ContentForm from './ContentForm.js';
import { Input } from '../ui/Input.js';

interface CLKRFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CLKRForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: CLKRFormProps) {
  const [additionalData, setAdditionalData] = useState({
    module: initialData?.module || '',
    featured: initialData?.featured || false,
  });

  const handleSubmit = async (baseData: any) => {
    await onSubmit({
      ...baseData,
      ...additionalData,
    });
  };

  return (
    <div className="space-y-6">
      <ContentForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        loading={loading}
      />

      <div className="border-t border-gray-200 pt-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Additional CLKR Information</h3>

        <div>
          <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-2">
            Module *
          </label>
          <Input
            id="module"
            value={additionalData.module}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, module: e.target.value })
            }
            placeholder="e.g., Legal Services, Business Setup"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={additionalData.featured}
              onChange={(e) =>
                setAdditionalData({ ...additionalData, featured: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Mark as Featured</span>
          </label>
        </div>
      </div>
    </div>
  );
}

