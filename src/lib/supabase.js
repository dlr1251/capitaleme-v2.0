import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Supabase client initialization:');
console.log(`   - SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`   - SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}`);

// Check if environment variables are set
let supabase;
if (!supabaseUrl || !supabaseServiceKey) {
    console.log('⚠️  Using mock Supabase client due to missing environment variables');
    // Mock client that returns empty results
    supabase = {
        from: () => ({
            select: () => ({
                eq: () => ({
                    not: () => ({
                        order: () => Promise.resolve({ data: [], error: null })
                    })
                })
            }),
            insert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
            update: () => Promise.resolve({ error: new Error('Supabase not configured') }),
            delete: () => Promise.resolve({ error: new Error('Supabase not configured') })
        })
    };
}
else {
    console.log('✅ Creating real Supabase client');
    supabase = createClient(supabaseUrl, supabaseServiceKey);
}
export { supabase };
// CLKR Articles table schema:
// - id: uuid (primary key)
// - notion_id: text (unique, from Notion page ID)
// - title: text
// - slug: text (unique)
// - description: text
// - content: text (full article content)
// - module: text
// - lang: text (en/es)
// - reading_time: integer
// - last_edited: timestamp
// - created_at: timestamp
// - updated_at: timestamp
// Visas table schema:
// - id: uuid (primary key)
// - notion_id: text (unique, from Notion page ID)
// - title: text
// - slug: text (unique)
// - description: text
// - content: text
// - category: text
// - country: text
// - countries: text[]
// - is_popular: boolean
// - beneficiaries: text
// - work_permit: text
// - processing_time: text
// - requirements: text
// - emoji: text
// - alcance: text
// - duration: text
// - lang: text (en/es)
// - last_edited: timestamp
// - created_at: timestamp
// - updated_at: timestamp 