import { Client } from '@notionhq/client';
import type { NotionPage, NotionBlock } from './notionTypes.js';
import { 
  transformPage, 
  transformBlock, 
  fetchBlockChildren, 
  fetchPageWithBlocks,
  fetchDatabaseWithTransformation 
} from './notionTransform.js';

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

// Timeout configuration (90 seconds for large databases)
const TIMEOUT_MS = 90000;
const MAX_RETRIES = 4;

// Rate limiting configuration
let lastApiCall = 0;
const RATE_LIMIT_DELAY = 3000; // 3 seconds between calls to be even more conservative

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiting utility
async function rateLimitedApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  if (timeSinceLastCall < RATE_LIMIT_DELAY) {
    await delay(RATE_LIMIT_DELAY - timeSinceLastCall);
  }
  
  lastApiCall = Date.now();
  return apiCall();
}

export async function getNotionDatabase(databaseId: string = import.meta.env.NOTION_DATABASE_ID, retryCount = 0): Promise<NotionPage[]> {
  try {
    if (!databaseId) {
      throw new Error('Database ID is required');
    }
    
    return await rateLimitedApiCall(async () => {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      
      // Use fetch directly to avoid the client's ID formatting
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sorts: [
            {
              timestamp: 'last_edited_time',
              direction: 'descending',
            },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch database');
      }

      const data = await response.json();
      // Transform the results using our new utility
      return data.results.map(transformPage);
    });
  } catch (error: any) {
    // Handle timeout error
    if (error.name === 'AbortError') {
      console.warn(`Notion API timeout for database ${databaseId}, retry ${retryCount + 1}/${MAX_RETRIES}`);
      
      // Retry on timeout if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        await delay(3000 * (retryCount + 1)); // Exponential backoff with longer delays
        return getNotionDatabase(databaseId, retryCount + 1);
      }
      
      console.error(`Notion API timeout after ${MAX_RETRIES} retries for database ${databaseId}`);
      return []; // Return empty array after max retries
    }
    
    // If the error contains a hyphenated ID, try again with the clean ID
    if (error?.message && typeof error.message === 'string' && error.message.includes('-')) {
      const cleanId = error.message.match(/[a-f0-9]{32}/i)?.[0];
      if (cleanId) {
        try {
          return await rateLimitedApiCall(async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
            
            const response = await notion.databases.query({
              database_id: cleanId,
              sorts: [
                {
                  timestamp: 'last_edited_time',
                  direction: 'descending',
                },
              ],
            });
            
            clearTimeout(timeoutId);
            // Transform the results using our new utility
            return response.results.map(transformPage);
          });
        } catch (retryError: any) {
          if (retryError.name === 'AbortError') {
            
            return [];
          }
          throw retryError;
        }
      }
    }
    
    // Retry on other errors if we haven't exceeded max retries
    if (retryCount < MAX_RETRIES && (error.status === 429 || error.status >= 500)) {
      await delay(3000 * (retryCount + 1)); // Exponential backoff
      return getNotionDatabase(databaseId, retryCount + 1);
    }
    
    throw error;
  }
}

export async function getNotionPage(pageId: string, retryCount = 0): Promise<NotionPage | null> {
  try {
    if (!pageId) {
      throw new Error('Page ID is required');
    }
    
    return await rateLimitedApiCall(async () => {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      
      const response = await notion.pages.retrieve({
        page_id: pageId,
      });
      
      clearTimeout(timeoutId);
      // Transform the response using our new utility
      return transformPage(response);
    });
  } catch (error: any) {
    // Handle timeout error
    if (error.name === 'AbortError') {
      console.warn(`Notion API timeout for page ${pageId}, retry ${retryCount + 1}/${MAX_RETRIES}`);
      
      // Retry on timeout if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        await delay(3000 * (retryCount + 1)); // Exponential backoff
        return getNotionPage(pageId, retryCount + 1);
      }
      
      console.error(`Notion API timeout after ${MAX_RETRIES} retries for page ${pageId}`);
      return null; // Return null after max retries
    }
    
    // Retry on other errors if we haven't exceeded max retries
    if (retryCount < MAX_RETRIES && (error.status === 429 || error.status >= 500)) {
      await delay(3000 * (retryCount + 1)); // Exponential backoff
      return getNotionPage(pageId, retryCount + 1);
    }
    
    throw error;
  }
}

// New function to get page with blocks using our transformation utilities
export async function getNotionPageWithBlocks(pageId: string, retryCount = 0): Promise<{
  page: NotionPage;
  blocks: NotionBlock[];
} | null> {
  try {
    if (!pageId) {
      throw new Error('Page ID is required');
    }
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    const result = await fetchPageWithBlocks(pageId);
    
    clearTimeout(timeoutId);
    return result;
  } catch (error: any) {
    // Handle timeout error
    if (error.name === 'AbortError') {
      console.warn(`Notion API timeout for page with blocks ${pageId}, retry ${retryCount + 1}/${MAX_RETRIES}`);
      
      // Retry on timeout if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        await delay(3000 * (retryCount + 1)); // Exponential backoff
        return getNotionPageWithBlocks(pageId, retryCount + 1);
      }
      
      console.error(`Notion API timeout after ${MAX_RETRIES} retries for page with blocks ${pageId}`);
      return null; // Return null after max retries
    }
    
    // Retry on other errors if we haven't exceeded max retries
    if (retryCount < MAX_RETRIES && (error.status === 429 || error.status >= 500)) {
      await delay(3000 * (retryCount + 1)); // Exponential backoff
      return getNotionPageWithBlocks(pageId, retryCount + 1);
    }
    
    throw error;
  }
}

// New function to get database with transformation using our new utility
export async function getNotionDatabaseWithTransformation(databaseId: string = import.meta.env.NOTION_DATABASE_ID, retryCount = 0): Promise<NotionPage[]> {
  try {
    if (!databaseId) {
      throw new Error('Database ID is required');
    }
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    const result = await fetchDatabaseWithTransformation(databaseId);
    
    clearTimeout(timeoutId);
    return result;
  } catch (error: any) {
    // Handle timeout error
    if (error.name === 'AbortError') {
      console.warn(`Notion API timeout for database with transformation ${databaseId}, retry ${retryCount + 1}/${MAX_RETRIES}`);
      
      // Retry on timeout if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        await delay(3000 * (retryCount + 1)); // Exponential backoff
        return getNotionDatabaseWithTransformation(databaseId, retryCount + 1);
      }
      
      console.error(`Notion API timeout after ${MAX_RETRIES} retries for database with transformation ${databaseId}`);
      return []; // Return empty array after max retries
    }
    
    // Retry on other errors if we haven't exceeded max retries
    if (retryCount < MAX_RETRIES && (error.status === 429 || error.status >= 500)) {
      await delay(3000 * (retryCount + 1)); // Exponential backoff
      return getNotionDatabaseWithTransformation(databaseId, retryCount + 1);
    }
    
    throw error;
  }
} 