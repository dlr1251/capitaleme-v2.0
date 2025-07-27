import React from 'react';
// Removed unused and invalid icon imports
// import { ShareIcon } from '@heroicons/react/24/outline/index.js';
// import { XIcon as TwitterIcon, FacebookIcon, LinkedinIcon } from '@heroicons/react/24/outline/index.js';

interface SocialSharingProps {
  url: string;
  title: string;
  description?: string;
}

const networks = [
  {
    name: 'Twitter',
    href: (url: string, title: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    icon: (props: any) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 19c11 0 13-9 13-13v-.6A9.3 9.3 0 0023 3a9.1 9.1 0 01-2.6.7A4.5 4.5 0 0022.4.4a9.1 9.1 0 01-2.9 1.1A4.5 4.5 0 0016.1 0c-2.5 0-4.5 2-4.5 4.5 0 .4 0 .8.1 1.1C7.7 5.5 4.1 3.7 1.7.9c-.4.7-.6 1.5-.6 2.3 0 1.6.8 3 2.1 3.8A4.5 4.5 0 01.9 6v.1c0 2.2 1.6 4 3.7 4.4-.4.1-.8.2-1.2.2-.3 0-.6 0-.8-.1.6 1.9 2.4 3.3 4.5 3.3A9 9 0 010 17.5c2.1 1.3 4.6 2 7.2 2" /></svg>
    ),
    color: 'text-blue-500 hover:bg-blue-50',
  },
  {
    name: 'Facebook',
    href: (url: string, title: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (props: any) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" /></svg>
    ),
    color: 'text-blue-700 hover:bg-blue-100',
  },
  {
    name: 'LinkedIn',
    href: (url: string, title: string) => `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    icon: (props: any) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
    ),
    color: 'text-gray-700 hover:bg-gray-100',
  },
];

export const SocialSharing: React.FC<SocialSharingProps> = ({ url, title }) => {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-xs text-gray-500">Share:</span>
      {networks.map((network) => (
        <a
          key={network.name}
          href={network.href(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${network.name}`}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors ${network.color}`}
        >
          {network.icon({ className: 'w-5 h-5' })}
        </a>
      ))}
    </div>
  );
};

export default SocialSharing; 