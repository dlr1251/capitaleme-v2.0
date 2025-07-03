export interface Country {
  name: string; // Local name
  nameEn: string; // English name
  excempted: string; // 'Yes', 'No', 'Schengen Visa', etc.
  treaties: string; // Treaties as a string
  airportTransit: string; // 'Yes', 'No', or special string
}

export const countries: Country[] = [
  { name: "Afganistán", nameEn: "Afghanistan", excempted: "No", treaties: "null", airportTransit: "Yes" },
  { name: "Albania", nameEn: "Albania", excempted: "Yes", treaties: "null", airportTransit: "No" },
  { name: "Alemania", nameEn: "Germany", excempted: "Yes", treaties: "TLC, UE", airportTransit: "No" },
  { name: "Andorra", nameEn: "Andorra", excempted: "Yes", treaties: "null", airportTransit: "No" },
  { name: "Angola", nameEn: "Angola", excempted: "No", treaties: "null", airportTransit: "Yes" },
  { name: "Antigua y Barbuda", nameEn: "Antigua and Barbuda", excempted: "Yes", treaties: "null", airportTransit: "No" },
  { name: "Arabia Saudita", nameEn: "Saudi Arabia", excempted: "No", treaties: "null", airportTransit: "No" },
  { name: "Argelia", nameEn: "Algeria", excempted: "No", treaties: "null", airportTransit: "No" },
  { name: "Argentina", nameEn: "Argentina", excempted: "Yes", treaties: "Mercosur, TLC", airportTransit: "No" },
  { name: "Armenia", nameEn: "Armenia", excempted: "No", treaties: "null", airportTransit: "No" },
  { name: "Australia", nameEn: "Australia", excempted: "Yes", treaties: "null", airportTransit: "No" },
  { name: "Austria", nameEn: "Austria", excempted: "Yes", treaties: "TLC, UE", airportTransit: "No" },
  { name: "Azerbaiyán", nameEn: "Azerbaijan", excempted: "Yes", treaties: "null", airportTransit: "No" },
  { name: "Bahamas", nameEn: "Bahamas", excempted: "Yes", treaties: "null", airportTransit: "No" },
  { name: "Bahréin", nameEn: "Bahrain", excempted: "No", treaties: "null", airportTransit: "No" },
  { name: "Bangladesh", nameEn: "Bangladesh", excempted: "No", treaties: "null", airportTransit: "Yes" },
  { name: "Barbados", nameEn: "Barbados", excempted: "Yes", treaties: "null", airportTransit: "No" },
  { name: "Bélgica", nameEn: "Belgium", excempted: "Yes", treaties: "TLC, UE", airportTransit: "No" },
  { name: "Belice", nameEn: "Belize", excempted: "Yes", treaties: "null", airportTransit: "No" },
  { name: "Benin", nameEn: "Benin", excempted: "No", treaties: "null", airportTransit: "No" },
  { name: "Bielorrusia", nameEn: "Belarus", excempted: "No", treaties: "null", airportTransit: "No" },
  { name: "Bolivia", nameEn: "Bolivia", excempted: "Yes", treaties: "CAN, TLC", airportTransit: "No" },
  { name: "Bosnia y Herzegovina", nameEn: "Bosnia and Herzegovina", excempted: "Yes", treaties: "null", airportTransit: "No" },
  { name: "Botsuana", nameEn: "Botswana", excempted: "No", treaties: "null", airportTransit: "No" },
  { name: "Brasil", nameEn: "Brazil", excempted: "Yes", treaties: "Mercosur, TLC", airportTransit: "No" },
  { name: "Brunei Darussalam", nameEn: "Brunei", excempted: "Yes", treaties: "null", airportTransit: "No" },
  { name: "Bulgaria", nameEn: "Bulgaria", excempted: "Yes", treaties: "TLC, UE", airportTransit: "No" },
  { name: "Burkina Faso", nameEn: "Burkina Faso", excempted: "No", treaties: "null", airportTransit: "Yes" },
  { name: "Burundi", nameEn: "Burundi", excempted: "No", treaties: "null", airportTransit: "No" },
  // ... (continue for all countries from Countries.js) ...
]; 