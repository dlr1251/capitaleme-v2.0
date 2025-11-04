import { useState } from 'react';
import ContentForm from './ContentForm.js';
import { Input } from '../ui/Input.js';

interface VisaFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function VisaForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: VisaFormProps) {
  const [additionalData, setAdditionalData] = useState({
    category: initialData?.category || 'Visitor',
    country: initialData?.country || '',
    countries: initialData?.countries || [],
    is_popular: initialData?.is_popular || false,
    beneficiaries: initialData?.beneficiaries || '',
    work_permit: initialData?.work_permit || '',
    processing_time: initialData?.processing_time || '',
    requirements: initialData?.requirements || '',
    emoji: initialData?.emoji || '',
    alcance: initialData?.alcance || '',
    duration: initialData?.duration || '',
  });

  const [newCountry, setNewCountry] = useState('');

  const handleSubmit = async (baseData: any) => {
    await onSubmit({
      ...baseData,
      ...additionalData,
    });
  };

  const addCountry = () => {
    if (newCountry.trim() && !additionalData.countries.includes(newCountry.trim())) {
      setAdditionalData({
        ...additionalData,
        countries: [...additionalData.countries, newCountry.trim()],
      });
      setNewCountry('');
    }
  };

  const removeCountry = (country: string) => {
    setAdditionalData({
      ...additionalData,
      countries: additionalData.countries.filter((c: string) => c !== country),
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
        <h3 className="text-lg font-medium text-gray-900">Additional Visa Information</h3>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category / Type
          </label>
          <select
            id="category"
            value={additionalData.category}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, category: e.target.value })
            }
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
          >
            <option value="Visitor">Visitor</option>
            <option value="Migrant">Migrant</option>
            <option value="Resident">Resident</option>
            <option value="Work">Work</option>
            <option value="Student">Student</option>
          </select>
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Primary Country
          </label>
          <Input
            id="country"
            value={additionalData.country}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, country: e.target.value })
            }
            placeholder="e.g., Colombia"
          />
        </div>

        {/* Countries Array */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Countries
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCountry())}
              placeholder="Add country"
            />
            <button
              type="button"
              onClick={addCountry}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all shadow-sm hover:opacity-90"
              style={{ backgroundColor: '#16345F' }}
            >
              Add
            </button>
          </div>
          {additionalData.countries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {additionalData.countries.map((country: string) => (
                <span
                  key={country}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {country}
                  <button
                    type="button"
                    onClick={() => removeCountry(country)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Other fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="emoji" className="block text-sm font-medium text-gray-700 mb-2">
              Emoji
            </label>
            <Input
              id="emoji"
              value={additionalData.emoji}
              onChange={(e) =>
                setAdditionalData({ ...additionalData, emoji: e.target.value })
              }
              placeholder="📋"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <Input
              id="duration"
              value={additionalData.duration}
              onChange={(e) =>
                setAdditionalData({ ...additionalData, duration: e.target.value })
              }
              placeholder="e.g., 90 days"
            />
          </div>

          <div>
            <label htmlFor="processing_time" className="block text-sm font-medium text-gray-700 mb-2">
              Processing Time
            </label>
            <Input
              id="processing_time"
              value={additionalData.processing_time}
              onChange={(e) =>
                setAdditionalData({ ...additionalData, processing_time: e.target.value })
              }
              placeholder="e.g., 2-4 weeks"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={additionalData.is_popular}
              onChange={(e) =>
                setAdditionalData({ ...additionalData, is_popular: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
          </label>
        </div>

        <div>
          <label htmlFor="beneficiaries" className="block text-sm font-medium text-gray-700 mb-2">
            Beneficiaries
          </label>
          <textarea
            id="beneficiaries"
            value={additionalData.beneficiaries}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, beneficiaries: e.target.value })
            }
            rows={3}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
            placeholder="Who can apply for this visa?"
          />
        </div>

        <div>
          <label htmlFor="work_permit" className="block text-sm font-medium text-gray-700 mb-2">
            Work Permit
          </label>
          <textarea
            id="work_permit"
            value={additionalData.work_permit}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, work_permit: e.target.value })
            }
            rows={2}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
            Requirements
          </label>
          <textarea
            id="requirements"
            value={additionalData.requirements}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, requirements: e.target.value })
            }
            rows={4}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
            placeholder="List of requirements"
          />
        </div>

        <div>
          <label htmlFor="alcance" className="block text-sm font-medium text-gray-700 mb-2">
            Alcance
          </label>
          <textarea
            id="alcance"
            value={additionalData.alcance}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, alcance: e.target.value })
            }
            rows={2}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

