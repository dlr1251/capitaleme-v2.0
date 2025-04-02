import React, { useState, useEffect } from 'react';

import countries from "../../../content/countries/Countries"

function CountrySelector() {
    const [selectedCountry, setSelectedCountry] = useState('');
  const [exemptedStatus, setExemptedStatus] = useState('');

  useEffect(() => {
    // Assuming you want to do something whenever selectedCountry changes, like logging or fetching more data
    const countryInfo = countries.find(country => country.CountryEn === selectedCountry);
    
    setExemptedStatus(countryInfo ? countryInfo["Excempted?"] : '');
    // Here you could also do other effects, like logging or setting other state based on the selected country
  }, [selectedCountry]); // This will run whenever selectedCountry changes

  const handleSelectChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  return (
    <div>
      <select className='w-full' onChange={handleSelectChange} defaultValue="">
        <option value="" disabled>Select a country</option>
        {countries.map(country => (
          <option key={country.CountryEn} value={country.CountryEn}>
            {country.CountryEn}
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