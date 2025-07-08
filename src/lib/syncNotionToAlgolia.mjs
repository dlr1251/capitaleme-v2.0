import 'dotenv/config';
import { Client as NotionClient } from '@notionhq/client';
import pkg from 'algoliasearch';
const algoliasearch = pkg.default || pkg.algoliasearch || pkg;

const NOTION_API_KEY_ALGOLIA = process.env.NOTION_API_KEY_ALGOLIA;
const NOTION_DATABASE_ALGOLIA = process.env.NOTION_DATABASE_ALGOLIA;
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

console.log('NOTION_API_KEY_ALGOLIA:', NOTION_API_KEY_ALGOLIA);
console.log('NOTION_DATABASE_ALGOLIA:', NOTION_DATABASE_ALGOLIA);
console.log('ALGOLIA_APP_ID:', ALGOLIA_APP_ID);
console.log('ALGOLIA_ADMIN_API_KEY:', ALGOLIA_ADMIN_API_KEY);
console.log('ALGOLIA_INDEX_NAME:', ALGOLIA_INDEX_NAME);

if (!NOTION_API_KEY_ALGOLIA || !NOTION_DATABASE_ALGOLIA || !ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY || !ALGOLIA_INDEX_NAME) {
  console.error('Missing one or more required environment variables.');
  process.exit(1);
}

const notion = new NotionClient({ auth: NOTION_API_KEY_ALGOLIA });
const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);

function toDashedId(id) {
  return id.replace(
    /^([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{12})$/,
    '$1-$2-$3-$4-$5'
  );
}

export async function syncNotionToAlgolia() {
  try {
    console.log('Starting Notion to Algolia sync...');
    const response = await notion.databases.query({
      database_id: toDashedId(NOTION_DATABASE_ALGOLIA),
    });
    console.log(`Fetched ${response.results.length} records from Notion.`);

    // Map Notion pages to Algolia documents (no duplicate keys)
    const documents = response.results.map(page => {
      const props = page.properties || {};
      return {
        objectID: page.id,
        name: props.Name?.title?.[0]?.plain_text || '',
        module: props.Module?.multi_select?.map(m => m.name) || [],
        lang: props.Lang?.select?.name || '',
        prioridad: props.Prioridad?.select?.name || '',
        notas: props.Notas?.rich_text?.map(n => n.plain_text).join(' ') || '',
        status: props.Status?.status?.name || '',
        description: props.Description?.rich_text?.map(n => n.plain_text).join(' ') || '',
        intro: props.intro?.rich_text?.map(n => n.plain_text).join(' ') || '',
        slug: props.slug?.rich_text?.[0]?.plain_text || '',
        chatURL: props["chat URL"]?.url || '',
        publicationDate: props["Publication Date"]?.date?.start || '',
        targetAudience: props["Target Audience"]?.multi_select?.map(a => a.name) || [],
      };
    });

    console.log('Total documents prepared:', documents.length);
    // Debug: Check for undefined fields in documents
    const docsWithUndefined = documents.filter(doc => {
      return Object.values(doc).some(value => typeof value === 'undefined');
    });
    if (docsWithUndefined.length > 0) {
      console.warn('Documents with undefined fields:', JSON.stringify(docsWithUndefined, null, 2));
    } else {
      console.log('No documents with undefined fields.');
    }
    // Clean undefined fields
    const cleanedDocuments = documents.map(doc => {
      const cleaned = { ...doc };
      for (const key in cleaned) {
        if (typeof cleaned[key] === 'undefined') {
          cleaned[key] = '';
        }
      }
      return cleaned;
    });
    console.log('First cleaned document:', JSON.stringify(cleanedDocuments[0], null, 2));

    // Use correct Algolia v5 API: pass indexName to saveObjects
    const index = algoliaClient.initIndex(ALGOLIA_INDEX_NAME);
    await index.saveObjects(cleanedDocuments, { autoGenerateObjectIDIfNotExist: true });
    console.log('Sync complete!');
  } catch (error) {
    console.error('Error syncing Notion to Algolia:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncNotionToAlgolia();
} 