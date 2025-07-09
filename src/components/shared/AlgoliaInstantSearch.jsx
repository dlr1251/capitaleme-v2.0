// TODO: Fix react-instantsearch CommonJS module import issue
// Temporarily commented out due to Vite module resolution errors
// Need to resolve: Named export 'default' not found for react-instantsearch

/*
import React, { useState, useRef, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import pkg from 'react-instantsearch';
const { InstantSearch, Highlight, connectHits, connectSearchBox } = pkg;

console.log('[AlgoliaInstantSearch] component loaded');

const searchClient = algoliasearch('QEWO37EYRC', 'ee2298bb686455d9282c7bf5ffc061a3');
console.log('[AlgoliaInstantSearch] searchClient created', searchClient);

function Hit({ hit, selected }) {
  if (hit.lang !== 'En') return null;
  return (
    <a
      href={`/en/clkr/${hit.slug || ''}`}
      className={`block px-4 py-3 rounded transition cursor-pointer ${selected ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
      style={{ textDecoration: 'none' }}
      tabIndex={-1}
    >
      <div className="font-semibold text-blue-700 text-base">
        <Highlight attribute="name" hit={hit} tagName="mark" />
      </div>
      <div className="text-gray-500 text-xs italic">
        {Array.isArray(hit.module) ? hit.module.join(', ') : hit.module}
      </div>
      <div className="text-gray-700 text-sm mt-1">
        <Highlight attribute="description" hit={hit} tagName="mark" />
      </div>
    </a>
  );
}

function CustomHitsComponent({ hits, selectedIdx }) {
  const filteredHits = hits.filter(hit => hit.lang === 'En');
  const panelRef = useRef(null);

  // Scroll selected item into view
  useEffect(() => {
    if (panelRef.current && selectedIdx >= 0) {
      const el = panelRef.current.querySelectorAll('a')[selectedIdx];
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIdx]);

  if (filteredHits.length === 0) {
    return <div className="p-4 text-center text-gray-500">No results found.</div>;
  }
  return (
    <div ref={panelRef}>
      {filteredHits.map((hit, idx) => (
        <Hit key={hit.objectID} hit={hit} selected={selectedIdx === idx} />
      ))}
    </div>
  );
}

const CustomHits = connectHits(CustomHitsComponent);

const CustomSearchBox = connectSearchBox(({ currentRefinement, refine, inputRef, lang, setIsFocused }) => (
  <div className="w-full max-w-2xl mx-auto">
    <div className="relative w-full">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="search"
        placeholder={lang === 'es' ? 'Buscar en el repositorio legal...' : 'Search the legal repository...'}
        value={currentRefinement}
        onChange={e => refine(e.currentTarget.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-lg shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none placeholder-gray-400"
        style={{ fontWeight: 500 }}
        autoComplete="off"
        spellCheck={false}
        maxLength={512}
      />
    </div>
  </div>
));

export default function AlgoliaInstantSearch({ lang = 'en' }) {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    if (!isFocused) return;
    function onKeyDown(e) {
      if (!panelRef.current) return;
      const items = panelRef.current.querySelectorAll('a');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx(idx => Math.min(idx + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx(idx => Math.max(idx - 1, 0));
      } else if (e.key === 'Enter' && selectedIdx >= 0) {
        e.preventDefault();
        items[selectedIdx].click();
      } else if (e.key === 'Escape') {
        setIsFocused(false);
        inputRef.current.blur();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFocused, selectedIdx]);

  // Reset selection on open/close
  useEffect(() => {
    if (isFocused) setSelectedIdx(0);
    else setSelectedIdx(-1);
  }, [isFocused]);

  return (
    <div className="relative my-10 mx-auto w-full max-w-4xl flex flex-col items-center">
      <InstantSearch indexName="legal_documents" searchClient={searchClient}>
        <CustomSearchBox inputRef={inputRef} lang={lang} setIsFocused={setIsFocused} />
        {isFocused && (
          <div
            ref={panelRef}
            className="relative left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto"
          >
            <CustomHits selectedIdx={selectedIdx} />
          </div>
        )}
      </InstantSearch>
      <style>{`
        mark {
          background: none;
          color: #2563eb;
          text-decoration: underline;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
*/

// Temporary placeholder component
export default function AlgoliaInstantSearch({ lang = 'en' }) {
  return (
    <div className="relative my-10 mx-auto w-full max-w-4xl flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto">
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
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-lg shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none placeholder-gray-400"
            style={{ fontWeight: 500 }}
            autoComplete="off"
            spellCheck={false}
            maxLength={512}
            disabled
          />
        </div>
      </div>
      <div className="mt-4 text-center text-gray-500 text-sm">
        🔧 Search functionality temporarily disabled - TODO: Fix react-instantsearch module import
      </div>
    </div>
  );
} 