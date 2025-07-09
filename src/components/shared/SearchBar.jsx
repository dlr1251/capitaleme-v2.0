// TODO: Fix react-instantsearch CommonJS module import issue
// Temporarily commented out due to Vite module resolution errors
// Need to resolve: Named export 'default' not found for react-instantsearch

/*
// Capital M colors: blue (#2563eb), indigo (#6366f1)
// This is a vanilla JS Algolia InstantSearch widget for use in any frontend (Astro, React, etc.)
// Usage: <div id="algolia-searchbar"></div> in your page/component

import React, { useRef, useState } from 'react';
import pkg from 'react-instantsearch';
const { InstantSearch, SearchBox, Hits, useInstantSearch } = pkg;
import { algoliasearch } from 'algoliasearch';

const ALGOLIA_APP_ID = import.meta.env.PUBLIC_ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = import.meta.env.PUBLIC_ALGOLIA_SEARCH_API_KEY;
const ALGOLIA_INDEX = import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME;

if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_KEY || !ALGOLIA_INDEX) {
  throw new Error('Algolia environment variables are missing. Please set PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_KEY, and PUBLIC_ALGOLIA_INDEX in your .env file.');
}

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

function Hit({ hit }) {
  return (
    <div className="p-4 hover:bg-blue-50 cursor-pointer rounded">
      <div className="font-semibold text-blue-700">{hit.name || hit.title || hit.objectID}</div>
      {hit.description && <div className="text-gray-600 text-sm">{hit.description}</div>}
    </div>
  );
}

// Move useHasResults and panel logic into a child component
function SearchPanel({ isFocused }) {
  const { results } = useInstantSearch();
  const hasResults = results && results.nbHits > 0;

  if (!isFocused) return null;
  return (
    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {hasResults ? (
        <Hits hitComponent={Hit} />
      ) : (
        <div className="p-4 text-gray-500 text-center">No results found.</div>
      )}
    </div>
  );
}

const SearchBar = ({ lang = 'es' }) => {
  const [isFocused, setIsFocused] = useState(false);
  const panelRef = useRef(null);

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
      <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX} future={{ preserveSharedStateOnUnmount: true }}>
        <SearchBox
          placeholder={lang === 'es' ? 'Buscar en el repositorio legal...' : 'Search the legal repository...'}
          classNames={{
            root: 'mb-0',
            input: 'w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
          }}
          onFocus={() => setIsFocused(true)}
        />
        <SearchPanel isFocused={isFocused} />
      </InstantSearch>
    </div>
  );
};

export default SearchBar;
*/

// Temporary placeholder component
import React from 'react';

const SearchBar = ({ lang = 'es' }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto my-8">
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
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled
        />
      </div>
      <div className="mt-2 text-center text-gray-500 text-sm">
        🔧 Search functionality temporarily disabled - TODO: Fix react-instantsearch module import
      </div>
    </div>
  );
};

export default SearchBar; 