import { useEffect, useState } from 'react';

const AnalyticsDebug: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [analyticsStatus, setAnalyticsStatus] = useState({
    gtag: false,
    dataLayer: false,
    clarity: false
  });

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const checkAnalytics = () => {
      setAnalyticsStatus({
        gtag: typeof window !== 'undefined' && typeof (window as any).gtag === 'function',
        dataLayer: typeof window !== 'undefined' && Array.isArray((window as any).dataLayer),
        clarity: typeof window !== 'undefined' && typeof (window as any).clarity === 'function'
      });
    };

    // Check immediately
    checkAnalytics();

    // Check again after a short delay to allow scripts to load
    const timeout = setTimeout(checkAnalytics, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-black text-white p-4 rounded-lg text-xs max-w-xs">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 text-blue-400 hover:text-blue-300"
      >
        {isVisible ? 'Hide' : 'Show'} Analytics Debug
      </button>
      
      {isVisible && (
        <div className="space-y-1">
          <div className="font-bold">Analytics Status:</div>
          <div className={`${analyticsStatus.gtag ? 'text-green-400' : 'text-red-400'}`}>
            • Google Analytics: {analyticsStatus.gtag ? '✅' : '❌'}
          </div>
          <div className={`${analyticsStatus.dataLayer ? 'text-green-400' : 'text-red-400'}`}>
            • Data Layer: {analyticsStatus.dataLayer ? '✅' : '❌'}
          </div>
          <div className={`${analyticsStatus.clarity ? 'text-green-400' : 'text-red-400'}`}>
            • Clarity: {analyticsStatus.clarity ? '✅' : '❌'}
          </div>
          <div className="text-gray-400 mt-2">
            Page: {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDebug;
