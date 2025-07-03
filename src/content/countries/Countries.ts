// Type definitions
export interface Country {
  Country: string;
  Excempted?: string;
  Treaties?: string;
  "airport transit"?: string;
  CountryEn?: string;
}

const countriesData: Country[] = [
  {
    "Country": "Afganistán",
    "Excempted": "No",
    "Treaties": "null",
    "airport transit": "Yes",
    "CountryEn": "Afghanistan",
  },
  {
    "Country": "Albania",
    "Excempted": "Yes",
    "Treaties": "null",
    "airport transit": "No",
    "CountryEn": "Albania",
  },
  // ... (copy the rest of the array from the original file)
];

export default countriesData; 