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
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
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
  onRefresh?: () => void;
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
  onRefresh,
  loading = false,
}: ContentListProps) {
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 50;
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
    if (filterModule !== 'all' && item.module !== filterModule) return false;
    if (searchQuery && !item.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'title':
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
        break;
      case 'lang':
        aValue = a.lang || '';
        bValue = b.lang || '';
        break;
      case 'status':
        const aStatus = a.archived ? 'archived' : a.published ? 'published' : 'draft';
        const bStatus = b.archived ? 'archived' : b.published ? 'published' : 'draft';
        aValue = aStatus;
        bValue = bStatus;
        break;
      case 'updated_at':
      default:
        aValue = new Date(a.updated_at || 0).getTime();
        bValue = new Date(b.updated_at || 0).getTime();
        break;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Get unique modules for CLKR content
  const availableModules = type === 'clkr'
    ? Array.from(new Set(items.map(item => item.module).filter(Boolean))).sort()
    : [];

  // Pagination
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Handle multiselect
  const handleSelectAll = () => {
    if (selectedItems.size === paginatedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedItems.map(item => item.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Handle status toggle
  const handleStatusToggle = async (item: any) => {
    const action = item.published ? 'unpublish' : 'publish';
    try {
      if (action === 'publish') {
        await onPublish(item.id);
      } else {
        await onUnpublish(item.id);
      }
      // Refresh data
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Action failed', type: 'error' });
    }
  };

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
          {type === 'clkr' && availableModules.length > 0 && (
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="rounded-lg border-2 border-gray-400 px-4 py-2 text-sm text-gray-900 bg-white focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-colors focus:outline-none cursor-pointer"
              style={{ borderColor: '#9CA3AF' }}
            >
              <option value="all">All Modules</option>
              {availableModules.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === paginatedItems.length && paginatedItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Title
                    {sortBy === 'title' ? (
                      sortOrder === 'asc' ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )
                    ) : (
                      <ChevronUpDownIcon className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('lang')}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Language
                    {sortBy === 'lang' ? (
                      sortOrder === 'asc' ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )
                    ) : (
                      <ChevronUpDownIcon className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Status
                    {sortBy === 'status' ? (
                      sortOrder === 'asc' ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )
                    ) : (
                      <ChevronUpDownIcon className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('updated_at')}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Updated
                    {sortBy === 'updated_at' ? (
                      sortOrder === 'asc' ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-r-transparent" style={{ borderColor: '#16345F' }}></div>
                      <span className="ml-3 text-sm text-gray-600">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No items found
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
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
                      <button
                        onClick={() => handleStatusToggle(item)}
                        className="hover:opacity-80 transition-opacity"
                        title={`Click to ${item.published ? 'unpublish' : 'publish'}`}
                      >
                        <StatusBadge
                          status={
                            item.archived
                              ? 'archived'
                              : item.published
                              ? 'published'
                              : 'draft'
                          }
                        />
                      </button>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, sortedItems.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{sortedItems.length}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronUpDownIcon className="h-5 w-5 rotate-90" />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNumber > totalPages) return null;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNumber === currentPage
                            ? 'z-10 bg-primary border-primary text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronUpDownIcon className="h-5 w-5 -rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
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

