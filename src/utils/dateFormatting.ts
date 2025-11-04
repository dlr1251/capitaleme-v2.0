// Date formatting utilities for use in Astro files

export function getRelativeTime(dateString: string, lang: string = 'en'): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
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

export function formatDateTime(dateString: string, lang: string = 'en'): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(dateString: string, lang: string = 'en'): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

