import { Client } from '@notionhq/client';
import * as fs from 'fs';
import * as path from 'path';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_VISAS_DATABASE_ID;
const outputPath = path.resolve(__dirname, '../data/visas-raw.json');

export async function fetchAllVisas() {
  if (!databaseId) {
    throw new Error('NOTION_VISA_DATABASE_ID is not set in environment variables');
  }
  let results: any[] = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      page_size: 100,
    });
    results = results.concat(response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor || undefined;
  }
  return results;
}

(async () => {
  try {
    const visas = await fetchAllVisas();
    fs.writeFileSync(outputPath, JSON.stringify(visas, null, 2), 'utf-8');
  } catch (err) {
    
    process.exit(1);
  }
})(); 