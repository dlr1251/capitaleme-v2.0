import { useState, useMemo } from 'react';
import { countries } from '../data/countries';
import { visas } from '../data/visas';
import type { Country } from '../data/countries';
import type { Visa } from '../data/visas';
import {
  filterVisasByCountry,
  filterVisasByType,
  filterVisasByBeneficiaries,
  filterVisasByWorkPermit,
} from '../filters/visaFilters';

export default function VisaFilterWidget() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [visaType, setVisaType] = useState<Visa['type'] | ''>('');
  const [beneficiaries, setBeneficiaries] = useState<boolean | null>(null);
  const [workPermit, setWorkPermit] = useState<boolean | null>(null);

  const filteredVisas = useMemo(() => {
    let result = visas;
    if (selectedCountry) {
      result = filterVisasByCountry(result, selectedCountry);
    }
    if (visaType) {
      result = filterVisasByType(result, visaType);
    }
    if (beneficiaries !== null) {
      result = filterVisasByBeneficiaries(result, beneficiaries);
    }
    if (workPermit !== null) {
      result = filterVisasByWorkPermit(result, workPermit);
    }
    return result;
  }, [selectedCountry, visaType, beneficiaries, workPermit]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Filtra Visas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Country Selector */}
        <div>
          <label className="block mb-1 font-medium">País</label>
          <select
            className="w-full border rounded p-2"
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
          >
            <option value="">Todos los países</option>
            {countries.map((c: Country) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        {/* Visa Type Selector */}
        <div>
          <label className="block mb-1 font-medium">Tipo de Visa</label>
          <select
            className="w-full border rounded p-2"
            value={visaType}
            onChange={e => setVisaType(e.target.value as Visa['type'])}
          >
            <option value="">Todos los tipos</option>
            <option value="Visitor">Visitante</option>
            <option value="Migrant">Migrante</option>
            <option value="Resident">Residente</option>
          </select>
        </div>
        {/* Beneficiaries Checkbox */}
        <div>
          <label className="block mb-1 font-medium">Permite Beneficiarios</label>
          <input
            type="checkbox"
            checked={beneficiaries === true}
            onChange={e => setBeneficiaries(e.target.checked ? true : null)}
          />
          <span className="ml-2">Sí</span>
        </div>
        {/* Work Permit Checkbox */}
        <div>
          <label className="block mb-1 font-medium">Permiso de Trabajo</label>
          <input
            type="checkbox"
            checked={workPermit === true}
            onChange={e => setWorkPermit(e.target.checked ? true : null)}
          />
          <span className="ml-2">Sí</span>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Resultados ({filteredVisas.length})</h3>
        <ul className="space-y-4">
          {filteredVisas.map((visa) => (
            <li key={visa.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xl">{visa.emoji}</div>
                <div className="font-bold">{visa.title}</div>
                <div className="text-gray-600 text-sm">{visa.description}</div>
                <div className="text-xs text-gray-400">{visa.alcance}</div>
              </div>
              <div className="mt-2 md:mt-0 flex flex-col items-end">
                <span className="text-xs">Tipo: {visa.type}</span>
                <span className="text-xs">Beneficiarios: {visa.beneficiaries ? 'Sí' : 'No'}</span>
                <span className="text-xs">Permiso de trabajo: {visa.workPermit ? 'Sí' : 'No'}</span>
                <span className="text-xs">Duración: {visa.duration}</span>
              </div>
            </li>
          ))}
        </ul>
        {filteredVisas.length === 0 && (
          <div className="text-center text-gray-500 mt-8">No se encontraron visas con los filtros seleccionados.</div>
        )}
      </div>
    </div>
  );
} 