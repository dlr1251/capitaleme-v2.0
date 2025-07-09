// Updated to use react-instantsearch-core instead of deprecated react-instantsearch
// This fixes the react-native dependency conflict

import React, { useRef, useState } from 'react';
import { InstantSearch, SearchBox, Hits, useInstantSearch } from 'react-instantsearch-core';
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