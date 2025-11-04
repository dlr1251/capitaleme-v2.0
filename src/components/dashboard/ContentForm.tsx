import { useState, useEffect } from 'react';
import { Input } from '../ui/Input.js';
import { generateSlug } from '../../lib/dashboard/utils.js';
import { validateTitle, validateSlug, validateLang } from '../../lib/dashboard/validations.js';
import MarkdownEditor from './MarkdownEditor.js';

interface ContentFormProps {
  initialData?: {
    title?: string;
    slug?: string;
    description?: string;
    content?: string;
    lang?: string;
    published?: boolean;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ContentForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: ContentFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [lang, setLang] = useState(initialData?.lang || 'en');
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.published ? 'published' : 'draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSlugManual, setIsSlugManual] = useState(false);

  useEffect(() => {
    if (!isSlugManual && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isSlugManual]);

  const handleSlugChange = (value: string) => {
    setIsSlugManual(true);
    setSlug(value);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    const titleValidation = validateTitle(title);
    if (!titleValidation.valid) {
      newErrors.title = titleValidation.error || '';
    }

    const slugValidation = validateSlug(slug);
    if (!slugValidation.valid) {
      newErrors.slug = slugValidation.error || '';
    }

    const langValidation = validateLang(lang);
    if (!langValidation.valid) {
      newErrors.lang = langValidation.error || '';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      title,
      slug,
      description,
      content,
      lang,
      published: status === 'published',
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          className={errors.title ? 'border-red-300' : ''}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
          Slug *
        </label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder="URL-friendly slug"
          className={errors.slug ? 'border-red-300' : ''}
        />
        {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
        <p className="mt-1 text-xs text-gray-500">Auto-generated from title, or edit manually</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors"
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#16345F';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(22, 52, 95, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#D1D5DB';
            e.currentTarget.style.boxShadow = 'none';
          }}
          placeholder="Brief description"
        />
      </div>

      {/* Language */}
      <div>
        <label htmlFor="lang" className="block text-sm font-medium text-gray-700 mb-2">
          Language *
        </label>
        <select
          id="lang"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition-colors"
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#16345F';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(22, 52, 95, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#D1D5DB';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
        {errors.lang && <p className="mt-1 text-sm text-red-600">{errors.lang}</p>}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition-colors"
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#16345F';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(22, 52, 95, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#D1D5DB';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {status === 'draft' 
            ? 'This content will not be visible on the frontend' 
            : 'This content will be visible on the frontend'}
        </p>
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="Write your content in Markdown..."
        />
        <p className="mt-1 text-xs text-gray-500">Markdown supported. Use the toolbar to format text and upload images/files.</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 transition-all shadow-sm hover:opacity-90"
          style={{ backgroundColor: status === 'published' ? '#16345F' : '#6B7280' }}
        >
          {loading 
            ? (status === 'published' ? 'Publishing...' : 'Saving...') 
            : (status === 'published' ? 'Save & Publish' : 'Save as Draft')}
        </button>
      </div>
    </form>
  );
}

