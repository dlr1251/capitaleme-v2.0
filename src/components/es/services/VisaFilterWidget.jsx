import React, { useState, useEffect } from 'react';
import countries from '../../../content/countries/Countries.js'
import { FaThLarge, FaList } from "react-icons/fa"; // Import icons for button

const FilterVisaWidget = ({locale, visas}) => {
  
  const [country, setCountry] = useState('');
  const [beneficiaries, setBeneficiaries] = useState(false); 
  const [workPermit, setWorkPermit] = useState(false); 
  const [accrueResidency, setAccrueResidency] = useState(false);
  const [list, setList] = useState([]);
  const [originalList, setOriginalList] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false); //
  const [itemsPerPage] = useState(50); 
  const [totalPages, setTotalPages] = useState(0);
  const [showCountrySelectorError, setShowCountrySelectorError] = useState(false);
  const [viewMode, setViewMode] = useState("cards"); 

  
  
  useEffect(() => {
    setList(visas);
    setOriginalList(visas);
  }, [visas]);

  useEffect(() => {    
    const countryInfo = countries.find(info => info.Country === country);
    if (!countryInfo) {
      setList(originalList);
      return;
    }

    const categories = []    
    if (countryInfo["Excempted?"] === "Yes") categories.push("Exempted");
    if (countryInfo["Excempted?"] === "No") categories.push("Not exempted");
    if (countryInfo["Excempted?"] === "Schengen visa") categories.push("Schengen visa");
    // if (countryInfo["airport transit"] === "Yes") categories.push("Airport Transit");
    if (countryInfo.Treaties) categories.push(...countryInfo.Treaties.split(", "));
    
    
    const filteredList = originalList.filter(visa => {
      const isExemptedCountry = categories.includes("Exempted");
      const isNotExemptedCountry = categories.includes("Not exempted");
      const isCAN = categories.includes("CAN");
      const isMercosur = categories.includes("Mercosur");
      const isWorkingHolidays = categories.includes("Working holidays");
      
      const meetsBeneficiariesCondition = !beneficiaries || (beneficiaries && visa.data.beneficiaries.includes('yes'));
      const meetsWorkPermitCondition = !workPermit || (workPermit && visa.data.workPermit.includes('yes')) ;
      const meetsResidencyCondition = !accrueResidency || (accrueResidency && visa.data.type === 'Migrant');
      
    
      const hasExemptedVisa = visa.data.countries.includes("Exempted");
      const hasNotExemptedVisa = visa.data.countries.includes("Not exempted");
      const hasCANVisa = visa.data.countries.includes("CAN");
      const hasMercosurVisa = visa.data.countries.includes("Mercosur");
      const hasWorkingHolidayVisa = visa.data.countries.includes("Working holidays");
    

      const decision = ((isExemptedCountry && (hasExemptedVisa || hasCANVisa && isCAN || hasMercosurVisa && isMercosur) && !hasNotExemptedVisa) ||
                  (isNotExemptedCountry && (hasNotExemptedVisa || hasCANVisa && isCAN || hasMercosurVisa && isMercosur) && !hasExemptedVisa) ||
                  (isCAN) && (hasCANVisa || (isExemptedCountry && hasExemptedVisa) || (isNotExemptedCountry && hasNotExemptedVisa)) ||
                  (isMercosur) && (hasMercosurVisa || (isExemptedCountry && hasExemptedVisa) || (isNotExemptedCountry && hasNotExemptedVisa)) ||
                  (isWorkingHolidays) && (hasWorkingHolidayVisa || (isExemptedCountry && hasExemptedVisa) || (isNotExemptedCountry && hasNotExemptedVisa)) ||
                  visa.data.countries.some(visaCategory => categories.includes(visaCategory))) &&
                  meetsBeneficiariesCondition && meetsWorkPermitCondition && meetsResidencyCondition;

      return decision;
    });

    setList(filteredList);
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500); // Vuelve al estado normal después de 0.5 segundos
    return () => clearTimeout(timer); 
    
  }, [country, beneficiaries, workPermit, accrueResidency, originalList]);

  useEffect(() => {
    setTotalPages(Math.ceil(list.length / itemsPerPage));
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [list, itemsPerPage, currentPage, totalPages]);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
  console.log('current items',currentItems);
  
  
  return (
    <div 
    className={`flex flex-col p-4 rounded-lg border border-grey-200 transition-colors duration-500  ${
      isAnimating ? "bg-secondary" : "bg-white"
    }`}>
      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row lg:space-x-8 mb-8">
        
        {/* Left Column: Filters */}
        <div className="flex flex-col lg:w-1/4 shadow-lg p-4 rounded-lg bg-white border border-secondary">
          <form className="w-full mb-4">
            <select
              className={`w-full bg-gray-50 borderrounded-lg ${
                showCountrySelectorError ? 'border-red-400' : 'border-gray-300'
              } text-gray-700 rounded-lg text-sm focus:ring-blue-400 focus:border-blue-400 p-2.5`}
              id="countries"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setShowCountrySelectorError(false);
              }}
            >
              <option value="">Choose your country</option>
              {countries
                .sort((a, b) => a.CountryEn.localeCompare(b.CountryEn))
                .map((c, i) => (
                  <option key={i} value={c.Country}>
                    {locale === 'es' ? c.Country : c.CountryEn}
                  </option>
                ))}
            </select>
          </form>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={beneficiaries}
              onChange={(e) => {
                setBeneficiaries(e.target.checked);
                if (!country) setShowCountrySelectorError(true);
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 hover:text-gray-900"
            />
            <span className="py-4 font-medium text-gray-500 text-sm">Traes beneficiarios</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={workPermit}
              onChange={(e) => {
                setWorkPermit(e.target.checked);
                if (!country) setShowCountrySelectorError(true);
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 hover:text-gray-900"
            />
            <span className="py-4 font-medium text-gray-500 text-sm">Permiso de trabajo abierto</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={accrueResidency}
              onChange={(e) => {
                setAccrueResidency(e.target.checked);
                if (!country) setShowCountrySelectorError(true);
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 hover:text-gray-900"
            />
            <span className="py-4 font-medium text-gray-500 text-sm">Acumulan tiempo para residencia</span>
          </label>
          <button className="mt-4 flex items-center px-4 py-2 border text-gray-800 rounded-lg group hover:border-primary"
            onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}
          >
            {viewMode === "cards" ? <FaList  size={20} /> : <FaThLarge  size={20} />}
            <span className="ml-2 text-sm text-primary">{viewMode === "cards" ? "List View" : "Card View"}</span>
          </button>
        </div>

      {/* Right Column: Announcement */}
      <div className="lg:w-3/4 bg-gray-100 p-4 rounded-lg shadow-lg text-primary">
        <h3 className="text-lg font-bold">¿Para qué categoría de visa debo aplicar?</h3>
        <p className="mt-2">          
          Hay más de 45 categorías de visas para el 2025, cada una con sus propios requisitos, limitaciones y costos asociados. Elegir la categoría de visa correcta es la mejor manera de comenzar tu estrategia migratoria.
        </p>
  
          <ol class="relative border-s border-gray-200 mt-4">                  
              <li class="mb-10 ms-6 ml-4">            
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                      <svg class="w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                      </svg>
                  </span>
                  <h3 class="leading-tight">Elige tu país</h3>
                  <p class="text-sm text-gray-500">Algunas visas son específicas para ciertos países</p>
              </li>
              <li class="mb-10 ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                      <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                          <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z"/>
                      </svg>
                  </span>
                  <h3 class="font-medium leading-tight">¿Traes cónyuge e hijos?</h3>
                  <p class="text-sm">Algunas categorías permiten beneficiarios</p>
              </li>
              <li class="mb-10 ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                      <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                          <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                      </svg>
                  </span>
                  <h3 class="font-medium leading-tight">Permiso de trabajo abierto</h3>
                  <p class="text-sm">Definido bajo las normas laborales colombianas</p>
              </li>
              <li class="ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                      <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                          <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z"/>
                      </svg>
                  </span>
                  <h3 class="font-medium leading-tight">Acumula tiempo para la residencia</h3>
                  <p class="text-sm">Haz de Colombia tu hogar.</p>
              </li>
          </ol>

      </div>
    </div>
  

       {/* Visa Display - Cards */}
       {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentItems.map((visa, index) => (
            <a
              key={index}
              href={`/visas/${visa.slug.slice(3)}`}
              className="bg-white border rounded-lg p-6 group hover:shadow-xl transition-shadow flex flex-col justify-between"
            >
              <h4 className="text-lg font-bold text-primary group-hover:text-secondary">
                {visa.data.title.slice(3)}
              </h4>
              <p className="text-sm text-gray-600 mt-2">{visa.data.short_description}</p>
              <div className="">
                <div className="text-sm mt-4">
                  <span className="font-bold text-secondary">Beneficiarios:</span> {visa.data.beneficiaries.includes("yes") ? "Yes" : "No"}
                </div>
                <div className="text-sm">
                <span className="font-bold text-secondary">Permiso de Trabajo:</span> {visa.data.workPermit.includes("yes") ? "Yes" : visa.data.workPermit}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-lg">
          {currentItems.map((visa, index) => (
            <li key={index} className="p-4 hover:bg-gray-100 transition-colors">
              <a href={`/visas/${visa.slug.slice(3)}`}>
                <div className="">{index + 1}/{currentItems.length}</div>
                <h4 className="text-lg font-semibold text-gray-800">{visa.data.title.slice(3)}</h4>
                <p className="text-sm text-gray-600">{visa.data.short_description}</p>
                <div className="text-sm mt-2">
                  Beneficiaries: {visa.data.beneficiaries.includes("yes") ? "Yes" : "No"} | Work
                  Permit: {visa.data.workPermit.includes("yes") ? "Yes" : visa.data.workPermit}
                  
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}

      
    </div>
  );
};

export default FilterVisaWidget;