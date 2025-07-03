import { useState, useEffect } from 'react';
import { countries } from '../../../data/countries';
import type { Country } from '../../../data/countries';
import { FaThLarge, FaList } from "react-icons/fa"; // Import icons for button

// Type definitions
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

interface FilterVisaWidgetProps {
  locale: 'en' | 'es';
  visas: Visa[];
}

const FilterVisaWidget = ({locale, visas}: FilterVisaWidgetProps) => {
  
  const [country, setCountry] = useState<string>('');
  const [beneficiaries, setBeneficiaries] = useState<boolean>(false); 
  const [workPermit, setWorkPermit] = useState<boolean>(false); 
  const [accrueResidency, setAccrueResidency] = useState<boolean>(false);
  const [list, setList] = useState<Visa[]>([]);
  const [originalList, setOriginalList] = useState<Visa[]>([]); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false); //
  const [itemsPerPage] = useState<number>(50); 
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showCountrySelectorError, setShowCountrySelectorError] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>("cards"); 

  
  
  useEffect(() => {
    setList(visas);
    setOriginalList(visas);
  }, [visas]);

  useEffect(() => {    
    const countryInfo = countries.find((info: Country) => info.name === country);
    if (!countryInfo) {
      setList(originalList);
      return;
    }

    const categories: string[] = []    
    if (countryInfo.excempted === "Yes") categories.push("Exempted");
    if (countryInfo.excempted === "No") categories.push("Not exempted");
    if (countryInfo.excempted === "Schengen visa") categories.push("Schengen visa");
    if (countryInfo.treaties) categories.push(...countryInfo.treaties.split(", "));
    
    
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
  
  
  
  return (
    <div 
    className={`flex flex-col p-4 rounded-lg border border-grey-200 transition-colors duration-500 h-screen md:h-screen overflow-y-auto ${
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
                .sort((a: Country, b: Country) => a.nameEn.localeCompare(b.nameEn))
                .map((c: Country, i: number) => (
                  <option className="text-md" key={i} value={c.name}>
                    {locale === 'es' ? c.name : c.nameEn}
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
            <span className="py-1 md:py-4 font-medium text-gray-500 text-sm">Bringing Spouse and Children</span>
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
            <span className="py-1 md:py-4 font-medium text-gray-500 text-sm">Open work permit</span>
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
            <span className="py-1 md:py-4 font-medium text-gray-500 text-sm">Time accrual towards Residency</span>
          </label>
          <button className="mt-4 flex items-center px-4 py-2 border text-gray-800 rounded-lg group hover:border-primary"
            onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}
          >
            {viewMode === "cards" ? <FaList  size={20} /> : <FaThLarge  size={20} />}
            <span className="ml-2 text-sm text-primary">{viewMode === "cards" ? "List View" : "Card View"}</span>
          </button>
        </div>

      {/* Right Column: Announcement */}
      <div className="lg:w-3/4 bg-gray-100 p-4 rounded-lg shadow-lg text-primary hidden md:block">
        <h3 className="text-lg font-bold">For which Visa Category should I apply?</h3>
        <p className="mt-2">
          There are over 45 visa categories as 2025, each with its own requirements, limitations and associated costs. Choosing the right visa category is the best way to start your migration strategy.
        </p>
  
          <ol className="relative border-s border-gray-200 mt-4">                  
            <li className="mb-4 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                <svg className="w-2.5 h-2.5 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                </svg>
              </span>
              <h3 className="font-medium leading-tight">Select your country of origin</h3>
              <p className="text-sm">This determines which visa categories are available to you based on bilateral agreements and treaties.</p>
            </li>
            <li className="mb-4 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                <svg className="w-2.5 h-2.5 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                </svg>
              </span>
              <h3 className="font-medium leading-tight">Apply additional filters</h3>
              <p className="text-sm">Refine your search by selecting specific requirements like work permits, family inclusion, or residency time accrual.</p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                <svg className="w-2.5 h-2.5 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                </svg>
              </span>
              <h3 className="font-medium leading-tight">Review and compare options</h3>
              <p className="text-sm">Compare the filtered visa categories to find the best option for your specific situation and goals.</p>
            </li>
          </ol>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1">
        {showCountrySelectorError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            Please select a country to apply filters.
          </div>
        )}

        {list.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No visas found for the selected criteria.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, list.length)} of {list.length} visas
              </p>
            </div>

            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map((visa: Visa, index: number) => (
                  <a key={index} href={`/en/visas/${visa.slug.slice(3)}`} className="w-auto p-4 text-gray-900 rounded mx-2 border hover:bg-primary hover:text-white group">
                    <div className="block p-2 w-full text-lg h-16 text-primary group-hover:text-white font-bold">{visa.data.title}</div>
                    <div className="p-2 text-sm text-gray-600 group-hover:text-white">
                      {visa.data.short_description}
                    </div>
                    <div className="p-2 text-sm"><span className="font-bold text-secondary">Beneficiaries: </span>{visa.data.beneficiaries.includes('yes') ? 'Yes' : 'No'}</div>
                    <div className="p-2 text-sm"><span className="font-bold text-secondary">Work permit: </span>{visa.data.workPermit.includes('yes') ? 'Yes' : visa.data.workPermit}</div>
                    <div className="p-2 text-sm"><span className="font-bold text-secondary">Type:</span> {visa.data.type}</div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {currentItems.map((visa: Visa, index: number) => (
                  <a key={index} href={`/en/visas/${visa.slug.slice(3)}`} className="block p-4 text-gray-900 border rounded-lg hover:bg-primary hover:text-white group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-primary group-hover:text-white">{visa.data.title}</h3>
                        <p className="text-sm text-gray-600 group-hover:text-white mt-1">{visa.data.short_description}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div><span className="font-bold text-secondary">Beneficiaries:</span> {visa.data.beneficiaries.includes('yes') ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold text-secondary">Work Permit:</span> {visa.data.workPermit.includes('yes') ? 'Yes' : visa.data.workPermit}</div>
                        <div><span className="font-bold text-secondary">Type:</span> {visa.data.type}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FilterVisaWidget;