import React, { useState, useEffect } from 'react';
import { getCollection, getEntry } from 'astro:content';

import countries from '../../../content/countries/Countries.js'
// Import the list of all the countries in JSON. 
// The format of the JSON file is like thins:
// {
//   "Country": "Costa Rica",
//   "Excempted?": "Yes",
//   "Treaties": "TLC",
//   "airport transit": "No"
// },

// Assume this function is your adapted or existing fetch logic
async function fetchVisas() {
    // Use your existing logic to fetch visa data
    // For demonstration, this will just return an empty array
    return await getCollection('visas', ({ id }) => {
                      return id.startsWith('en/');
                  });
}



const FilterVisaWidget = () => {
  // Inicio de las variables que van a guardar el estado
  const [country, setCountry] = useState(''); // Pais
  const [beneficiaries, setBeneficiaries] = useState(false); // Beneficairios - true o false
  const [workPermit, setWorkPermit] = useState(false); // WorkPermit - true or false
  const [accrueResidency, setAccrueResidency] = useState(false);

  const [list, setList] = useState([]); // lista de las visas filtradas
  const [originalList, setOriginalList] = useState([]); // lista de las visas completa

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Este valor puedes ajustarlo según necesites
  const [totalPages, setTotalPages] = useState(0);

  const [showCountrySelectorError, setShowCountrySelectorError] = useState(false);

  useEffect(() => {
    // En este hook, vamos a traer la lista de todas las visas de mdx.
    // las vamos a guardar en dos lugares: Uno para trabajar y otra lista queda limpia para que no se filtre sobre lo ya filtrado.
    const fetchData = async () => {
      const visas = await fetchVisas();
      setList(visas);
      setOriginalList(visas);
    };
    fetchData();    
  }, []);

  useEffect(() => {    
    // console.log(beneficiaries)
    // Aquí tenemos otro useEffect(). ChatGPT lo mencionó porque supuestamente se deben usar de manera separada.

    const countryInfo = countries.find(info => info.Country === country); // primero, desde la 
    
    if (!countryInfo) {
      setList(originalList); // Reset to original list if no country is selected
      return;
    }


    const categories = []    
    if (countryInfo["Excempted?"] === "Yes") categories.push("Exempted");
    if (countryInfo["Excempted?"] === "No") categories.push("Not exempted");
    if (countryInfo["Excempted?"] === "Schengen visa") categories.push("Schengen visa");
    // if (countryInfo["airport transit"] === "Yes") categories.push("Airport Transit");
    if (countryInfo.Treaties) {
      categories.push(...countryInfo.Treaties.split(", "));
    }

    

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
      

      // console.log(`Visa: ${visa.data.title}, Decision: ${decision}`); // Para verificar la decisión de filtrado por cada visa

      return decision;
    });
    

    setList(filteredList);
    
  }, [country, beneficiaries, workPermit, accrueResidency, originalList]);

  useEffect(() => {
    setTotalPages(Math.ceil(list.length / itemsPerPage));
  }, [list, itemsPerPage]);
  
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  return (
        <div>
          <div className="flex mb-12">
              <div className="w-1/4 bg-slate-100 flex-col p-4">
                <form className="max-w-sm mx-auto">
                    <select
                      id="countries"                      
                      className={`bg-gray-50 border ${showCountrySelectorError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4`}
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setShowCountrySelectorError(false); // Restablece el error cuando se selecciona un país
                      }}
                    >
                      <option value="">Choose your country</option>
                      {countries.map( (c, i) => <option key={i} value={c.Country}>{c.Country}</option>)}
                      
                    </select>
                </form>
                <div className="flex items-center p-4 rounded">
                  <input
                    id="beneficiaries-checkbox"
                    type="checkbox"
                    checked={beneficiaries}
                    onChange={(e) => {
                      setBeneficiaries(e.target.checked)
                      if (!country) { // Si no hay país seleccionado
                        setShowCountrySelectorError(true); // Muestra el selector en rojo
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="beneficiaries-checkbox" className="ml-2 text-sm font-medium text-gray-900">Bringing Spouse and Children?</label>
                </div>
                <div className="flex items-center p-4 rounded">
                  <input
                    id="workPermit-checkbox"
                    type="checkbox"
                    checked={workPermit}
                    onChange={(e) => {
                      setWorkPermit(e.target.checked)
                      if (!country) { // Si no hay país seleccionado
                        setShowCountrySelectorError(true); // Muestra el selector en rojo
                      }
                    }}                    
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="workPermit-checkbox" className="ml-2 text-sm font-medium text-gray-900">Do you want an open work permit?</label>
                </div>
                <div className="flex items-center p-4 rounded">
                  <input
                    id="accrueResidency-checkbox"
                    type="checkbox"
                    checked={accrueResidency}
                    onChange={(e) => {
                      setAccrueResidency(e.target.checked)
                      if (!country) { // Si no hay país seleccionado
                        setShowCountrySelectorError(true); // Muestra el selector en rojo
                      }
                    }}                        
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="accrueResidency-checkbox" className="ml-2 text-sm font-medium text-gray-900">Accrue time towards Residency?</label>
                </div>
              </div>

              <div className="w-3/4">
                <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 justify-center items-center w-auto mb-6 gap-4">                  
                    {currentItems.map((visa, index) => (
                      <a key={index} href={`/visas/${visa.slug.slice(3)}`} className="w-full text-gray-900 rounded ml-2 border hover:bg-primary hover:text-white">
                        <div className="block p-2 w-full text-lg h-16">{visa.data.title}</div>
                        <div className="flex">
                          <p className="px-2 text-slate-400">lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet</p>
                        </div>
                        <div className="p-2 text-sm"><span className="font-bold">Beneficiaries: </span>{visa.data.beneficiaries.includes('yes') ? 'Yes' : 'No'}</div>
                        <div className="p-2 text-sm"><span className="font-bold">Work permit: </span>{visa.data.workPermit.includes('yes') ? 'Yes' : visa.data.workPermit}</div>
                        {/* <div className="p-2 text-sm"><span className="font-bold">Countries: </span>{visa.data.countries.join(', ')}</div> */}
                      </a>
                    ))}                  
                </div>

                <div className="pagination-controls flex justify-center mt-4">
                  <button 
                    onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                    disabled={currentPage === 1}
                    className={`mx-2 px-4 py-2 rounded-lg font-semibold ${currentPage === 1 ? 'bg-gray-200 text-gray-600' : 'bg-primary text-white hover:bg-secondary'}`}
                  >
                    Previous
                  </button>
                  <span className="flex items-center text-sm font-semibold text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`mx-2 px-4 py-2 rounded-lg text-white font-semibold ${currentPage === totalPages ? 'bg-gray-200' : 'bg-primary hover:bg-secondary'}`}
                  >
                    Next
                  </button>
                </div>


              </div>
           
            </div>

        </div>
  );
};

export default FilterVisaWidget;