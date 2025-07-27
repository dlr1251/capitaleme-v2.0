#!/usr/bin/env node

import 'dotenv/config';
import { supabase } from '../src/lib/supabase.js';

async function setupVisasTable() {
  console.log('🔧 Setting up visas table in Supabase...');
  
  try {
    // First, let's check if the table already exists
    const { data: existingTable, error: checkError } = await supabase
      .from('visas')
      .select('count')
      .limit(1);
    
    if (!checkError) {
      console.log('✅ Visas table already exists');
      return;
    }
    
    console.log('📋 Creating visas table...');
    
    // Create the table using SQL
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS visas (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          notion_id TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          content TEXT,
          category TEXT DEFAULT 'visa',
          country TEXT,
          countries TEXT[],
          is_popular BOOLEAN DEFAULT false,
          beneficiaries TEXT,
          work_permit TEXT,
          processing_time TEXT,
          requirements TEXT,
          emoji TEXT DEFAULT '📋',
          alcance TEXT,
          duration TEXT,
          lang TEXT NOT NULL CHECK (lang IN ('en', 'es')),
          last_edited TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_visas_lang ON visas(lang);
        CREATE INDEX IF NOT EXISTS idx_visas_slug ON visas(slug);
        CREATE INDEX IF NOT EXISTS idx_visas_category ON visas(category);
        CREATE INDEX IF NOT EXISTS idx_visas_country ON visas(country);
        CREATE INDEX IF NOT EXISTS idx_visas_notion_id ON visas(notion_id);
        CREATE INDEX IF NOT EXISTS idx_visas_popular ON visas(is_popular);
        
        -- Enable Row Level Security (optional)
        ALTER TABLE visas ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for public read access
        CREATE POLICY IF NOT EXISTS "Allow public read access" ON visas
          FOR SELECT USING (true);
      `
    });
    
    if (createError) {
      console.log('❌ Error creating table via RPC:', createError.message);
      console.log('💡 You may need to create the table manually in the Supabase dashboard.');
      console.log('   See VISAS_SUPABASE_SETUP.md for the SQL commands.');
      return;
    }
    
    console.log('✅ Visas table created successfully!');
    
    // Test the table
    const { data: testData, error: testError } = await supabase
      .from('visas')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Error testing table:', testError.message);
    } else {
      console.log('✅ Table test successful');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n💡 Manual setup required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the SQL from VISAS_SUPABASE_SETUP.md');
  }
}

setupVisasTable().catch(console.error); 