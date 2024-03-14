import React, { useState, useEffect } from 'react';

function TripsManager() {
  const [trips, setTrips] = useState([{ arrivalDate: '', departureDate: '', days: 0, extension: false }]);

  useEffect(() => {
    // Recalculate the days whenever trips array changes
    const updatedTrips = trips.map(trip => {
      if (trip.arrivalDate && trip.departureDate) {
        const arrival = new Date(trip.arrivalDate);
        const departure = new Date(trip.departureDate);
        const days = Math.max((departure - arrival) / (1000 * 60 * 60 * 24) + 1, 0); // +1 to include both days
        return { ...trip, days };
      }
      return trip;
    });

    setTrips(updatedTrips);
  }, [trips]);

  const addTrip = () => {
    setTrips([...trips, { arrivalDate: '', departureDate: '', days: 0, extension: false }]);
  };

  const addExtension = () => {
    setTrips([...trips, { arrivalDate: '', departureDate: '', days: 0, extension: true }]);
  };

  const removeTrip = (index) => {
    const newTrips = [...trips];
    newTrips.splice(index, 1);
    setTrips(newTrips);
  };

  const handleDateChange = (index, type, value) => {
    const newTrips = [...trips];
    newTrips[index][type] = value;
    setTrips(newTrips);
  };

  // Total days in the current year
  const currentYear = new Date().getFullYear();
  const totalDaysThisYear = trips.reduce((total, {arrivalDate, departureDate, days}) => {
    if (new Date(arrivalDate).getFullYear() === currentYear) {
      return total + days;
    }
    return total;
  }, 0);

  // Remaining days under the 180-day tourism permit
  const remainingDays = 180 - totalDaysThisYear;

  // Check if the user can extend their stay or needs to re-enter
  let extensionOption = "You may need to leave and re-enter the country for a new permit.";
  if (remainingDays > 0 && remainingDays <= 90) {
    extensionOption = "You can extend your stay without leaving, subject to immigration approval.";
  }

  // Last legal day of stay calculation
  const lastEntry = trips.reduce((latest, trip) => {
    const departure = new Date(trip.departureDate);
    return departure > latest ? departure : latest;
  }, new Date(trips[0]?.departureDate));
  const lastLegalDay = new Date(lastEntry.setDate(lastEntry.getDate() + remainingDays));

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: '10px', alignItems: 'center' }}>
        <div>Trips</div>
        <div>Arrival Date</div>
        <div>Departure Date</div>
        <div>Days</div>
        <div>Action</div>

        {trips.map((trip, index) => (
          <React.Fragment key={index}>
            <div>{trip.extension ? "Extension" : `Trip ${index + 1}`}</div>
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
            <button className="bg-red-300 p-1 text-sm"onClick={() => removeTrip(index)}>Remove</button>
          </React.Fragment>
        ))}
        <div>Total Days</div><div></div><div></div><div>{totalDaysThisYear}</div><div></div>
      </div>
      <button className="bg-slate-100 p-2 rounded "onClick={addTrip}>Add Trip</button>
      <button className="bg-slate-100 p-2 rounded "onClick={addExtension} style={{ marginLeft: '10px' }}>Add Extension</button>

      <div style={{ marginTop: '20px' }}>
        <p>Number of days spent in the current year: {totalDaysThisYear}</p>
        <p>Number of days left under your tourism permit: {remainingDays}</p>
        <p>{extensionOption}</p>
        <p>Last legal day of stay: {lastLegalDay.toDateString()}</p>
      </div>
    </div>
  );
}

export default TripsManager;
