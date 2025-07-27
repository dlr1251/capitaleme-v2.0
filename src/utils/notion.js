import { Client } from '@notionhq/client';
import { transformPage, fetchPageWithBlocks, fetchDatabaseWithTransformation } from './notionTransform.js';
const notion = new Client({
    auth: import.meta.env.NOTION_API_KEY,
});
const TIMEOUT_MS = 90000;
const MAX_RETRIES = 4;
let lastApiCall = 0;
const RATE_LIMIT_DELAY = 3000;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function rateLimitedApiCall(apiCall) {
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCall;
    if (timeSinceLastCall < RATE_LIMIT_DELAY) {
        await delay(RATE_LIMIT_DELAY - timeSinceLastCall);
    }
    lastApiCall = Date.now();
    return apiCall();
}
export async function getNotionDatabase(databaseId = import.meta.env.NOTION_DATABASE_ID, retryCount = 0) {
    try {
        if (!databaseId) {
            throw new Error('Database ID is required');
        }
        return await rateLimitedApiCall(async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
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
            return data.results.map(transformPage);
        });
    }
    catch (error) {
        if (error.name === 'AbortError') {
            if (retryCount < MAX_RETRIES) {
                await delay(3000 * (retryCount + 1));
                return getNotionDatabase(databaseId, retryCount + 1);
            }
            return [];
        }
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
                        return response.results.map(transformPage);
                    });
                }
                catch (retryError) {
                    if (retryError.name === 'AbortError') {
                        return [];
                    }
                    throw retryError;
                }
            }
        }
        if (retryCount < MAX_RETRIES && (error.status === 429 || error.status >= 500)) {
            await delay(3000 * (retryCount + 1));
            return getNotionDatabase(databaseId, retryCount + 1);
        }
        throw error;
    }
}
export async function getNotionPage(pageId, retryCount = 0) {
    try {
        if (!pageId) {
            throw new Error('Page ID is required');
        }
        return await rateLimitedApiCall(async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
            const response = await notion.pages.retrieve({
                page_id: pageId,
            });
            clearTimeout(timeoutId);
            return transformPage(response);
        });
    }
    catch (error) {
        if (error.name === 'AbortError') {
            if (retryCount < MAX_RETRIES) {
                await delay(3000 * (retryCount + 1));
                return getNotionPage(pageId, retryCount + 1);
            }
            return null;
        }
        if (retryCount < MAX_RETRIES && (error.status === 429 || error.status >= 500)) {
            await delay(3000 * (retryCount + 1));
            return getNotionPage(pageId, retryCount + 1);
        }
        throw error;
    }
}
export async function getNotionPageWithBlocks(pageId, retryCount = 0) {
    try {
        if (!pageId) {
            throw new Error('Page ID is required');
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const result = await fetchPageWithBlocks(pageId);
        clearTimeout(timeoutId);
        return result;
    }
    catch (error) {
        if (error.name === 'AbortError') {
            if (retryCount < MAX_RETRIES) {
                await delay(3000 * (retryCount + 1));
                return getNotionPageWithBlocks(pageId, retryCount + 1);
            }
            return null;
        }
        if (retryCount < MAX_RETRIES && (error.status === 429 || error.status >= 500)) {
            await delay(3000 * (retryCount + 1));
            return getNotionPageWithBlocks(pageId, retryCount + 1);
        }
        throw error;
    }
}
export async function getNotionDatabaseWithTransformation(databaseId = import.meta.env.NOTION_DATABASE_ID, retryCount = 0) {
    try {
        if (!databaseId) {
            throw new Error('Database ID is required');
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const result = await fetchDatabaseWithTransformation(databaseId);
        clearTimeout(timeoutId);
        return result;
    }
    catch (error) {
        if (error.name === 'AbortError') {
            if (retryCount < MAX_RETRIES) {
                await delay(3000 * (retryCount + 1));
                return getNotionDatabaseWithTransformation(databaseId, retryCount + 1);
            }
            return [];
        }
        if (retryCount < MAX_RETRIES && (error.status === 429 || error.status >= 500)) {
            await delay(3000 * (retryCount + 1));
            return getNotionDatabaseWithTransformation(databaseId, retryCount + 1);
        }
        throw error;
    }
} 