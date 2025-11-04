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
    console.error('❌ CRITICAL: Supabase environment variables are missing!');
    console.error('   Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
    console.error('   Without these, the dashboard will not be able to access the database.');
    
    // Mock client that returns errors instead of empty results
    supabase = {
        auth: {
            getUser: () => Promise.resolve({ 
                data: { user: null }, 
                error: { message: 'Supabase not configured - missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' } 
            }),
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ 
                        data: null, 
                        error: { message: 'Supabase not configured' } 
                    }),
                    or: () => ({
                        order: () => Promise.resolve({ 
                            data: null, 
                            error: { message: 'Supabase not configured - please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env' } 
                        })
                    }),
                    order: () => Promise.resolve({ 
                        data: null, 
                        error: { message: 'Supabase not configured - please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env' } 
                    })
                }),
                order: () => Promise.resolve({ 
                    data: null, 
                    error: { message: 'Supabase not configured - please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env' } 
                })
            }),
            insert: () => Promise.resolve({ 
                data: null, 
                error: { message: 'Supabase not configured' } 
            }),
            update: () => Promise.resolve({ 
                data: null, 
                error: { message: 'Supabase not configured' } 
            }),
            delete: () => Promise.resolve({ 
                data: null, 
                error: { message: 'Supabase not configured' } 
            })
        })
    };
} else {
    console.log('✅ Creating real Supabase client');
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });
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