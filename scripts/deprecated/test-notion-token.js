import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

async function testNotionToken() {
  console.log('Testing Notion API Token...');
  console.log('==========================');
  
  const token = process.env.NOTION_API_KEY;
  console.log(`Token length: ${token?.length || 0}`);
  console.log(`Token starts with: ${token?.substring(0, 10) || 'undefined'}`);
  
  if (!token) {
    console.error('❌ NOTION_API_KEY is not set');
    return;
  }
  
  try {
    const notion = new Client({ auth: token });
    
    // Test with a simple API call - get user info
    console.log('\nTesting API call...');
    const user = await notion.users.me();
    console.log('✅ Token is valid!');
    console.log(`User: ${user.name} (${user.id})`);
    
    // Test database access
    const blogDbId = process.env.NOTION_BLOG_DATABASE_ID;
    if (blogDbId) {
      console.log('\nTesting database access...');
      const database = await notion.databases.retrieve({ database_id: blogDbId });
      console.log(`✅ Database access successful: ${database.title?.[0]?.plain_text || 'Untitled'}`);
    }
    
  } catch (error) {
    console.error('❌ Token test failed:', error.message);
    if (error.code === 'unauthorized') {
      console.error('The API token is invalid or has insufficient permissions.');
      console.error('Please check:');
      console.error('1. The token is correct');
      console.error('2. The token has the right permissions');
      console.error('3. The token hasn\'t expired');
    }
  }
}

testNotionToken(); 