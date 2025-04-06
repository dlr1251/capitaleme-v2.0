import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_RESOURCES_DATABASE_ID;

async function testNotion() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: { equals: true },
      },
    });
    console.log('Notion API response:', JSON.stringify(response.results, null, 2));
  } catch (error) {
    console.error('Notion API error:', error);
  }
}

testNotion();