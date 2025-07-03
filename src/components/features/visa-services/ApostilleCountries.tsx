// Import useState, useEffect hooks from 'react'
import { useState, useEffect } from 'react';

// Import countries data
import { countries } from '../../../data/countries';
import type { Country } from '../../../data/countries';

// Type definitions
// Country interface is imported from the data file

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase();
    const matches = countries.filter((country: Country) =>
      country.nameEn.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredCountries(matches);
  }, [query]);

  return (
    <div>
      <button 
            type="button"
            onClick={() => setToggle(!toggle)} 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2">
              Countries that are part of the Apostille Convention
              { toggle ? 
                <svg className="w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5m0 14-4-4m4 4 4-4"/>
                </svg> :
        
                <svg className="w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              }
      </button>

      {
        toggle &&
          <>
            <input
              className='block mt-4'
              type="text"
              placeholder="Search for a country..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <br/>
            <div className='grid grid-cols-4'>
              {filteredCountries.sort().map((country: Country, index: number) => (
                <div className="m-0 text-sm" key={index}>{`${country.nameEn.length <= 15 ? country.nameEn : country.nameEn.substring(0, 15) + '...'}`}</div>
              ))}
            </div>
          </>
        } 
    </div>
  );
};

export default SearchComponent;