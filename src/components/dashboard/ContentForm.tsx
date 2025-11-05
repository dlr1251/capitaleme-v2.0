import { useState, useEffect } from 'react';
import { getAuthToken } from '../../lib/dashboard/auth-token.js';
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
  enableGrok?: boolean;
}

export default function ContentForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  enableGrok = false,
}: ContentFormProps) {
  console.log('[ContentForm] ========== COMPONENT RENDERED ==========');
  console.log('[ContentForm] ContentForm component rendering');
  console.log('[ContentForm] Props:', { 
    hasInitialData: !!initialData, 
    loading, 
    hasOnSubmit: typeof onSubmit === 'function',
    hasOnCancel: typeof onCancel === 'function',
  });
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [lang, setLang] = useState(initialData?.lang || 'en');
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.published ? 'published' : 'draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  console.log('[ContentForm] Initial state:', {
    title,
    slug,
    lang,
    status,
    hasContent: !!content,
    loading,
    isSubmitting,
  });

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

    // Content is only required when publishing, not for drafts
    if (status === 'published' && (!content || content.trim().length === 0)) {
      newErrors.content = 'Content is required for published posts';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleSubmit = async () => {
    console.log('[ContentForm] ========== HANDLE SUBMIT CALLED ==========');
    console.log('[ContentForm] handleSubmit function executed');
    console.log('[ContentForm] Form submission started');
    console.log('[ContentForm] Current status:', status);
    console.log('[ContentForm] Will be published:', status === 'published');
    console.log('[ContentForm] Button was:', status === 'published' ? 'Save & Publish' : 'Save as Draft');
    console.log('[ContentForm] Current loading state:', loading);
    console.log('[ContentForm] Current isSubmitting state:', isSubmitting);
    
    // Prevent multiple simultaneous submissions
    if (isSubmitting || loading) {
      console.warn('[ContentForm] Already submitting, ignoring click');
      return;
    }
    
    setIsSubmitting(true);
    setGeneralError('');
    
    try {
      // Validate first and capture errors
      console.log('[ContentForm] Starting validation...');
      const validation = validate();
      console.log('[ContentForm] Validation result:', {
        isValid: validation.isValid,
        errors: validation.errors,
        errorCount: Object.keys(validation.errors).length,
      });
      
      if (!validation.isValid) {
        console.warn('[ContentForm] Validation failed:', validation.errors);
        const errorFields = Object.keys(validation.errors);
        if (errorFields.length > 0) {
          const errorMessages = errorFields.map(field => {
            const fieldName = field === 'title' ? 'Title' : 
                             field === 'slug' ? 'Slug' : 
                             field === 'lang' ? 'Language' : 
                             field === 'content' ? 'Content' : field;
            return `${fieldName}: ${validation.errors[field]}`;
          }).join(', ');
          console.error('[ContentForm] Setting general error:', errorMessages);
          setGeneralError(`Please fix the following errors: ${errorMessages}`);
        } else {
          const requiredFields = status === 'published' 
            ? 'Title, Slug, Language, and Content are required' 
            : 'Title, Slug, and Language are required (Content is optional for drafts)';
          console.error('[ContentForm] Setting general error:', requiredFields);
          setGeneralError(`Please fill in all required fields: ${requiredFields}`);
        }
        console.log('[ContentForm] Validation failed, stopping submission');
        setIsSubmitting(false);
        return;
      }

      console.log('[ContentForm] Validation passed, preparing submit data...');
      
      const submitData = {
        title,
        slug,
        description,
        content,
        lang,
        published: status === 'published',
      };
      
      console.log('[ContentForm] ========== SUBMITTING DATA ==========');
      console.log('[ContentForm] Submit data:', {
        title,
        slug,
        lang,
        status,
        published: submitData.published,
        hasDescription: !!description,
        descriptionLength: description?.length || 0,
        hasContent: !!content,
        contentLength: content?.length || 0,
        fullData: submitData,
      });
      
      console.log('[ContentForm] Calling onSubmit callback...');
      await onSubmit(submitData);
      console.log('[ContentForm] onSubmit callback completed successfully');
    } catch (error: any) {
      console.error('[ContentForm] ========== SUBMIT ERROR ==========');
      console.error('[ContentForm] Error in handleSubmit:', error);
      console.error('[ContentForm] Error message:', error.message);
      console.error('[ContentForm] Error stack:', error.stack);
      const errorMessage = error.message || 'Failed to save. Please try again.';
      setGeneralError(errorMessage);
      // Don't re-throw - handle it here to prevent page reload
    } finally {
      setIsSubmitting(false);
      console.log('[ContentForm] Submission process completed, isSubmitting set to false');
    }
  };

  const handleGrokGenerate = async () => {
    if (!enableGrok) return;
    if (!title || title.trim().length === 0) {
      setGeneralError('Please enter a title before generating a draft with Grok');
      return;
    }

    try {
      setGeneralError('');
      setIsGenerating(true);
      const token = await getAuthToken();

      const res = await fetch('/api/dashboard/grok-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Generation failed' }));
        throw new Error(err.error || 'Generation failed');
      }

      const data = await res.json();
      if (!data?.markdown) {
        throw new Error('Empty response from generator');
      }

      setContent(data.markdown);
    } catch (error: any) {
      setGeneralError(error.message || 'Failed to generate with Grok');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[ContentForm] Form onSubmit prevented - using button onClick instead');
      return false;
    }} className="space-y-6">
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
          Content {status === 'published' ? '*' : ''}
        </label>
        <div className={errors.content ? 'border border-red-300 rounded-lg' : ''}>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Write your content in Markdown..."
          />
        </div>
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        <p className="mt-1 text-xs text-gray-500">
          {status === 'published' 
            ? 'Content is required for published posts. Markdown supported. Use the toolbar to format text and upload images/files.'
            : 'Markdown supported. Use the toolbar to format text and upload images/files. Content can be added later for drafts.'}
        </p>
      </div>

      {/* General Error Message */}
      {generalError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{generalError}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        {enableGrok && (
          <button
            type="button"
            onClick={handleGrokGenerate}
            disabled={loading || isSubmitting || isGenerating}
            title="Generates a complete Markdown draft using Grok based on the title."
            className="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:opacity-90"
            style={{ backgroundColor: '#16345F' }}
          >
            {isGenerating ? 'Generating…' : 'Create draft with Grok'}
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            console.log('[ContentForm] ========== BUTTON CLICKED ==========');
            console.log('[ContentForm] Button clicked event fired');
            console.log('[ContentForm] Event details:', {
              type: e.type,
              target: e.target,
              currentTarget: e.currentTarget,
            });
            
            // Prevent any default behavior
            e.preventDefault();
            e.stopPropagation();
            console.log('[ContentForm] Event prevented and stopped');
            
            console.log('[ContentForm] Button type:', status === 'published' ? 'Save & Publish' : 'Save as Draft');
            console.log('[ContentForm] Current form state:', {
              title,
              slug,
              lang,
              status,
              hasContent: !!content,
              contentLength: content?.length || 0,
              loading,
              isSubmitting,
              disabled: loading || isSubmitting,
            });
            console.log('[ContentForm] Validation errors:', errors);
            console.log('[ContentForm] Calling handleSubmit...');
            
            // Call handleSubmit (it's async but we don't await to prevent blocking)
            handleSubmit().catch((error) => {
              console.error('[ContentForm] Unhandled error in button onClick:', error);
            });
          }}
          disabled={loading || isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:opacity-90"
          style={{ backgroundColor: status === 'published' ? '#16345F' : '#6B7280' }}
        >
          {(loading || isSubmitting)
            ? (status === 'published' ? 'Publishing...' : 'Saving...') 
            : (status === 'published' ? 'Save & Publish' : 'Save as Draft')}
        </button>
      </div>
    </form>
  );
}

