import { useState, useEffect } from 'react';

import countries from '../../../content/countries/Countries.js';

interface CountrySelectorProps {
  lang?: 'en' | 'es';
}

interface Country {
  Country: string;
  CountryEn: string;
  'Excempted?': string;
  Treaties: string;
  'airport transit': string;
}

function CountrySelector({ lang = 'en' }: CountrySelectorProps) {
    const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [exemptedStatus, setExemptedStatus] = useState<string>('');

  useEffect(() => {
    // Assuming you want to do something whenever selectedCountry changes, like logging or fetching more data
    const countryInfo = countries.find((country) => country.CountryEn === selectedCountry);
    
    setExemptedStatus(countryInfo ? (countryInfo as any)['Excempted?'] || '' : '');
    // Here you could also do other effects, like logging or setting other state based on the selected country
  }, [selectedCountry]); // This will run whenever selectedCountry changes

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  // Content based on language
  const content = lang === 'es' ? {
    selectCountry: 'Selecciona un país',
    exempted: 'Este país está exento de requisitos de visa de corta estancia',
    notExempted: 'Este país no está exento de requisitos de visa de corta estancia'
  } : {
    selectCountry: 'Select a country',
    exempted: 'This country is exempted from short-stay visa requirements',
    notExempted: 'This country is not exempted from short-stay visa requirements'
  };

  return (
    <div>
      <select className='w-full' onChange={handleSelectChange} defaultValue="">
        <option value="" disabled>{content.selectCountry}</option>
        {countries.map((country) => (
          <option key={country.CountryEn} value={lang === 'en' ? country.CountryEn : country.Country}>
            {lang === 'en' ? country.CountryEn : country.Country}
          </option>
        ))}
      </select>
      {exemptedStatus && (
        <p> {exemptedStatus === "Yes" ? <div className='bg-green-200'>{content.exempted}</div> : 
        <div className='bg-red-200'>{content.notExempted}</div>} </p>
      )}
      
      {/* {exemptedStatus === "Yes" && dnv === true  ? <div className='bg-green-200'>You can apply</div> : <div className='bg-red-200'>You can't apply.</div>} */}
    </div>
  );
}
  
export default function CountryExcemptionCheck({ lang = 'en' }: { lang?: 'en' | 'es' }) {
  return <CountrySelector lang={lang} />;
}