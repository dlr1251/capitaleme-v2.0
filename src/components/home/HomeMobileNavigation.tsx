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
  return null;
};

export default HomeMobileNavigation;
