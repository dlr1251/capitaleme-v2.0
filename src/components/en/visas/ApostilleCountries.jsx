// Import React and useState, useEffect hooks from 'react'
import React, { useState, useEffect } from 'react';

// Import countries data
import countriesData from '../../../content/countries/Countries.js';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [toggle, setToggle] = useState(false);


  const useToggle = (initialState) => {
    const [toggleValue, setToggleValue] = useState(initialState);

    const toggler = () => { setToggleValue(!toggleValue) };
    return [toggleValue, toggler]
  };

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase();
    const matches = countriesData.filter(country =>
      country.CountryEn.toLowerCase().includes(lowerCaseQuery)
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
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 14-4-4m4 4 4-4"/>
                </svg> :
        
                <svg className="w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
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
              {filteredCountries.sort().map((country, index) => (
                <div className="m-0 text-sm" key={index}>{`${country.CountryEn.length <= 15 ? country.CountryEn : country.CountryEn.substring(0, 15) + '...'}`}</div>
              ))}
            </div>
          </>
        } 
    </div>
  );
};

export default SearchComponent;