import 'dotenv/config';
import { Client as NotionClient } from '@notionhq/client';
// @ts-ignore
import algoliasearch from 'algoliasearch';

const NOTION_API_KEY = process.env.NOTION_API_KEY as string;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID as string;
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID as string;
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY as string;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME as string;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID || !ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY || !ALGOLIA_INDEX_NAME) {
  console.error('Missing one or more required environment variables.');
  process.exit(1);
}

const notion = new NotionClient({ auth: NOTION_API_KEY });
const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
const index = algoliaClient.initIndex(ALGOLIA_INDEX_NAME);

export async function syncNotionToAlgolia() {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
    });

    const documents = response.results.map((page: any) => {
      return {
        objectID: page.id,
        name: page.properties["Name"]?.title?.[0]?.plain_text || '',
        module: page.properties["Module"]?.multi_select?.map((m: any) => m.name) || [],
        lang: page.properties["Lang"]?.select?.name || '',
        prioridad: page.properties["Prioridad"]?.select?.name || '',
        notas: page.properties["Notas"]?.rich_text?.map((n: any) => n.plain_text).join(' ') || '',
        status: page.properties["Status"]?.status?.name || '',
        description: page.properties["Description"]?.rich_text?.map((n: any) => n.plain_text).join(' ') || '',
        intro: page.properties["intro"]?.rich_text?.map((n: any) => n.plain_text).join(' ') || '',
        slug: page.properties["slug"]?.rich_text?.[0]?.plain_text || '',
        chatURL: page.properties["chat URL"]?.url || '',
        publicationDate: page.properties["Publication Date"]?.date?.start || '',
        targetAudience: page.properties["Target Audience"]?.multi_select?.map((a: any) => a.name) || [],
      };
    });
    // Debug: Check for undefined fields in documents
    const docsWithUndefined = documents.filter((doc: any) => {
      return Object.values(doc).some(value => typeof value === 'undefined');
    });
    if (docsWithUndefined.length > 0) {
      console.warn('Documents with undefined fields:', JSON.stringify(docsWithUndefined, null, 2));
    } else {
      console.log('No documents with undefined fields.');
    }
    // Optionally, filter out or fix undefined fields before sending to Algolia
    const cleanedDocuments = documents.map((doc: any) => {
      const cleaned = { ...doc };
      for (const key in cleaned) {
        if (typeof cleaned[key] === 'undefined') {
          cleaned[key] = '';
        }
      }
      return cleaned;
    });

    const algoliaResult = await index.saveObjects(cleanedDocuments);
    console.log('Algolia saveObjects result:', JSON.stringify(algoliaResult, null, 2));
    console.log('Sync complete!');
  } catch (error) {
    console.error('Error syncing Notion to Algolia:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncNotionToAlgolia();
}