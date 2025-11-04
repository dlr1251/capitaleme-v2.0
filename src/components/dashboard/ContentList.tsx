import { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge.js';
import ConfirmModal from './ConfirmModal.js';
import Toast from './Toast.js';
import { formatDate, formatDateTime, getRelativeTime } from '../../lib/dashboard/utils.js';
import {
  PencilIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface ContentListProps {
  items: any[];
  type: 'visas' | 'guides' | 'clkr' | 'blog';
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onPublish: (id: string) => Promise<void>;
  onUnpublish: (id: string) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export default function ContentList({
  items,
  type,
  onEdit,
  onDuplicate,
  onPublish,
  onUnpublish,
  onArchive,
  onDelete,
  loading = false,
}: ContentListProps) {
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    id: string;
    title: string;
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    console.log('[ContentList] Component mounted/updated:', {
      type,
      itemsCount: items.length,
      loading,
      itemsType: typeof items,
      itemsIsArray: Array.isArray(items),
      firstItem: items[0] ? { id: items[0].id, title: items[0].title } : null,
    });
    console.log('[ContentList] Loading state:', loading ? 'LOADING - showing spinner' : 'NOT LOADING - showing content');
    if (loading) {
      console.log('[ContentList] Currently displaying: <td colspan="5">Loading...</td>');
    } else if (items.length === 0) {
      console.log('[ContentList] Currently displaying: "No items found"');
    } else {
      console.log('[ContentList] Currently displaying:', items.length, 'items');
    }
  }, [items, loading, type]);

  const filteredItems = items.filter((item) => {
    if (filterLang !== 'all' && item.lang !== filterLang) return false;
    if (filterStatus === 'published' && !item.published) return false;
    if (filterStatus === 'draft' && item.published) return false;
    if (filterStatus === 'archived' && !item.archived) return false;
    if (searchQuery && !item.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAction = async (action: string, id: string) => {
    try {
      switch (action) {
        case 'publish':
          await onPublish(id);
          setToast({ message: 'Published successfully', type: 'success' });
          break;
        case 'unpublish':
          await onUnpublish(id);
          setToast({ message: 'Unpublished successfully', type: 'success' });
          break;
        case 'archive':
          await onArchive(id);
          setToast({ message: 'Archived successfully', type: 'success' });
          break;
        case 'delete':
          await onDelete(id);
          setToast({ message: 'Deleted successfully', type: 'success' });
          break;
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Action failed', type: 'error' });
    }
    setConfirmAction(null);
  };

  return (
    <>
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-400 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 bg-white transition-colors focus:outline-none"
              style={{ borderColor: '#9CA3AF' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#16345F';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(22, 52, 95, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#9CA3AF';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="rounded-lg border-2 border-gray-400 px-4 py-2 text-sm text-gray-900 bg-white focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-colors focus:outline-none cursor-pointer"
            style={{ borderColor: '#9CA3AF' }}
          >
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border-2 border-gray-400 px-4 py-2 text-sm text-gray-900 bg-white focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-colors focus:outline-none cursor-pointer"
            style={{ borderColor: '#9CA3AF' }}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-r-transparent" style={{ borderColor: '#16345F' }}></div>
                      <span className="ml-3 text-sm text-gray-600">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      {item.slug && (
                        <div className="text-xs text-gray-500 mt-1 font-mono">{item.slug}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {item.lang?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={
                          item.archived
                            ? 'archived'
                            : item.published
                            ? 'published'
                            : 'draft'
                        }
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium">{formatDateTime(item.updated_at)}</span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {getRelativeTime(item.updated_at, item.lang || 'en')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(item.id)}
                          className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                          style={{ color: '#16345F' }}
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onDuplicate(item.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <DocumentDuplicateIcon className="h-5 w-5" />
                        </button>
                        {item.published ? (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                type: 'unpublish',
                                id: item.id,
                                title: item.title,
                              })
                            }
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Unpublish"
                          >
                            <EyeSlashIcon className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                type: 'publish',
                                id: item.id,
                                title: item.title,
                              })
                            }
                            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                            style={{ color: '#00AA81' }}
                            title="Publish"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        )}
                        {!item.archived && (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                type: 'archive',
                                id: item.id,
                                title: item.title,
                              })
                            }
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Archive"
                          >
                            <ArchiveBoxIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: 'delete',
                              id: item.id,
                              title: item.title,
                            })
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmAction && (
        <ConfirmModal
          isOpen={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => handleAction(confirmAction.type, confirmAction.id)}
          title={`Confirm ${confirmAction.type}`}
          message={`Are you sure you want to ${confirmAction.type} "${confirmAction.title}"?`}
          danger={confirmAction.type === 'delete'}
        />
      )}

      {/* Toast */}
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

