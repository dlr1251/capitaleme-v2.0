import React, { useState, useEffect } from 'react';
import whiteVerticalLogo from '../../assets/logo/white-vertical.svg';
import { ShieldCheckIcon, UserGroupIcon, StarIcon, HeartIcon, GlobeAltIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

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
        <ShieldCheckIcon className="w-8 h-8 text-white" />
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
        <UserGroupIcon className="w-8 h-8 text-white" />
      )
    },
    // Flowbite Scale/Justice Icon (Star)
    {
      type: 'icon',
      content: (
        <StarIcon className="w-8 h-8 text-white" />
      )
    },
    // Flowbite Heart Icon
    {
      type: 'icon',
      content: (
        <HeartIcon className="w-8 h-8 text-white" />
      )
    },
    // Flowbite Globe Icon
    {
      type: 'icon',
      content: (
        <GlobeAltIcon className="w-8 h-8 text-white" />
      )
    },
    // Flowbite Document Text Icon
    {
      type: 'icon',
      content: (
        <DocumentTextIcon className="w-8 h-8 text-white" />
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