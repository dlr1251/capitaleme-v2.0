import React, { useState, useEffect } from 'react';
import whiteVerticalLogo from '../../assets/logo/white-vertical.svg';

const AnimatedLogoIcon = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const icons = [
    // Capital M Logo
    {
      type: 'logo',
      content: (
        <img 
          src={whiteVerticalLogo.src} 
          alt="Capital M Law" 
          className="w-8 h-8 text-white"
        />
      )
    },
    // Flowbite Shield Check Icon
    {
      type: 'icon',
      content: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 3.694 10.95 8.963 12.348a.749.749 0 00.574 0C16.306 20.7 20 15.692 20 9.75a12.74 12.74 0 00-.637-3.985.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08zM15.75 9.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
        </svg>
      )
    },
    // Emoji - Colombian Flag
    {
      type: 'emoji',
      content: (
        <div className="w-8 h-8 text-white text-2xl flex items-center justify-center">
          🇨🇴
        </div>
      )
    },
    // Flowbite Handshake Icon
    {
      type: 'icon',
      content: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
    // Flowbite Scale/Justice Icon (Star)
    {
      type: 'icon',
      content: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      )
    },
    // Flowbite Heart Icon
    {
      type: 'icon',
      content: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      )
    },
    // Flowbite Globe Icon
    {
      type: 'icon',
      content: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.547 4.505a8.273 8.273 0 011.05-.163c.526 0 1.01.163 1.411.438.401.275.701.65.901 1.125.2.475.3 1.05.3 1.725 0 .675-.1 1.25-.3 1.725-.2.475-.5.85-.901 1.125-.401.275-.885.438-1.411.438a2.625 2.625 0 01-1.411-.438c-.401-.275-.701-.65-.901-1.125-.2-.475-.3-1.05-.3-1.725 0-.675.1-1.25.3-1.725.2-.475.5-.85.901-1.125zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
        </svg>
      )
    },
    // Flowbite Document Text Icon
    {
      type: 'icon',
      content: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % icons.length);
        setIsAnimating(false);
      }, 300); // Half of the animation duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [icons.length]);

  return (
    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
      {/* Background animation */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 transition-opacity duration-600 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}></div>
      
      {/* Icon container with animation */}
      <div className={`relative z-10 transition-all duration-600 ${
        isAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
      }`}>
        {icons[currentIndex].content}
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-2 left-2 w-1 h-1 bg-white/60 rounded-full transition-all duration-600 ${
          isAnimating ? 'opacity-100 scale-150' : 'opacity-0 scale-0'
        }`}></div>
        <div className={`absolute bottom-2 right-2 w-1 h-1 bg-white/60 rounded-full transition-all duration-600 delay-150 ${
          isAnimating ? 'opacity-100 scale-150' : 'opacity-0 scale-0'
        }`}></div>
        <div className={`absolute top-1/2 left-1 w-0.5 h-0.5 bg-white/40 rounded-full transition-all duration-600 delay-300 ${
          isAnimating ? 'opacity-100 scale-200' : 'opacity-0 scale-0'
        }`}></div>
      </div>
      
      {/* Pulse ring effect */}
      <div className={`absolute inset-0 border-2 border-white/30 rounded-full transition-all duration-600 ${
        isAnimating ? 'scale-125 opacity-0' : 'scale-100 opacity-100'
      }`}></div>
    </div>
  );
};

export default AnimatedLogoIcon; 