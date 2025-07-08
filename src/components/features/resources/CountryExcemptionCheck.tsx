import { useState, useEffect } from 'react';

import { countries } from 'data/countries.js';
import type { Country } from 'data/countries.js';

function CountrySelector() {
    const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [exemptedStatus, setExemptedStatus] = useState<string>('');

  useEffect(() => {
    // Assuming you want to do something whenever selectedCountry changes, like logging or fetching more data
    const countryInfo = countries.find((country: Country) => country.nameEn === selectedCountry);
    
    setExemptedStatus(countryInfo ? countryInfo.excempted || '' : '');
    // Here you could also do other effects, like logging or setting other state based on the selected country
  }, [selectedCountry]); // This will run whenever selectedCountry changes

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  return (
    <div>
      <select className='w-full' onChange={handleSelectChange} defaultValue="">
        <option value="" disabled>Select a country</option>
        {countries.map((country: Country) => (
          <option key={country.nameEn} value={country.nameEn}>
            {country.nameEn}
          </option>
        ))}
      </select>
      {exemptedStatus && (
        <p> {exemptedStatus === "Yes" ? <div className='bg-green-200'>This country is exempted from short-stay visa requirements</div> : 
        <div className='bg-red-200'>This country is not exempted from short-stay visa requirements.</div>} </p>
      )}
      
      {/* {exemptedStatus === "Yes" && dnv === true  ? <div className='bg-green-200'>You can apply</div> : <div className='bg-red-200'>You can't apply.</div>} */}
    </div>
  );
}
  
  export default CountrySelector;