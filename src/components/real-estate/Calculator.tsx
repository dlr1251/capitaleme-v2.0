import { useState, useEffect } from 'react';
import { CurrencyDollarIcon, CalculatorIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface CalculatorProps {
  initialValue?: number;
  lang?: 'en' | 'es';
}

function Calculator({ initialValue, lang = 'en' }: CalculatorProps) {
  const UVT = 49065;
  const [propertyValue, setPropertyValue] = useState(initialValue || 498000000);
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://v6.exchangerate-api.com/v6/4dea10d77ad14706f2c5afe0/latest/USD`);
        const data = await response.json();
        setExchangeRate(data.conversion_rates.COP);
      } catch (error) {
        setExchangeRate(4000); // Fallback rate
      } finally {
        setIsLoading(false);
      }
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleSliderChange = (value: string) => {
    setPropertyValue(parseInt(value) * 1000000);
  };

  const fees = [
    { name: 'Notary Fees', amount: notaryFee, percentage: '0.27%', color: 'blue' },
    { name: 'Registration Fees', amount: registrationFee, percentage: '1.67%', color: 'green' },
    { name: 'Rentas Fees', amount: rentasFee, percentage: '1%', color: 'purple' },
    { name: 'Brokerage Fees', amount: brokerageFee, percentage: '0.6%', color: 'orange' },
    { name: 'GMF', amount: gmfFee, percentage: '0.4%', color: 'red' },
    { name: 'Stamp Duty', amount: stampDuty, percentage: 'Variable', color: 'indigo' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-800 text-sm font-medium mb-6">
            <CalculatorIcon className="w-4 h-4 mr-2" />
            Real Estate Fee Calculator
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Calculate Your
            <span className="block text-emerald-600">Property Fees</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get an accurate estimate of all fees involved in your Colombian property transaction. 
            Our calculator includes notary fees, registration costs, and all applicable taxes.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Exchange Rate Display */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="w-6 h-6" />
                <span className="text-lg font-semibold">Current Exchange Rate</span>
              </div>
              <div className="text-right">
                {isLoading ? (
                  <div className="animate-pulse bg-white/20 rounded px-3 py-1">Loading...</div>
                ) : (
                  <div className="text-2xl font-bold">1 USD = {exchangeRate.toFixed(2)} COP</div>
                )}
              </div>
            </div>
          </div>
          <div className="p-8">
            {/* Currency Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'COP' 
                      ? 'bg-white text-emerald-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('COP')}
                >
                  Colombian Pesos (COP)
                </button>
                <button
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'USD' 
                      ? 'bg-white text-emerald-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('USD')}
                >
                  US Dollars (USD)
                </button>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Property Value
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="300"
                      max="5000"
                      step="50"
                      value={propertyValue / 1000000}
                      onChange={(e) => handleSliderChange(e.target.value)}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>300M COP</span>
                      <span>5B COP</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-3xl font-bold text-emerald-600">
                      {activeTab === 'COP' 
                        ? formatCurrency(propertyValue, 'COP')
                        : formatCurrency(propertyValue / exchangeRate, 'USD')
                      }
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {activeTab === 'COP' 
                        ? formatCurrency(propertyValue / exchangeRate, 'USD')
                        : formatCurrency(propertyValue, 'COP')
                      }
                    </div>
                  </div>
                </div>
                {/* Visa Eligibility */}
                <div className={`p-4 rounded-lg border-2 ${
                  qualifiesForVisa 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center">
                    {qualifiesForVisa ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                    ) : (
                      <InformationCircleIcon className="w-5 h-5 text-yellow-600 mr-3" />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {qualifiesForVisa ? 'Visa Eligible' : 'Not Visa Eligible'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {qualifiesForVisa 
                          ? 'This property value qualifies for a Colombian investment visa.'
                          : 'Property value must be at least $455M COP to qualify for an investment visa.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Results Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Fee Breakdown</h3>
                  <div className="space-y-3">
                    {fees.map((fee, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${getColorClasses(fee.color)}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{fee.name}</div>
                            <div className="text-sm opacity-75">{fee.percentage}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {activeTab === 'COP' 
                                ? formatCurrency(fee.amount, 'COP')
                                : formatCurrency(fee.amount / exchangeRate, 'USD')
                              }
                            </div>
                            <div className="text-sm opacity-75">
                              {activeTab === 'COP' 
                                ? formatCurrency(fee.amount / exchangeRate, 'USD')
                                : formatCurrency(fee.amount, 'COP')
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Total */}
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-bold text-emerald-900">Total Fees</h4>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-900">
                        {activeTab === 'COP' 
                          ? formatCurrency(totalFees, 'COP')
                          : formatCurrency(totalFees / exchangeRate, 'USD')
                        }
                      </div>
                      <div className="text-sm text-emerald-700">
                        {activeTab === 'COP' 
                          ? formatCurrency(totalFees / exchangeRate, 'USD')
                          : formatCurrency(totalFees, 'COP')
                        }
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-emerald-700">
                    {((totalFees / propertyValue) * 100).toFixed(2)}% of property value
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Calculator; 