export type Visa = {
  id: string;
  title: string;
  slug: string;
  description: string;
  countries: string[]; // Array of country codes
  beneficiaries?: boolean;
  workPermit?: boolean;
  type: 'Visitor' | 'Migrant' | 'Resident';
  isPopular?: boolean;
  emoji?: string;
  alcance?: string;
  lastEdited?: string;
  duration?: string;
};

export const visas: Visa[] = [
  {
    id: 'v1',
    title: 'Visa de Turista',
    slug: 'turista',
    description: 'Permite visitar Colombia por turismo.',
    countries: ['US', 'ES', 'FR', 'CO'],
    beneficiaries: false,
    workPermit: false,
    type: 'Visitor',
    isPopular: true,
    emoji: '🛂',
    alcance: 'Turismo',
    duration: '90 días',
  },
  {
    id: 'v2',
    title: 'Visa de Migrante',
    slug: 'migrante',
    description: 'Para quienes desean residir en Colombia.',
    countries: ['US', 'CO'],
    beneficiaries: true,
    workPermit: true,
    type: 'Migrant',
    isPopular: false,
    emoji: '🏠',
    alcance: 'Residencia',
    duration: '1 año',
  },
  // ...add more visas as needed
]; 