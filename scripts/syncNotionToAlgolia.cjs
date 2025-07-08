/**
 * Algolia Sync Script for Algoliasearch v5 Node.js API
 *
 * Usage:
 * - All index operations are performed directly on the client object.
 * - Pass { indexName: 'legal_documents' } as the third argument to saveObject/saveObjects.
 * - Use batch search format for search: client.search([{ indexName, query }])
 */

// Load environment variables
const algoliaModule = require('algoliasearch');
console.log('algoliaModule keys:', Object.keys(algoliaModule));
console.log('typeof searchClient:', typeof algoliaModule.searchClient);
console.log('typeof algoliaModule.algoliasearch:', typeof algoliaModule.algoliasearch);

require('dotenv/config');
const { Client } = require('@notionhq/client');

console.log('ALGOLIA_APP_ID:', process.env.ALGOLIA_APP_ID);
console.log('ALGOLIA_ADMIN_API_KEY:', process.env.ALGOLIA_ADMIN_API_KEY);

const algoliasearch = algoliaModule.algoliasearch;
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
console.log('client keys:', Object.keys(client));
for (const key of Object.keys(client)) {
  console.log(key, typeof client[key]);
}

if (typeof client.listIndices === 'function') {
  client.listIndices()
    .then(res => {
      console.log('Indices:', res);
    })
    .catch(err => {
      console.error('Error listing indices:', err);
    });
} else {
  console.log('listIndices is not a function on the client object.');
}

// Example: Save a test object to Algolia
async function testAlgoliaSave() {
  try {
    const result = await client.saveObject(
      { objectID: 'test1', name: 'Test Object' },
      {}, // options (can be empty)
      { indexName: 'legal_documents' } // params
    );
    console.log('Saved test object:', result);
  } catch (err) {
    console.error('Error saving test object:', err);
  }
}

// Example: Search Algolia (batch format)
async function testAlgoliaSearch() {
  try {
    const result = await client.search([
      { indexName: 'legal_documents', query: 'Test' }
    ]);
    console.log('Search results:', result);
  } catch (err) {
    console.error('Error searching Algolia:', err);
  }
}

// Example: Sync Notion data to Algolia
async function syncNotionToAlgolia() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY_ALGOLIA });
  try {
    console.log('Starting syncNotionToAlgolia...');
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ALGOLIA,
    });
    console.log('Notion query response:', JSON.stringify(response, null, 2));

    const documents = response.results.map((page) => ({
      objectID: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
      topic: page.properties.Topic?.select?.name || 'Uncategorized',
      tags: page.properties.Tags?.multi_select?.map((tag) => tag.name) || [],
      link: page.properties.Link?.url || page.url,
      summary: page.properties.Summary?.rich_text?.[0]?.plain_text || '',
      status: page.properties.Status?.select?.name || '',
      prioridad: page.properties.Prioridad?.select?.name || '',
      lang: page.properties.Lang?.select?.name || '',
      module: page.properties.Module?.multi_select?.map((mod) => mod.name) || [],
      notas: page.properties.Notas?.rich_text?.[0]?.plain_text || '',
    }));
    console.log(`Prepared ${documents.length} documents for Algolia.`);

    const algoliaResult = await client.saveObjects(documents, {}, { indexName: 'legal_documents' });
    console.log('Algolia saveObjects result:', JSON.stringify(algoliaResult, null, 2));
    console.log('Synced Notion data to Algolia successfully.');
  } catch (error) {
    console.error('Error syncing to Algolia:', error);
  }
}

// Run tests and sync
(async () => {
  await testAlgoliaSave();
  await testAlgoliaSearch();
  // await syncNotionToAlgolia(); // Uncomment to sync Notion data
})(); 