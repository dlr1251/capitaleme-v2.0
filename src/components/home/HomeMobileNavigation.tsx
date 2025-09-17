import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { Lang } from '../../context/LanguageContext.tsx';

interface HomeMobileNavigationProps {
  lang?: Lang;
  pathname?: string;
}

const HomeMobileNavigation: React.FC<HomeMobileNavigationProps> = ({
  lang = 'en',
  pathname = ''
}) => {
  return (
    <>
      {/* WhatsApp Floating Action Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <a
          href="https://wa.me/573146022411"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center hover:scale-105"
          aria-label="WhatsApp"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </a>
      </div>
    </>
  );
};

export default HomeMobileNavigation;
