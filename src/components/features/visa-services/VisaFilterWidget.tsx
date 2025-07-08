import { useState, useEffect } from 'react';
// import { getCollection, getEntry } from 'astro:content';
import { motion } from 'framer-motion';

import { countries } from 'data/countries.js';
import type { Country } from 'data/countries.js';
// Import the list of all the countries in JSON. 
// The format of the JSON file is like thins:
// {
//   "Country": "Costa Rica",
//   "Excempted?": "Yes",
//   "Treaties": "TLC",
//   "airport transit": "No"
// },
// Assume this function is your adapted or existing fetch logic

// async function fetchVisas() {
//     // Use your existing logic to fetch visa data
//     // For demonstration, this will just return an empty array
//     return await getCollection('visas', ({ id }) => {
//                       return id.startsWith('en/');
//                   });
// }

// Dummy fetchVisas implementation
const fetchVisas = async () => [];

const FilterVisaWidget = () => {
  // Inicio de las variables que van a guardar el estado
  const [country, setCountry] = useState<string>(''); // Pais
  const [beneficiaries, setBeneficiaries] = useState<boolean>(false); // Beneficairios - true o false
  const [workPermit, setWorkPermit] = useState<boolean>(false); // WorkPermit - true or false
  const [accrueResidency, setAccrueResidency] = useState<boolean>(false);

  interface VisaData {
    title: string;
    short_description: string;
    countries: string[];
    beneficiaries: string;
    workPermit: string;
    type: string;
  }

  interface Visa {
    id: string;
    slug: string;
    data: VisaData;
  }

  const [list, setList] = useState<Visa[]>([]); // lista de las visas filtradas
  const [originalList, setOriginalList] = useState<Visa[]>([]); // lista de las visas completa

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6); // Este valor puedes ajustarlo según necesites
  const [totalPages, setTotalPages] = useState<number>(0);

  const [showCountrySelectorError, setShowCountrySelectorError] = useState<boolean>(false);

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
    // Aquí tenemos otro useEffect(). ChatGPT lo mencionó porque supuestamente se deben usar de manera separada.

    const countryInfo = countries.find((info: Country) => info.name === country); // primero, desde la 
    
    if (!countryInfo) {
      setList(originalList); // Reset to original list if no country is selected
      return;
    }


    const categories: string[] = []    
    if (countryInfo.excempted === "Yes") categories.push("Exempted");
    if (countryInfo.excempted === "No") categories.push("Not exempted");
    if (countryInfo.excempted === "Schengen visa") categories.push("Schengen visa");
    // if (countryInfo["airport transit"] === "Yes") categories.push("Airport Transit");
    if (countryInfo.treaties) {
      categories.push(...countryInfo.treaties.split(", "));
    }

    

    const filteredList = originalList.filter((visa: Visa) => {
      const isExemptedCountry = categories.includes("Exempted");
      const isNotExemptedCountry = categories.includes("Not exempted");
      const isCAN = categories.includes("CAN");
      const isMercosur = categories.includes("Mercosur");
      const isWorkingHolidays = categories.includes("Working holidays");
      
      const meetsBeneficiariesCondition = !beneficiaries || (beneficiaries && visa.data.beneficiaries.includes('yes'));
      const meetsWorkPermitCondition = !workPermit || (workPermit && visa.data.workPermit.includes('yes')) ;
      const meetsResidencyCondition = !accrueResidency || (accrueResidency && visa.data.type === 'Migrant');
      
    
      const hasExemptedVisa = visa.data.countries.includes("Exempted") || visa.data.countries.includes("Excempted");
      const hasNotExemptedVisa = visa.data.countries.includes("Not exempted") || visa.data.countries.includes("Not excempted");
      const hasCANVisa = visa.data.countries.includes("CAN");
      const hasMercosurVisa = visa.data.countries.includes("Mercosur");
      const hasWorkingHolidayVisa = visa.data.countries.includes("Working holidays");
    
      // If visa has "All countries", it applies to everyone
      if (visa.data.countries.includes("All countries")) {
        return true;
      }
      
      const decision = (
        // For exempted countries: show exempted visas, or treaty visas if they have the treaty
        (isExemptedCountry && hasExemptedVisa && !hasNotExemptedVisa) ||
        (isExemptedCountry && isCAN && hasCANVisa && !hasNotExemptedVisa) ||
        (isExemptedCountry && isMercosur && hasMercosurVisa && !hasNotExemptedVisa) ||
        (isExemptedCountry && isWorkingHolidays && hasWorkingHolidayVisa && !hasNotExemptedVisa) ||
        
        // For non-exempted countries: show non-exempted visas, or treaty visas if they have the treaty
        (isNotExemptedCountry && hasNotExemptedVisa && !hasExemptedVisa) ||
        (isNotExemptedCountry && isCAN && hasCANVisa && !hasExemptedVisa) ||
        (isNotExemptedCountry && isMercosur && hasMercosurVisa && !hasExemptedVisa) ||
        (isNotExemptedCountry && isWorkingHolidays && hasWorkingHolidayVisa && !hasExemptedVisa) ||
        
        // For CAN countries: show CAN visas, or exempted/non-exempted based on their status
        (isCAN && hasCANVisa) ||
        (isCAN && isExemptedCountry && hasExemptedVisa) ||
        (isCAN && isNotExemptedCountry && hasNotExemptedVisa) ||
        
        // For Mercosur countries: show Mercosur visas, or exempted/non-exempted based on their status
        (isMercosur && hasMercosurVisa) ||
        (isMercosur && isExemptedCountry && hasExemptedVisa) ||
        (isMercosur && isNotExemptedCountry && hasNotExemptedVisa) ||
        
        // For Working Holidays countries: show Working Holiday visas, or exempted/non-exempted based on their status
        (isWorkingHolidays && hasWorkingHolidayVisa) ||
        (isWorkingHolidays && isExemptedCountry && hasExemptedVisa) ||
        (isWorkingHolidays && isNotExemptedCountry && hasNotExemptedVisa)
      );

      return decision && meetsBeneficiariesCondition && meetsWorkPermitCondition && meetsResidencyCondition;
    });

    setList(filteredList);
 
    
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

  return (
        <div className='flex flex-col'>
          <div className="flex flex-col md:flex-row mb-6">
              <div className="w-full md:w-1/4 bg-slate-100 flex-col p-4">
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
                      {countries.map((c: Country, i: number) => <option key={i} value={c.name}>{c.name}</option>)}
                      
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
                <div className="flex items-center p-4 rounded">
                  <a className='bg-secondary p-2 text-white text-sm rounded shadow hover:bg-primary' href="/visas">Check all visa categories</a>
                </div>
              </div>
              <div className="w-full md:w-3/4 ">
                <div className="w-100 h-auto grid grid-cols-1 sm:grid-cols-2 justify-center items-center md:xw-auto mb-6 gap-4">
                    {
                    currentItems.map((visa, index) => (
                      <a key={index} href={`/visas/${visa.slug.slice(3)}`} className="w-auto p-4 text-gray-900 rounded mx-2 border hover:bg-primary hover:text-white group">
                        <div className="block p-2 w-full text-lg h-16 text-primary group-hover:text-white font-bold">{visa.data.title}</div>
                        <div className="flex">
                          <p className="px-2 text-slate-500 text-sm h-24 group-hover:text-slate-100">
                            {visa.data.short_description}
                          </p>
                        </div>
                        <div className="flex justify-between h-12">
                          <div className="p-2 text-sm"><span className="font-bold text-secondary">Beneficiaries: </span>{visa.data.beneficiaries.includes('yes') ? 'Yes' : 'No'}</div>
                          <div className="p-2 text-sm"><span className="font-bold text-secondary">Work permit: </span>{visa.data.workPermit.includes('yes') ? 'Yes' : visa.data.workPermit}</div>
                        </div>
                      </a>
                    ))}                  
                </div>
              </div>
           
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
  );
};

export default FilterVisaWidget;