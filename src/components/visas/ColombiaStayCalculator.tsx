import React, { useState, useMemo, useEffect } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachMonthOfInterval, differenceInDays, differenceInMonths, addDays, startOfYear, endOfYear, isWithinInterval } from 'date-fns';

// Types
interface Trip {
  id: string;
  entry: Date | null;
  exit: Date | null;
  underVisa: boolean;
}

interface YearlyUsage {
  tourism: number;
  visa: number;
  remainingQuota: number;
}

interface AnalysisResult {
  daysLeftQuota: number;
  daysLeftPermit: number;
  extensionSuggestion?: string;
  visaApplicationDate?: Date;
  extensionOption?: {
    days: number;
    startDate: Date;
    endDate: Date;
    applyStartDate: Date;
    applyEndDate: Date;
  };
  lastLegalDay: Date;
  overstayWarning?: string;
  yearlyUsage: Map<number, YearlyUsage>;
  currentPermitEnd?: Date;
  quotaExhausted: boolean;
  visaRunNeeded: boolean;
  detailedAnalysis: string[];
}

// Constants
const MAX_QUOTA = 180;
const MAX_PERMIT = 90;
const CURRENT_DATE = new Date('2025-07-26');
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Helper functions
const isBusinessDay = (date: Date): boolean => {
  const day = date.getDay();
  return day !== 0 && day !== 6; // Monday = 1, Sunday = 0
};

const addBusinessDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  let remainingDays = days;
  
  while (remainingDays > 0) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) {
      remainingDays--;
    }
  }
  
  while (remainingDays < 0) {
    result.setDate(result.getDate() - 1);
    if (isBusinessDay(result)) {
      remainingDays++;
    }
  }
  
  return result;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Key function: Calculate days including arrival, excluding departure
const calculateDays = (start: Date, end: Date): number => {
  // Include arrival date, exclude departure date
  return differenceInDays(end, start); // This gives us the correct count
};

const ColombiaStayCalculator: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([
    { id: '1', entry: null, exit: null, underVisa: false }
  ]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Auto-calculate analysis when trips change
  useEffect(() => {
    if (trips.some(trip => trip.entry)) {
      calculateAnalysis();
    }
  }, [trips]);

  // Add new trip
  const addTrip = () => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      entry: null,
      exit: null,
      underVisa: false
    };
    setTrips([...trips, newTrip]);
  };

  // Update trip
  const updateTrip = (id: string, field: keyof Trip, value: any) => {
    setTrips(trips.map(trip => 
      trip.id === id ? { ...trip, [field]: value } : trip
    ));
  };

  // Remove trip
  const removeTrip = (id: string) => {
    if (trips.length > 1) {
      setTrips(trips.filter(trip => trip.id !== id));
    }
  };

  const calculateAnalysis = () => {
    const validTrips = trips.filter(trip => trip.entry && trip.exit);
    const ongoingTrips = trips.filter(trip => trip.entry && !trip.exit);
    
    if (validTrips.length === 0 && ongoingTrips.length === 0) {
      setAnalysis(null);
      return;
    }

    // Calculate yearly usage
    const yearlyUsage = new Map<number, YearlyUsage>();
    
    // Process completed trips
    validTrips.forEach(trip => {
      const startYear = trip.entry!.getFullYear();
      const endYear = trip.exit!.getFullYear();
      
      // Handle trips spanning multiple years
      if (startYear === endYear) {
        const days = calculateDays(trip.entry!, trip.exit!);
        const year = startYear;
        
        if (!yearlyUsage.has(year)) {
          yearlyUsage.set(year, { tourism: 0, visa: 0, remainingQuota: MAX_QUOTA });
        }
        
        const usage = yearlyUsage.get(year)!;
        if (trip.underVisa) {
          usage.visa += days;
        } else {
          usage.tourism += days;
        }
        usage.remainingQuota = MAX_QUOTA - usage.tourism;
      } else {
        // Split across years
        const yearStart = new Date(trip.entry!.getFullYear(), 0, 1);
        const yearEnd = new Date(trip.entry!.getFullYear(), 11, 31);
        
        // Days in first year
        const firstYearDays = calculateDays(trip.entry!, yearEnd) + 1;
        const firstYear = trip.entry!.getFullYear();
        
        if (!yearlyUsage.has(firstYear)) {
          yearlyUsage.set(firstYear, { tourism: 0, visa: 0, remainingQuota: MAX_QUOTA });
        }
        const firstYearUsage = yearlyUsage.get(firstYear)!;
        if (trip.underVisa) {
          firstYearUsage.visa += firstYearDays;
        } else {
          firstYearUsage.tourism += firstYearDays;
        }
        firstYearUsage.remainingQuota = MAX_QUOTA - firstYearUsage.tourism;
        
        // Days in second year
        const secondYearDays = calculateDays(yearEnd, trip.exit!) + 1;
        const secondYear = trip.exit!.getFullYear();
        
        if (!yearlyUsage.has(secondYear)) {
          yearlyUsage.set(secondYear, { tourism: 0, visa: 0, remainingQuota: MAX_QUOTA });
        }
        const secondYearUsage = yearlyUsage.get(secondYear)!;
        if (trip.underVisa) {
          secondYearUsage.visa += secondYearDays;
        } else {
          secondYearUsage.tourism += secondYearDays;
        }
        secondYearUsage.remainingQuota = MAX_QUOTA - secondYearUsage.tourism;
      }
    });

    // Process ongoing trips
    ongoingTrips.forEach(trip => {
      const currentYear = CURRENT_DATE.getFullYear();
      const yearStart = new Date(currentYear, 0, 1);
      const yearEnd = new Date(currentYear, 11, 31);
      
      if (!yearlyUsage.has(currentYear)) {
        yearlyUsage.set(currentYear, { tourism: 0, visa: 0, remainingQuota: MAX_QUOTA });
      }
      
      const usage = yearlyUsage.get(currentYear)!;
      const ongoingDays = calculateDays(trip.entry!, CURRENT_DATE) + 1;
      
      if (trip.underVisa) {
        usage.visa += ongoingDays;
      } else {
        usage.tourism += ongoingDays;
      }
      usage.remainingQuota = MAX_QUOTA - usage.tourism;
    });

    // Get current year usage
    const currentYear = CURRENT_DATE.getFullYear();
    const currentUsage = yearlyUsage.get(currentYear) || { tourism: 0, visa: 0, remainingQuota: MAX_QUOTA };
    
    // Find current ongoing trip (if any)
    const currentOngoingTrip = ongoingTrips.find(trip => !trip.underVisa);
    
    let currentPermitEnd: Date | undefined;
    let daysLeftPermit = 0;
    let extensionOption: AnalysisResult['extensionOption'] | undefined;
    
    if (currentOngoingTrip && currentOngoingTrip.entry) {
      // Calculate current permit end (90 days from entry)
      currentPermitEnd = addDays(currentOngoingTrip.entry, 89); // 90 days including entry
      
      if (CURRENT_DATE <= currentPermitEnd) {
        daysLeftPermit = calculateDays(CURRENT_DATE, currentPermitEnd) + 1;
        
        // Check if extension is possible
        const remainingQuota = currentUsage.remainingQuota;
        if (remainingQuota > 0 && daysLeftPermit <= 5) {
          const extensionDays = Math.min(90, remainingQuota);
          const extensionStart = addDays(currentPermitEnd, 1);
          const extensionEnd = addDays(extensionStart, extensionDays - 1);
          const applyStart = addBusinessDays(currentPermitEnd, -5);
          const applyEnd = currentPermitEnd;
          
          extensionOption = {
            days: extensionDays,
            startDate: extensionStart,
            endDate: extensionEnd,
            applyStartDate: applyStart,
            applyEndDate: applyEnd
          };
        }
      }
    }

    // Calculate last legal day
    let lastLegalDay: Date;
    if (currentOngoingTrip && currentOngoingTrip.entry) {
      if (currentPermitEnd && CURRENT_DATE <= currentPermitEnd) {
        lastLegalDay = currentPermitEnd;
      } else {
        // Already exceeded permit, calculate based on quota
        const remainingDays = Math.min(currentUsage.remainingQuota, MAX_PERMIT);
        lastLegalDay = addDays(CURRENT_DATE, remainingDays - 1);
      }
    } else {
      // No ongoing trip, calculate based on quota
      const remainingDays = Math.min(currentUsage.remainingQuota, MAX_PERMIT);
      lastLegalDay = addDays(CURRENT_DATE, remainingDays - 1);
    }

    // Generate detailed analysis
    const detailedAnalysis: string[] = [];
    
    // 1. Days left under 180 quota
    detailedAnalysis.push(`Days left under 180-day quota: ${currentUsage.remainingQuota} days`);
    
    // 2. Days left under current permit
    if (daysLeftPermit > 0) {
      detailedAnalysis.push(`Days left under current permit: ${daysLeftPermit} days`);
    }
    
    // 3. Extension suggestion
    if (extensionOption) {
      detailedAnalysis.push(`Extension available: Apply between ${formatDate(extensionOption.applyStartDate)} and ${formatDate(extensionOption.applyEndDate)} for ${extensionOption.days} additional days`);
    }
    
    // 4. Visa application date
    const visaApplicationDate = currentPermitEnd ? addDays(currentPermitEnd, -45) : undefined;
    if (visaApplicationDate && visaApplicationDate > CURRENT_DATE) {
      detailedAnalysis.push(`Suggested visa application date: ${formatDate(visaApplicationDate)} (45 days before permit expires)`);
    }
    
    // 5. Extension option details
    if (extensionOption) {
      detailedAnalysis.push(`Extension period: ${formatDate(extensionOption.startDate)} to ${formatDate(extensionOption.endDate)}`);
    }
    
    // 6. Last legal day
    detailedAnalysis.push(`Last legal day: ${formatDate(lastLegalDay)}`);
    
    // 7. Overstay warning
    if (CURRENT_DATE > lastLegalDay) {
      const overstayDays = calculateDays(lastLegalDay, CURRENT_DATE);
      const fineEstimate = Math.min(26.31 + (overstayDays * 2), 210.50); // UVT estimate
      detailedAnalysis.push(`⚠️ ILLEGAL STATUS: You have overstayed by ${overstayDays} days. Potential fine: ${fineEstimate.toFixed(2)} UVT (≈ COP ${(fineEstimate * 47065).toLocaleString()})`);
    }

    // Additional analysis
    if (ongoingTrips.length > 0) {
      detailedAnalysis.push(`🔄 Ongoing stay: You have ${ongoingTrips.length} trip(s) without exit dates`);
    }
    
    if (currentUsage.tourism >= MAX_QUOTA) {
      detailedAnalysis.push(`📊 Quota exhausted: You have used all ${MAX_QUOTA} tourism days this year`);
    }
    
    if (currentUsage.remainingQuota < 30) {
      detailedAnalysis.push(`⚠️ Low quota warning: Only ${currentUsage.remainingQuota} days remaining this year`);
    }

    const result: AnalysisResult = {
      daysLeftQuota: currentUsage.remainingQuota,
      daysLeftPermit,
      extensionSuggestion: extensionOption ? `Apply for ${extensionOption.days} day extension` : undefined,
      visaApplicationDate,
      extensionOption,
      lastLegalDay,
      overstayWarning: CURRENT_DATE > lastLegalDay ? `Overstayed by ${calculateDays(lastLegalDay, CURRENT_DATE)} days` : undefined,
      yearlyUsage,
      currentPermitEnd,
      quotaExhausted: currentUsage.tourism >= MAX_QUOTA,
      visaRunNeeded: currentUsage.tourism >= MAX_QUOTA && ongoingTrips.length === 0,
      detailedAnalysis
    };

    setAnalysis(result);
    setShowResults(true);
  };

  // Generate timeline data
  const timelineData = useMemo(() => {
    const validTrips = trips.filter(trip => trip.entry && trip.exit);
    const ongoingTrips = trips.filter(trip => trip.entry && !trip.exit);
    
    if (validTrips.length === 0 && ongoingTrips.length === 0) return null;

    const allTrips = [...validTrips, ...ongoingTrips];
    const firstEntry = new Date(Math.min(...allTrips.map(t => t.entry!.getTime())));
    const lastDate = ongoingTrips.length > 0 ? CURRENT_DATE : new Date(Math.max(...validTrips.map(t => t.exit!.getTime())));

    // Generate months for timeline
    const months = eachMonthOfInterval({ start: firstEntry, end: lastDate });

    // Create timeline trips
    const timelineTrips = allTrips.map((trip, index) => {
      const end = trip.exit || CURRENT_DATE;
      const days = calculateDays(trip.entry!, end);
      const isOngoing = !trip.exit;
      
      return {
        id: trip.id,
        start: trip.entry!,
        end,
        days,
        label: `Trip ${index + 1}`,
        color: trip.underVisa ? 'bg-yellow-500' : 'bg-green-500',
        underVisa: trip.underVisa,
        isOngoing
      };
    });

    return {
      firstEntry,
      lastDate,
      months,
      trips: timelineTrips
    };
  }, [trips]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Colombia Tourism Permit Calculator
          </h2>
          <p className="text-gray-600 max-w-4xl mx-auto">
            Based on general rules from Migración Colombia. This calculator helps track your 180-day annual quota 
            for tourism stays. Days under visas are counted separately and do not affect your tourism quota. 
            Current date: {formatDate(CURRENT_DATE)}. Extension ranges are potential; apply 5 business days before permit end.
          </p>
        </div>

        {/* Trip Forms */}
        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Your Trips</h3>
            <button
              onClick={addTrip}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add Trip
            </button>
          </div>

          {trips.map((trip, index) => (
            <div key={trip.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">Trip {index + 1}</h4>
                {trips.length > 1 && (
                  <button
                    onClick={() => removeTrip(trip.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entry Date *
                  </label>
                  <input
                    type="date"
                    value={trip.entry ? trip.entry.toISOString().split('T')[0] : ''}
                    onChange={(e) => updateTrip(trip.id, 'entry', e.target.value ? new Date(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exit Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={trip.exit ? trip.exit.toISOString().split('T')[0] : ''}
                    onChange={(e) => updateTrip(trip.id, 'exit', e.target.value ? new Date(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty if still in Colombia
                  </p>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={trip.underVisa}
                      onChange={(e) => updateTrip(trip.id, 'underVisa', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Under Visa</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Section */}
        {showResults && analysis && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Analysis Results</h3>
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
                {timelineData && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    {/* Month Labels */}
                    <div className="flex justify-between mb-4 text-xs text-gray-500 font-medium">
                      {timelineData.months.map((month, index) => (
                        <div key={index} className="text-center">
                          <div className="font-semibold">{format(month, 'MMM')}</div>
                          <div>{format(month, 'yyyy')}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Timeline Bar */}
                    <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {timelineData.trips.map((trip) => {
                        const totalDays = differenceInDays(timelineData.lastDate, timelineData.firstEntry);
                        const startOffset = differenceInDays(trip.start, timelineData.firstEntry);
                        const tripDays = differenceInDays(trip.end, trip.start) + 1;
                        
                        const left = (startOffset / totalDays) * 100;
                        const width = (tripDays / totalDays) * 100;
                        
                        return (
                          <div
                            key={trip.id}
                            className={`absolute h-full ${trip.color} rounded shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
                            style={{
                              left: `${left}%`,
                              width: `${width}%`
                            }}
                            title={`${trip.label}: ${format(trip.start, 'MMM dd, yyyy')} - ${trip.isOngoing ? 'Ongoing' : format(trip.end, 'MMM dd, yyyy')}`}
                          />
                        );
                      })}
                    </div>
                    
                    {/* Trip Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {timelineData.trips.map((trip) => (
                        <div
                          key={trip.id}
                          className={`p-3 rounded-lg border ${trip.underVisa ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium px-2 py-1 rounded ${trip.underVisa ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                              {trip.underVisa ? 'Visa' : 'Tourism'}
                            </span>
                            {trip.isOngoing && (
                              <span className="text-xs text-purple-600 font-medium">🔄 Ongoing</span>
                            )}
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <div>{format(trip.start, 'MMM dd, yyyy')}</div>
                            <div className="text-gray-500">
                              {trip.isOngoing ? 'Ongoing' : format(trip.end, 'MMM dd, yyyy')}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {trip.days} days{trip.isOngoing ? ' (ongoing)' : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Analysis */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Analysis</h3>
                <div className="space-y-3">
                  {analysis.detailedAnalysis.map((item, index) => {
                    let bgColor = 'bg-blue-50 border-blue-200';
                    let textColor = 'text-blue-800';
                    
                    if (item.includes('⚠️ ILLEGAL STATUS')) {
                      bgColor = 'bg-red-50 border-red-200';
                      textColor = 'text-red-800';
                    } else if (item.includes('Extension')) {
                      bgColor = 'bg-yellow-50 border-yellow-200';
                      textColor = 'text-yellow-800';
                    } else if (item.includes('visa application')) {
                      bgColor = 'bg-purple-50 border-purple-200';
                      textColor = 'text-purple-800';
                    } else if (item.includes('Ongoing')) {
                      bgColor = 'bg-purple-50 border-purple-200';
                      textColor = 'text-purple-800';
                    } else if (item.includes('quota exhausted')) {
                      bgColor = 'bg-orange-50 border-orange-200';
                      textColor = 'text-orange-800';
                    } else if (item.includes('Low quota')) {
                      bgColor = 'bg-orange-50 border-orange-200';
                      textColor = 'text-orange-800';
                    }
                    
                    return (
                      <div key={index} className={`p-4 ${bgColor} border rounded-lg`}>
                        <p className={textColor}>
                          <strong>{index + 1}.</strong> {item}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Yearly Usage Table */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yearly Usage Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tourism Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visa Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Quota</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.from(analysis.yearlyUsage.entries()).map(([year, usage]) => (
                      <tr key={year}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.tourism}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.visa}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.remainingQuota}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            usage.remainingQuota === 0 
                              ? 'bg-red-100 text-red-800' 
                              : usage.remainingQuota < 30 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {usage.remainingQuota === 0 ? 'Exhausted' : usage.remainingQuota < 30 ? 'Low' : 'Available'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColombiaStayCalculator; 