import { Client } from '@notionhq/client';

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

export async function getNotionDatabase(databaseId: string = import.meta.env.NOTION_DATABASE_ID) {
  try {
    if (!databaseId) {
      throw new Error('Database ID is required');
    }
    
    // Remove any hyphens from the database ID
    const cleanDatabaseId = databaseId.replace(/-/g, '');
    
    const response = await notion.databases.query({
      database_id: cleanDatabaseId,
      sorts: [
        {
          property: 'Last edited time',
          direction: 'descending',
        },
      ],
      filter: {
        and: [
          {
            property: 'Status',
            status: {
              equals: 'Leida 1 vez'
            }
          },
          {
            property: 'Publication Date',
            date: {
              equals: '2025-06-15'
            }
          }
        ]
      }
    });
    
    return response.results;
  } catch (error) {
    console.error('Error fetching Notion database:', error);
    throw error;
  }
}

export async function getNotionPage(pageId: string) {
  try {
    if (!pageId) {
      throw new Error('Page ID is required');
    }
    
    const response = await notion.pages.retrieve({
      page_id: pageId,
    });
    return response;
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    throw error;
  }
} 