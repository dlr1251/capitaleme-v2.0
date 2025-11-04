import { calculateReadingTimeFromText } from '../../utils/readingTime.js';

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  return calculateReadingTimeFromText(content);
}

export function formatDate(date: string | Date | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRelativeTime(date: string | Date | null, lang: string = 'en'): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInSeconds = Math.floor(diffInMs / 1000);

  if (lang === 'es') {
    if (diffInDays > 0) {
      return diffInDays === 1 ? 'hace 1 día' : `hace ${diffInDays} días`;
    } else if (diffInHours > 0) {
      return diffInHours === 1 ? 'hace 1 hora' : `hace ${diffInHours} horas`;
    } else if (diffInMinutes > 0) {
      return diffInMinutes === 1 ? 'hace 1 minuto' : `hace ${diffInMinutes} minutos`;
    } else if (diffInSeconds > 10) {
      return `hace ${diffInSeconds} segundos`;
    } else {
      return 'ahora mismo';
    }
  } else {
    if (diffInDays > 0) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else if (diffInHours > 0) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInMinutes > 0) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    } else if (diffInSeconds > 10) {
      return `${diffInSeconds} seconds ago`;
    } else {
      return 'Just now';
    }
  }
}

export function formatDateWithRelative(date: string | Date | null, lang: string = 'en'): string {
  if (!date) return '';
  const absolute = formatDateTime(date);
  const relative = getRelativeTime(date, lang);
  return `${absolute} (${relative})`;
}

