import { supabase } from '../../lib/supabase.server.js';

export interface Visa {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  lang: string;
  published: boolean;
  archived?: boolean;
  last_edited?: string;
  updated_at?: string;
  created_at?: string;
  category?: string;
  country?: string;
  countries?: string[];
  is_popular?: boolean;
  beneficiaries?: string;
  work_permit?: string;
  processing_time?: string;
  requirements?: string;
  emoji?: string;
  alcance?: string;
  duration?: string;
}

/**
 * Get a single visa by slug from Supabase
 */
export async function getVisaBySlug(slug: string, lang: string = 'en'): Promise<Visa | null> {
  try {
    console.log(`[getVisaBySlug] Fetching visa: slug=${slug}, lang=${lang}`);
    
    const { data, error } = await supabase
      .from('visas')
      .select('*')
      .eq('slug', slug)
      .eq('lang', lang)
      .eq('published', true)
      .or('archived.is.null,archived.eq.false')
      .single();

    if (error) {
      console.error(`[getVisaBySlug] Error:`, error);
      return null;
    }

    if (!data) {
      console.warn(`[getVisaBySlug] No visa found for slug: ${slug}, lang: ${lang}`);
      return null;
    }

    console.log(`[getVisaBySlug] Found visa: ${data.title}`);
    return data as Visa;
  } catch (error) {
    console.error(`[getVisaBySlug] Exception:`, error);
    return null;
  }
}

/**
 * Get all visas from Supabase
 */
export async function getAllVisas(lang: string = 'en', includeUnpublished: boolean = false): Promise<Visa[]> {
  try {
    console.log(`[getAllVisas] Fetching visas for lang: ${lang}`);
    
    let query = supabase
      .from('visas')
      .select('*')
      .eq('lang', lang)
      .or('archived.is.null,archived.eq.false')
      .order('title');

    if (!includeUnpublished) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`[getAllVisas] Error:`, error);
      return [];
    }

    console.log(`[getAllVisas] Found ${data?.length || 0} visas`);
    return (data || []) as Visa[];
  } catch (error) {
    console.error(`[getAllVisas] Exception:`, error);
    return [];
  }
}

