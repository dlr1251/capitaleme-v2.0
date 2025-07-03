import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_RESOURCES_DATABASE_ID;

async function testNotion() {
  try {
    await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: { equals: true },
      },
    });
  } catch (error) {
    // Error handling without logging
  }
}

testNotion();