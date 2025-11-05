import { useState, useEffect } from 'react';
import ContentForm from './ContentForm.js';
import { Input } from '../ui/Input.js';
import { getAuthToken } from '../../lib/dashboard/auth-token.js';

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
  console.log('[CLKRForm] ========== COMPONENT RENDERED ==========');
  console.log('[CLKRForm] CLKRForm component rendering');
  console.log('[CLKRForm] Props:', {
    hasInitialData: !!initialData,
    hasOnSubmit: typeof onSubmit === 'function',
    hasOnCancel: typeof onCancel === 'function',
    loading,
  });
  
  const [additionalData, setAdditionalData] = useState({
    module: initialData?.module || '',
  });

  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const [modulesLoading, setModulesLoading] = useState<boolean>(false);
  const [moduleMode, setModuleMode] = useState<'select' | 'create'>(initialData?.module ? 'select' : 'select');

  useEffect(() => {
    let mounted = true;
    const loadModules = async () => {
      try {
        setModulesLoading(true);
        const token = await getAuthToken();
        const res = await fetch('/api/dashboard/clkr?archived=false', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
          // Fallback silently; UI will still allow creating a new one
          setModulesLoading(false);
          return;
        }
        const json = await res.json();
        const list: string[] = Array.from(
          new Set(
            (json?.data || [])
              .map((it: any) => it.module)
              .filter((m: any) => typeof m === 'string' && m.trim().length > 0)
          )
        ).sort((a, b) => a.localeCompare(b));
        if (mounted) {
          // Ensure current module is present in options
          const withCurrent = additionalData.module && !list.includes(additionalData.module)
            ? [additionalData.module, ...list].sort((a, b) => a.localeCompare(b))
            : list;
          setAvailableModules(withCurrent);
        }
      } catch {
        // Ignore errors; keep UI usable
      } finally {
        if (mounted) setModulesLoading(false);
      }
    };
    loadModules();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (baseData: any) => {
    console.log('[CLKRForm] handleSubmit called with baseData:', baseData);
    const combinedData = {
      ...baseData,
      ...additionalData,
    };
    console.log('[CLKRForm] Calling onSubmit with combined data:', combinedData);
    await onSubmit(combinedData);
  };

  console.log('[CLKRForm] Rendering JSX...');
  
  return (
    <div className="space-y-6">
      {console.log('[CLKRForm] About to render ContentForm component')}
      <ContentForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        loading={loading}
        enableGrok={true}
      />

      <div className="border-t border-gray-200 pt-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Additional CLKR Information</h3>

      {/* Module */}
      <div>
        <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-2">
          Module
        </label>

        {moduleMode === 'select' ? (
          <div className="flex items-center gap-3">
            <select
              id="module"
              value={additionalData.module}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '__create_new__') {
                  setModuleMode('create');
                  setAdditionalData({ ...additionalData, module: '' });
                } else {
                  setAdditionalData({ ...additionalData, module: val });
                }
              }}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition-colors"
            >
              <option value="">{modulesLoading ? 'Loading modules…' : 'Select a module'}</option>
              {availableModules.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
              <option value="__create_new__">Create new module…</option>
            </select>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              id="module"
              value={additionalData.module}
              onChange={(e) => setAdditionalData({ ...additionalData, module: e.target.value })}
              placeholder="Type a new module name"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setModuleMode('select')}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Use existing module
              </button>
            </div>
          </div>
        )}

        <p className="mt-1 text-xs text-gray-500">Choose an existing module or create a new one.</p>
      </div>

        
      </div>
    </div>
  );
}
