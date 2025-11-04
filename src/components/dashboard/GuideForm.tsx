import { useState } from 'react';
import ContentForm from './ContentForm.js';
import { Input } from '../ui/Input.js';

interface GuideFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function GuideForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: GuideFormProps) {
  const [additionalData, setAdditionalData] = useState({
    category: initialData?.category || '',
    author: initialData?.author || '',
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
        <h3 className="text-lg font-medium text-gray-900">Additional Guide Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Input
              id="category"
              value={additionalData.category}
              onChange={(e) =>
                setAdditionalData({ ...additionalData, category: e.target.value })
              }
              placeholder="e.g., Legal, Business"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <Input
              id="author"
              value={additionalData.author}
              onChange={(e) =>
                setAdditionalData({ ...additionalData, author: e.target.value })
              }
              placeholder="Author name"
            />
          </div>
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

