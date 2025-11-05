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
  console.log('[GuideForm] ========== COMPONENT RENDERED ==========');
  console.log('[GuideForm] GuideForm component rendering');
  console.log('[GuideForm] Props:', {
    hasInitialData: !!initialData,
    hasOnSubmit: typeof onSubmit === 'function',
    hasOnCancel: typeof onCancel === 'function',
    loading,
  });
  
  const [additionalData, setAdditionalData] = useState({
    category: initialData?.category || '',
    author: initialData?.author || 'danielluque',
    featured: initialData?.featured || false,
  });

  const handleSubmit = async (baseData: any) => {
    console.log('[GuideForm] handleSubmit called with baseData:', baseData);
    const combinedData = {
      ...baseData,
      ...additionalData,
    };
    console.log('[GuideForm] Calling onSubmit with combined data:', combinedData);
    await onSubmit(combinedData);
  };

  console.log('[GuideForm] Rendering JSX...');
  
  return (
    <div className="space-y-6">
      {console.log('[GuideForm] About to render ContentForm component')}
      <ContentForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        loading={loading}
      />

      <div className="border-t border-gray-200 pt-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Additional Guide Information</h3>

        {/* Category */}
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
            placeholder="e.g., Visa, Immigration, Legal"
          />
        </div>

        {/* Author */}
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
            placeholder="Author name or ID"
          />
        </div>

        {/* Featured */}
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
          <p className="mt-1 text-xs text-gray-500">Featured guides appear prominently on the guides page</p>
        </div>
      </div>
    </div>
  );
}
