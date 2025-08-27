export interface Visa {
  id: string;
  title: string;
  slug: string;
  description: string;
  countries: string[];
  beneficiaries?: string;
  workPermit?: string;
  type: 'Visitor' | 'Migrant' | 'Resident';
  isPopular?: boolean;
  emoji?: string;
  alcance?: string;
  lastEdited?: string;
  duration?: string;
}

export declare const visas: Visa[]; 