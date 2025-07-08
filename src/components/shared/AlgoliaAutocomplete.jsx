import React, { useEffect, useRef } from 'react';
import {algoliasearch} from 'algoliasearch';
console.log('[AlgoliaAutocomplete] import start');
console.log('[AlgoliaAutocomplete] algoliasearch imported', algoliasearch);
import '@algolia/autocomplete-theme-classic';
import parse from 'html-react-parser';
console.log('[AlgoliaAutocomplete] theme imported');

const searchClient = algoliasearch(
  'QEWO37EYRC',
  'ee2298bb686455d9282c7bf5ffc061a3'
);
console.log('[AlgoliaAutocomplete] searchClient created', searchClient);

const indexName = 'legal_documents';
console.log('[AlgoliaAutocomplete] indexName', indexName);

export default function AlgoliaAutocomplete({ lang = 'en' }) {
  console.log('[AlgoliaAutocomplete] component render', { lang });
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('[AlgoliaAutocomplete] useEffect triggered', { lang });
    if (!containerRef.current) {
      console.log('[AlgoliaAutocomplete] containerRef not ready');
      return;
    }
    let instance;
    let autocomplete;
    import('@algolia/autocomplete-js').then((pkg) => {
      console.log('[AlgoliaAutocomplete] @algolia/autocomplete-js imported', pkg);
      autocomplete = pkg.autocomplete || pkg.default?.autocomplete;
      console.log('[AlgoliaAutocomplete] autocomplete extracted', autocomplete);
      try {
        console.log('[AlgoliaAutocomplete] initializing autocomplete instance');
        instance = autocomplete({
          container: containerRef.current,
          placeholder:
            lang === 'es'
              ? 'Buscar en el repositorio legal...'
              : 'Search the legal repository...',
          detachedMediaQuery: '', // Always inline
          getSources({ query }) {
            console.log('[AlgoliaAutocomplete] getSources called', { query });
            return [
              {
                sourceId: 'legalDocs',
                getItems() {
                  console.log('[AlgoliaAutocomplete] getItems called', { query });
                  if (!query) return Promise.resolve([]);
                  return searchClient
                    .search([
                      {
                        indexName,
                        query,
                        params: {
                          // filters: "lang:'En'"
                        }
                      },
                    ])
                    .then(({ results }) => {
                      let hits = results[0]?.hits || [];
                      // Only keep hits with lang === 'En' (extra safety)
                      hits = hits.filter(hit => hit.lang === 'En');
                      console.log('[AlgoliaAutocomplete] search hits', hits);
                      return hits;
                    })
                    .catch((err) => {
                      console.error('[AlgoliaAutocomplete] search error', err);
                      return [];
                    });
                },
                templates: {
                  item({ item }) {
                    console.log('[AlgoliaAutocomplete] rendering item', item);
                    // Render result using html-react-parser
                    const htmlString = `
                      <a href="/en/clkr/${item.slug || ''}" class="aa-ItemLink" style="display: block; text-decoration: none; padding: 1rem; border-radius: 0.5rem; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.04); margin-bottom: 0.5rem; transition: box-shadow 0.2s; border: 1px solid #e5e7eb;">
                        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                          <div style="font-weight: 600; color: #2563eb; font-size: 1.1rem; word-break: break-word;">${item.name || ''}</div>
                          <div style="color: #6b7280; font-size: 0.95em; font-style: italic;">${item.module ? (Array.isArray(item.module) ? item.module.join(', ') : item.module) : ''}</div>
                          <div style="color: #374151; font-size: 0.98em; margin-top: 0.25rem;">${item.description || ''}</div>
                          <div style="color: #93c5fd; font-size: 0.85em; margin-top: 0.25rem;">${item.slug ? `/${item.slug}` : ''}</div>
                        </div>
                      </a>
                    `;
                    return parse(htmlString);
                  },
                },
              },
            ];
          },
        });
        console.log('[AlgoliaAutocomplete] autocomplete instance created', instance);
      } catch (err) {
        console.error('[AlgoliaAutocomplete] error initializing autocomplete', err);
      }
    });

    return () => {
      console.log('[AlgoliaAutocomplete] cleaning up autocomplete instance');
      if (instance) instance.destroy();
    };
  }, [lang]);

  return <div ref={containerRef} className="my-6 mx-auto max-w-xl" />;
} 