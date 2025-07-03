// Type definitions
interface PropertyFiltersProps {
  className?: string;
}

const PropertyFilters = ({ className }: PropertyFiltersProps) => {
  return (
    <div className={className}>
      <div className="space-y-4">
        <select className="form-select text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-secondary w-full">
          <option value="">Barrio</option>
          <option value="medellin">Laureles</option>
          <option value="bogota">Envigado</option>
          <option value="antioquia">Antioquia</option>
        </select>

        <select className="form-select text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-secondary w-full">
          <option value="">Rango de Precio</option>
          <option value="range1">$50,000 - $100,000</option>
          <option value="range2">$100,000 - $200,000</option>
        </select>

        {/* Additional filters */}
        <div className="flex flex-col space-y-4">
          {['Elegible para Visa', 'Piscina', 'Estacionamiento', 'Seguridad 24/7'].map((filter) => (
            <label key={filter} className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-secondary h-5 w-5" />
              <span className="ml-2 text-gray-700">{filter}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters; 