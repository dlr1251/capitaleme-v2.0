import { useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAuthToken } from '../../lib/dashboard/auth-token.js';
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  LinkIcon,
  PhotoIcon,
  DocumentIcon,
  CodeBracketIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content in Markdown...',
  className = '',
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [value, onChange]);

  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = value.substring(0, start) + text + value.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + text.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [value, onChange]);

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'heading':
        insertText('## ', '');
        break;
      case 'list':
        insertText('- ', '');
        break;
      case 'link':
        insertText('[', '](url)');
        break;
      case 'code':
        insertText('`', '`');
        break;
      case 'codeBlock':
        insertText('```\n', '\n```');
        break;
      case 'image':
        fileInputRef.current?.click();
        break;
      case 'file':
        fileInputRef.current?.click();
        break;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    let token: string | null = null;
    
    try {
      // Try to get token, but don't let errors interrupt the upload flow
      try {
        token = await getAuthToken();
      } catch (authError: any) {
        console.warn('[MarkdownEditor] Auth error, but continuing:', authError.message);
        // If it's a critical auth error, we'll handle it in the fetch catch
        if (authError.message?.includes('refresh_token_not_found') || 
            authError.message?.includes('refresh token expired') ||
            authError.message?.includes('Invalid refresh token')) {
          throw authError; // Re-throw critical errors
        }
        // For other errors, try one more time
        try {
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait a bit
          token = await getAuthToken();
        } catch (retryError) {
          throw authError; // Use original error
        }
      }

      if (!token) {
        throw new Error('Could not obtain authentication token');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'resources');

      const response = await fetch('/api/dashboard/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        // Handle 401/403 specifically
        if (response.status === 401 || response.status === 403) {
          const error = await response.json().catch(() => ({ error: 'Authentication failed' }));
          throw new Error(error.error || 'Authentication failed. Please try logging in again.');
        }
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Insert markdown based on file type
      if (file.type.startsWith('image/')) {
        const altText = file.name.replace(/\.[^/.]+$/, '');
        insertAtCursor(`![${altText}](${data.url})`);
      } else {
        insertAtCursor(`[${file.name}](${data.url})`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Upload failed';
      
      // Check if it's a critical auth error that requires redirect
      const isCriticalAuthError = errorMessage.includes('refresh_token_not_found') || 
                                  errorMessage.includes('refresh token expired') ||
                                  errorMessage.includes('Invalid refresh token') ||
                                  errorMessage.includes('Not authenticated');
      
      if (isCriticalAuthError) {
        // Don't show alert, let the auth system handle redirect
        console.log('[MarkdownEditor] Critical auth error detected, redirect will happen automatically');
      } else {
        // Show user-friendly error for other issues
        alert(`Upload failed: ${errorMessage}`);
      }
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const toolbarButtons = [
    { action: 'heading', icon: Bars3Icon, label: 'Heading' },
    { action: 'bold', icon: BoldIcon, label: 'Bold' },
    { action: 'italic', icon: ItalicIcon, label: 'Italic' },
    { action: 'list', icon: ListBulletIcon, label: 'List' },
    { action: 'link', icon: LinkIcon, label: 'Link' },
    { action: 'code', icon: CodeBracketIcon, label: 'Code' },
    { action: 'image', icon: PhotoIcon, label: 'Image' },
    { action: 'file', icon: DocumentIcon, label: 'File' },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border border-gray-300 rounded-t-lg bg-gray-50 flex-wrap">
        {toolbarButtons.map((button) => {
          const IconComponent = button.icon;
          return (
            <button
              key={button.action}
              type="button"
              onClick={() => handleToolbarAction(button.action)}
              disabled={isUploading}
              className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={button.label}
              style={{ color: '#16345F' }}
            >
              <IconComponent className="h-4 w-4" />
            </button>
          );
        })}
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors"
          style={{ color: '#16345F' }}
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      {/* Editor or Preview */}
      {showPreview ? (
        <div className="min-h-[400px] rounded-b-lg border border-gray-300 border-t-0 bg-white p-4 prose prose-sm max-w-none overflow-auto">
          {isUploading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
              Uploading file...
            </div>
          )}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value || '*No content*'}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="relative">
          {isUploading && (
            <div className="absolute top-2 right-2 z-10 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 flex items-center gap-2">
              <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Uploading...
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={15}
            className="block w-full rounded-b-lg border border-gray-300 border-t-0 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono resize-y"
            style={{ minHeight: '400px' }}
          />
        </div>
      )}
    </div>
  );
}

