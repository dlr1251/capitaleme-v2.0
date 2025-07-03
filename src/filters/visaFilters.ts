import type { Visa } from '../data/visas';
import type { Country } from '../data/countries';

/**
 * Filter visas by country. Only returns visas available to the given country code.
 */
export function filterVisasByCountry(visas: Visa[], countryCode: string): Visa[] {
  return visas.filter(visa => visa.countries.includes(countryCode));
}

/**
 * Filter visas by type (Visitor, Migrant, Resident).
 */
export function filterVisasByType(visas: Visa[], type: Visa['type']): Visa[] {
  return visas.filter(visa => visa.type === type);
}

/**
 * Filter visas by whether they allow beneficiaries.
 */
export function filterVisasByBeneficiaries(visas: Visa[], hasBeneficiaries: boolean): Visa[] {
  return visas.filter(visa => visa.beneficiaries === hasBeneficiaries);
}

/**
 * Filter visas by whether they allow a work permit.
 */
export function filterVisasByWorkPermit(visas: Visa[], hasWorkPermit: boolean): Visa[] {
  return visas.filter(visa => visa.workPermit === hasWorkPermit);
} 