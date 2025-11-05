import { useState } from 'react';
import ContentForm from './ContentForm.js';
import { Input } from '../ui/Input.js';

interface BlogFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function BlogForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: BlogFormProps) {
  console.log('[BlogForm] ========== COMPONENT RENDERED ==========');
  console.log('[BlogForm] BlogForm component rendering');
  console.log('[BlogForm] Props:', {
    hasInitialData: !!initialData,
    hasOnSubmit: typeof onSubmit === 'function',
    hasOnCancel: typeof onCancel === 'function',
    loading,
  });
  
  const [additionalData, setAdditionalData] = useState({
    category: initialData?.category || '',
    author: initialData?.author || 'danielluque',
    pub_date: initialData?.pub_date ? new Date(initialData.pub_date).toISOString().split('T')[0] : '',
    image: initialData?.image || '',
    featured: initialData?.featured || false,
  });

  const handleSubmit = async (baseData: any) => {
    console.log('[BlogForm] handleSubmit called with baseData:', baseData);
    const combinedData = {
      ...baseData,
      ...additionalData,
      pub_date: additionalData.pub_date ? new Date(additionalData.pub_date).toISOString() : null,
    };
    console.log('[BlogForm] Calling onSubmit with combined data:', combinedData);
    await onSubmit(combinedData);
  };

  console.log('[BlogForm] Rendering JSX...');
  
  return (
    <div className="space-y-6">
      {console.log('[BlogForm] About to render ContentForm component')}
      <ContentForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        loading={loading}
      />

      <div className="border-t border-gray-200 pt-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Additional Blog Information</h3>

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
            placeholder="e.g., Legal, Immigration, Real Estate"
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

        {/* Publication Date */}
        <div>
          <label htmlFor="pub_date" className="block text-sm font-medium text-gray-700 mb-2">
            Publication Date
          </label>
          <Input
            id="pub_date"
            type="date"
            value={additionalData.pub_date}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, pub_date: e.target.value })
            }
          />
          <p className="mt-1 text-xs text-gray-500">Leave empty to use current date when publishing</p>
        </div>

        {/* Featured Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image URL
          </label>
          <Input
            id="image"
            value={additionalData.image}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, image: e.target.value })
            }
            placeholder="https://example.com/image.jpg"
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
          <p className="mt-1 text-xs text-gray-500">Featured posts appear prominently on the blog homepage</p>
        </div>
      </div>
    </div>
  );
}
