import React, { useState, useEffect } from 'react';

function Calculator() {
  const UVT = 49065;
  const [propertyValue, setPropertyValue] = useState(498000000);
  const [notaryFee, setNotaryFee] = useState(0);
  const [registrationFee, setRegistrationFee] = useState(0);
  const [rentasFee, setRentasFee] = useState(0);
  const [brokerageFee, setBrokerageFee] = useState(0);
  const [gmfFee, setGmfFee] = useState(0);
  const [stampDuty, setStampDuty] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [qualifiesForVisa, setQualifiesForVisa] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [activeTab, setActiveTab] = useState('COP');

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/4dea10d77ad14706f2c5afe0/latest/USD`);
      const data = await response.json();
      setExchangeRate(data.conversion_rates.COP);
    };

    fetchExchangeRate();
  }, []);

  useEffect(() => {
    const calculateNotaryFee = () => propertyValue * 0.0027;
    const calculateRegistrationFee = () => propertyValue * 0.0167;
    const calculateRentasFee = () => propertyValue * 0.01;
    const calculateBrokerageFee = () => propertyValue * 0.006;
    const calculateGmfFee = () => propertyValue * 4 / 1000;
    
    const propertyValueInUVT = propertyValue / UVT;

    const calculateStampDuty = () => {
      if (propertyValueInUVT <= 20000) {
        return 0;
      } else if (propertyValueInUVT > 20000 && propertyValueInUVT <= 50000) {
        return (propertyValueInUVT - 20000) * UVT * 0.015;
      } else {
        return ((propertyValueInUVT - 50000) * UVT * 0.03) + (450 * UVT);
      }
    };

    const notary = calculateNotaryFee();
    const registration = calculateRegistrationFee();
    const rentas = calculateRentasFee();
    const brokerage = calculateBrokerageFee();
    const gmf = calculateGmfFee();
    const stamp = calculateStampDuty();
    const total = notary + registration + rentas + brokerage + gmf + stamp;

    setNotaryFee(notary);
    setRegistrationFee(registration);
    setRentasFee(rentas);
    setBrokerageFee(brokerage);
    setGmfFee(gmf);
    setStampDuty(stamp);
    setTotalFees(total);

    setQualifiesForVisa(propertyValue >= 455000000);
  }, [propertyValue, UVT]);

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleSliderChange = (value) => {
    setPropertyValue(value * 1000000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Real Estate Fees Calculator</h1>
        <div className="text-center mb-6">
          <p className="text-xl font-bold">Exchange Rate (USD to COP):</p>
          <p className="text-3xl font-bold text-blue-500">{exchangeRate}</p>
        </div>
        <div className="block md:hidden">
          <div className="flex justify-center mb-4">
            <button
              className={`px-4 py-2 ${activeTab === 'COP' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('COP')}
            >
              COP
            </button>
            <button
              className={`px-4 py-2 ml-2 ${activeTab === 'USD' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('USD')}
            >
              USD
            </button>
          </div>
          {activeTab === 'COP' ? (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Property Value (COP): 3
                </label>
                <input
                  type="number"
                  min="300"
                  max="5000"                  
                  value={propertyValue / 1000000}
                  onChange={(e) => handleSliderChange(e.target.value)}
                  className="w-full"
                />
                <span className="block text-gray-900 mt-2">{formatCurrency(propertyValue, 'COP')}</span>
              </div>
              {!qualifiesForVisa && (
                <div className="mb-4 text-red-500 font-semibold">
                  The property value does not qualify the buyer for an M - Investor visa.
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Notary Fees (0.27%):
                </label>
                <span className="block text-gray-900">{formatCurrency(notaryFee, 'COP')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Registration Fees (1.67%):
                </label>
                <span className="block text-gray-900">{formatCurrency(registrationFee, 'COP')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Rentas Fees (1%):
                </label>
                <span className="block text-gray-900">{formatCurrency(rentasFee, 'COP')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Brokerage Account Fees (0.6%):
                </label>
                <span className="block text-gray-900">{formatCurrency(brokerageFee, 'COP')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  GMF (4*1000):
                </label>
                <span className="block text-gray-900">{formatCurrency(gmfFee, 'COP')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Stamp Duty:
                </label>
                <span className="block text-gray-900">{formatCurrency(stampDuty, 'COP')}</span>
              </div>
              <div className="border-t mt-4 pt-4">
                <h2 className="text-xl font-bold">Total Fees:</h2>
                <span className="block text-gray-900 text-2xl">{formatCurrency(totalFees, 'COP')}</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Property Value (USD):
                </label>
                <span className="block text-gray-900">{formatCurrency(propertyValue / exchangeRate, 'USD')}</span>
                <input
                  type="number"
                  min="300"
                  max="5000"
                  step="5"
                  value={propertyValue / 1000000}
                  onChange={(e) => handleSliderChange(e.target.value)}
                  className="w-full mt-2"
                />
              </div>
              {!qualifiesForVisa && (
                <div className="mb-4 text-red-500 font-semibold">
                  The property value does not qualify the buyer for an M - Investor visa.
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Notary Fees (0.27%):
                </label>
                <span className="block text-gray-900">{formatCurrency(notaryFee / exchangeRate, 'USD')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Registration Fees (1.67%):
                </label>
                <span className="block text-gray-900">{formatCurrency(registrationFee / exchangeRate, 'USD')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Rentas Fees (1%):
                </label>
                <span className="block text-gray-900">{formatCurrency(rentasFee / exchangeRate, 'USD')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Brokerage Account Fees (0.6%):
                </label>
                <span className="block text-gray-900">{formatCurrency(brokerageFee / exchangeRate, 'USD')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  GMF (4*1000):
                </label>
                <span className="block text-gray-900">{formatCurrency(gmfFee / exchangeRate, 'USD')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Stamp Duty:
                </label>
                <span className="block text-gray-900">{formatCurrency(stampDuty / exchangeRate, 'USD')}</span>
              </div>
              <div className="border-t mt-4 pt-4">
                <h2 className="text-xl font-bold">Total Fees:</h2>
                <span className="block text-gray-900 text-2xl">{formatCurrency(totalFees / exchangeRate, 'USD')}</span>
              </div>
            </div>
          )}
        </div>
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">COP</h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Property Value (COP):
                </label>
                <input
                  type="number"
                  min="300"
                  max="5000"
                  step="5"
                  value={propertyValue / 1000000}
                  onChange={(e) => handleSliderChange(e.target.value)}
                  className="w-full"
                />
                <span className="block text-gray-900 mt-2">{formatCurrency(propertyValue, 'COP')}</span>
              </div>
              {!qualifiesForVisa && (
                <div className="mb-4 text-red-500 font-semibold">
                  The property value does not qualify the buyer for an M - Investor visa.
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Notary Fees (0.27%):
                </label>
                <span className="block text-gray-900">{formatCurrency(notaryFee, 'COP')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Registration Fees (1.67%):
                </label>
                <span className="block text-gray-900">{formatCurrency(registrationFee, 'COP')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Rentas Fees (1%):
                </label>
                <span className="block text-gray-900">{formatCurrency(rentasFee, 'COP')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Brokerage Account Fees (0.6%):
                </label>
                <span className="block text-gray-900">{formatCurrency(brokerageFee, 'COP')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  GMF (4*1000):
                </label>
                <span className="block text-gray-900">{formatCurrency(gmfFee, 'COP')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Stamp Duty:
                </label>
                <span className="block text-gray-900">{formatCurrency(stampDuty, 'COP')}</span>
              </div>
              <div className="border-t mt-4 pt-4">
                <h2 className="text-xl font-bold">Total Fees:</h2>
                <span className="block text-gray-900 text-2xl">{formatCurrency(totalFees, 'COP')}</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">USD</h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Property Value (USD):
                </label>
                <input
                  type="number"
                  min="300"
                  max="5000"
                  step="5"
                  value={propertyValue / 1000000}
                  onChange={(e) => handleSliderChange(e.target.value)}
                  className="w-full"
                />
                <span className="block text-gray-900 mt-2">{formatCurrency(propertyValue / exchangeRate, 'USD')}</span>
              </div>
              {!qualifiesForVisa && (
                <div className="mb-4 text-red-500 font-semibold">
                  The property value does not qualify the buyer for an M - Investor visa.
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Notary Fees (0.27%):
                </label>
                <span className="block text-gray-900">{formatCurrency(notaryFee / exchangeRate, 'USD')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Registration Fees (1.67%):
                </label>
                <span className="block text-gray-900">{formatCurrency(registrationFee / exchangeRate, 'USD')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Rentas Fees (1%):
                </label>
                <span className="block text-gray-900">{formatCurrency(rentasFee / exchangeRate, 'USD')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Brokerage Account Fees (0.6%):
                </label>
                <span className="block text-gray-900">{formatCurrency(brokerageFee / exchangeRate, 'USD')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  GMF (4*1000):
                </label>
                <span className="block text-gray-900">{formatCurrency(gmfFee / exchangeRate, 'USD')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Stamp Duty:
                </label>
                <span className="block text-gray-900">{formatCurrency(stampDuty / exchangeRate, 'USD')}</span>
              </div>
              <div className="border-t mt-4 pt-4">
                <h2 className="text-xl font-bold">Total Fees:</h2>
                <span className="block text-gray-900 text-2xl">{formatCurrency(totalFees / exchangeRate, 'USD')}</span>
              </div>
              <div className="mt-4 text-gray-700">
                <p>Current USD to COP Exchange Rate: {exchangeRate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
