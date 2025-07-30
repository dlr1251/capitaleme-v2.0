import React, { useState, useEffect } from 'react';

interface Trip {
  arrivalDate: string;
  departureDate: string;
  days: number;
  extension: boolean;
}

interface TripsManagerProps {
  lang?: 'en' | 'es';
}

function TripsManager({ lang = 'en' }: TripsManagerProps) {
  const [trips, setTrips] = useState<Trip[]>([{ arrivalDate: '', departureDate: '', days: 0, extension: false }]);

  // Calculate days for trips with dates
  const tripsWithCalculatedDays = trips.map((trip: Trip) => {
    if (trip.arrivalDate && trip.departureDate) {
      const arrival = new Date(trip.arrivalDate).getTime();
      const departure = new Date(trip.departureDate).getTime();
      const days = Math.max(Math.floor((departure - arrival) / (1000 * 60 * 60 * 24)) + 1, 0); // +1 to include both days
      return { ...trip, days };
    }
    return trip;
  });

  const addTrip = (): void => {
    setTrips([...trips, { arrivalDate: '', departureDate: '', days: 0, extension: false }]);
  };

  const addExtension = (): void => {
    setTrips([...trips, { arrivalDate: '', departureDate: '', days: 0, extension: true }]);
  };

  const removeTrip = (index: number): void => {
    const newTrips = [...trips];
    newTrips.splice(index, 1);
    setTrips(newTrips);
  };

  const handleDateChange = (index: number, type: 'arrivalDate' | 'departureDate', value: string): void => {
    const newTrips = [...trips];
    newTrips[index][type] = value;
    setTrips(newTrips);
  };

  // Total days in the current year
  const currentYear = new Date().getFullYear();
  const totalDaysThisYear = tripsWithCalculatedDays.reduce((total: number, {arrivalDate, days}: Trip) => {
    if (new Date(arrivalDate).getFullYear() === currentYear) {
      return total + days;
    }
    return total;
  }, 0);

  // Remaining days under the 180-day tourism permit
  const remainingDays = 180 - totalDaysThisYear;

  // Content based on language
  const content = lang === 'es' ? {
    trips: 'Viajes',
    arrivalDate: 'Fecha de Llegada',
    departureDate: 'Fecha de Salida',
    days: 'Días',
    action: 'Acción',
    extension: 'Extensión',
    trip: 'Viaje',
    remove: 'Eliminar',
    totalDays: 'Total de Días',
    addTrip: 'Agregar Viaje',
    addExtension: 'Agregar Extensión',
    extensionOption1: 'Puede que necesites salir y reingresar al país para un nuevo permiso.',
    extensionOption2: 'Puedes extender tu estadía sin salir, sujeto a la aprobación de inmigración.',
    remainingDays: 'Días restantes',
    lastLegalDay: 'Último día legal de estadía'
  } : {
    trips: 'Trips',
    arrivalDate: 'Arrival Date',
    departureDate: 'Departure Date',
    days: 'Days',
    action: 'Action',
    extension: 'Extension',
    trip: 'Trip',
    remove: 'Remove',
    totalDays: 'Total Days',
    addTrip: 'Add Trip',
    addExtension: 'Add Extension',
    extensionOption1: 'You may need to leave and re-enter the country for a new permit.',
    extensionOption2: 'You can extend your stay without leaving, subject to immigration approval.',
    remainingDays: 'Remaining days',
    lastLegalDay: 'Last legal day of stay'
  };

  // Check if the user can extend their stay or needs to re-enter
  let extensionOption = content.extensionOption1;
  if (remainingDays > 0 && remainingDays <= 90) {
    extensionOption = content.extensionOption2;
  }

  // Last legal day of stay calculation
  const lastEntry = tripsWithCalculatedDays.reduce((latest: Date, trip: Trip) => {
    const departure = new Date(trip.departureDate);
    return departure > latest ? departure : latest;
  }, new Date(tripsWithCalculatedDays[0]?.departureDate));
  const lastLegalDay = new Date(lastEntry.getTime());
  lastLegalDay.setDate(lastLegalDay.getDate() + remainingDays);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: '10px', alignItems: 'center' }}>
        <div>{content.trips}</div>
        <div>{content.arrivalDate}</div>
        <div>{content.departureDate}</div>
        <div>{content.days}</div>
        <div>{content.action}</div>

        {tripsWithCalculatedDays.map((trip: Trip, index: number) => (
          <React.Fragment key={index}>
            <div>{trip.extension ? content.extension : `${content.trip} ${index + 1}`}</div>
            <input
              type="date"
              value={trip.arrivalDate}
              onChange={e => handleDateChange(index, 'arrivalDate', e.target.value)}
            />
            <input
              type="date"
              value={trip.departureDate}
              onChange={e => handleDateChange(index, 'departureDate', e.target.value)}
            />
            <div>{trip.days}</div>
            <button className="bg-red-300 p-1 text-sm" onClick={() => removeTrip(index)}>{content.remove}</button>
          </React.Fragment>
        ))}
        <div>{content.totalDays}</div><div></div><div></div><div>{totalDaysThisYear}</div><div></div>
      </div>
      <button className="bg-slate-100 p-2 rounded " onClick={addTrip}>{content.addTrip}</button>
      <button className="bg-slate-100 p-2 rounded " onClick={addExtension} style={{ marginLeft: '10px' }}>{content.addExtension}</button>

      <div style={{ marginTop: '20px' }}>
        <p>{lang === 'es' ? 'Número de días gastados en el año actual' : 'Number of days spent in the current year'}: {totalDaysThisYear}</p>
        <p>{lang === 'es' ? 'Número de días restantes bajo tu permiso de turismo' : 'Number of days left under your tourism permit'}: {remainingDays}</p>
        <p>{extensionOption}</p>
        <p>{content.lastLegalDay}: {lastLegalDay.toDateString()}</p>
      </div>
    </div>
  );
}

export default function DaysCounter({ lang = 'en' }: { lang?: 'en' | 'es' }) {
  return <TripsManager lang={lang} />;
}
