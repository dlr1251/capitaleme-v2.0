// Helper functions for safely accessing Notion properties
import type { 
  NotionPage, 
  NotionProperty, 
  NotionTitleProperty,
  NotionRichTextProperty,
  NotionSelectProperty,
  NotionCheckboxProperty,
  NotionDateProperty,
  NotionFilesProperty
} from './notionTypes.js';
import { 
  extractTitle, 
  extractRichText, 
  extractSelect, 
  extractCheckbox, 
  extractDate, 
  extractFiles 
} from './notionTransform.js';

// --- Safe Property Access Helpers ---

export function getPageTitle(page: NotionPage, propertyName: string = 'Name'): string {
  const property = page.properties[propertyName];
  if (!property) return 'Untitled';
  return extractTitle(property);
}

export function getPageDescription(page: NotionPage, propertyName: string = 'Description'): string {
  const property = page.properties[propertyName];
  if (!property) return '';
  return extractRichText(property);
}

export function getPageSlug(page: NotionPage, propertyName: string = 'slug'): string {
  const property = page.properties[propertyName];
  if (!property) return '';
  const slug = extractRichText(property);
  return slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getPageSelectValue(page: NotionPage, propertyName: string): string | null {
  const property = page.properties[propertyName];
  if (!property) return null;
  return extractSelect(property);
}

export function getPageCheckboxValue(page: NotionPage, propertyName: string): boolean {
  const property = page.properties[propertyName];
  if (!property) return false;
  return extractCheckbox(property);
}

export function getPageDateValue(page: NotionPage, propertyName: string): string | null {
  const property = page.properties[propertyName];
  if (!property) return null;
  return extractDate(property);
}

export function getPageFiles(page: NotionPage, propertyName: string): string[] {
  const property = page.properties[propertyName];
  if (!property) return [];
  return extractFiles(property);
}

// --- Type Guards for Properties ---

export function isTitleProperty(property: NotionProperty): property is NotionTitleProperty {
  return property.type === 'title';
}

export function isRichTextProperty(property: NotionProperty): property is NotionRichTextProperty {
  return property.type === 'rich_text';
}

export function isSelectProperty(property: NotionProperty): property is NotionSelectProperty {
  return property.type === 'select';
}

export function isCheckboxProperty(property: NotionProperty): property is NotionCheckboxProperty {
  return property.type === 'checkbox';
}

export function isDateProperty(property: NotionProperty): property is NotionDateProperty {
  return property.type === 'date';
}

export function isFilesProperty(property: NotionProperty): property is NotionFilesProperty {
  return property.type === 'files';
}

// --- Safe Property Access with Type Guards ---

export function getTitleProperty(page: NotionPage, propertyName: string): NotionTitleProperty | null {
  const property = page.properties[propertyName];
  return isTitleProperty(property) ? property : null;
}

export function getRichTextProperty(page: NotionPage, propertyName: string): NotionRichTextProperty | null {
  const property = page.properties[propertyName];
  return isRichTextProperty(property) ? property : null;
}

export function getSelectProperty(page: NotionPage, propertyName: string): NotionSelectProperty | null {
  const property = page.properties[propertyName];
  return isSelectProperty(property) ? property : null;
}

export function getCheckboxProperty(page: NotionPage, propertyName: string): NotionCheckboxProperty | null {
  const property = page.properties[propertyName];
  return isCheckboxProperty(property) ? property : null;
}

export function getDateProperty(page: NotionPage, propertyName: string): NotionDateProperty | null {
  const property = page.properties[propertyName];
  return isDateProperty(property) ? property : null;
}

export function getFilesProperty(page: NotionPage, propertyName: string): NotionFilesProperty | null {
  const property = page.properties[propertyName];
  return isFilesProperty(property) ? property : null;
}

// --- Legacy Compatibility Helpers ---

// For components that expect the old property structure
export function getLegacyPropertyValue(page: NotionPage, propertyName: string, field: string): any {
  const property = page.properties[propertyName];
  if (!property) return null;
  
  switch (property.type) {
    case 'title':
      return property.title;
    case 'rich_text':
      return property.rich_text;
    case 'select':
      return property.select;
    case 'checkbox':
      return property.checkbox;
    case 'date':
      return property.date;
    case 'files':
      return property.files;
    default:
      return (property as any)[field];
  }
}

// --- Page Filtering Helpers ---

export function filterPagesByLanguage(pages: NotionPage[], language: string): NotionPage[] {
  return pages.filter(page => {
    const langProperty = getPageSelectValue(page, 'Lang');
    return langProperty === language;
  });
}

export function filterPagesByCategory(pages: NotionPage[], category: string): NotionPage[] {
  return pages.filter(page => {
    const categoryProperty = getPageSelectValue(page, 'Category');
    return categoryProperty === category;
  });
}

// --- Page Grouping Helpers ---

export function groupPagesByCategory(pages: NotionPage[]): Record<string, NotionPage[]> {
  const grouped: Record<string, NotionPage[]> = {};
  
  pages.forEach(page => {
    const category = getPageSelectValue(page, 'Category') || 'Uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(page);
  });
  
  return grouped;
}

// --- Rich Text Rendering Helper ---

export function renderRichTextSafely(richText: any[]): string {
  if (!Array.isArray(richText)) return '';
  
  return richText.map((item) => {
    if (!item || typeof item !== 'object') return '';
    
    let content = item.plain_text || item.text?.content || '';
    let className = '';
    
    if (item.annotations) {
      if (item.annotations.bold) className += 'font-bold ';
      if (item.annotations.italic) className += 'italic ';
      if (item.annotations.strikethrough) className += 'line-through ';
      if (item.annotations.underline) className += 'underline ';
      if (item.annotations.code) className += 'font-mono bg-gray-100 px-1 rounded ';
      if (item.annotations.color && item.annotations.color !== 'default') {
        className += `text-${item.annotations.color}-600 `;
      }
    }
    
    if (item.href) {
      return `<a href="${item.href}" class="${className}">${content}</a>`;
    }
    
    return `<span class="${className}">${content}</span>`;
  }).join('');
} 

// --- Yes/No Normalization Helper ---
export function normalizeYesNo(value: string | undefined | null): 'yes' | 'no' {
  if (!value) return 'no';
  return value.trim().toLowerCase() === 'yes' ? 'yes' : 'no';
} 