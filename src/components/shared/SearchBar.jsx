import React, { useState, useRef } from 'react';
import Fuse from 'fuse.js';

// Usage: <SearchBar items={arrayOfDocs} lang="en" />
const SearchBar = ({ items = [], lang = 'es' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const panelRef = useRef(null);

  // Configure Fuse.js
  const fuse = new Fuse(items, {
    keys: ['title', 'description'],
    threshold: 0.3,
    minMatchCharLength: 2,
  });

  const results = query ? fuse.search(query).map(r => r.item) : [];

  React.useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    if (isFocused) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isFocused]);

  return (
    <div className="relative w-full max-w-2xl mx-auto my-8" ref={panelRef}>
      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="search"
          placeholder={lang === 'es' ? 'Buscar en el repositorio legal...' : 'Search the legal repository...'}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
      </div>
      {isFocused && query && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <a
                key={item.id || idx}
                href={item.href || item.url || '#'}
                className="block p-4 hover:bg-blue-50 cursor-pointer rounded"
              >
                <div className="font-semibold text-blue-700">{item.title || item.name}</div>
                {item.description && <div className="text-gray-600 text-sm">{item.description}</div>}
              </a>
            ))
          ) : (
            <div className="p-4 text-gray-500 text-center">{lang === 'es' ? 'No se encontraron resultados.' : 'No results found.'}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 