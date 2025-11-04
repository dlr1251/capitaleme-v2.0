import { supabase } from '../src/lib/supabase.js';
import { syncVisasToSupabase } from '../src/server/lib/syncNotionToSupabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function clearAndSyncVisas() {
  console.log('🔄 Clearing and syncing visas...');
  console.log('==================================');
  
  try {
    // First, clear the visas table
    console.log('\n--- Clearing visas table ---');
    const { error: deleteError } = await supabase
      .from('visas')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (deleteError) {
      console.error('Error clearing visas table:', deleteError);
      return;
    }
    
    console.log('✅ Visas table cleared');
    
    // Now run the sync
    console.log('\n--- Running visa sync ---');
    const result = await syncVisasToSupabase();
    
    console.log('\n✅ Visa sync completed!');
    console.log(`📊 Results:`);
    console.log(`   - Synced: ${result.syncedCount}`);
    console.log(`   - Updated: ${result.updatedCount}`);
    console.log(`   - Errors: ${result.errorCount}`);
    
    if (result.errorCount > 0) {
      console.log('\n⚠️  Some visas had errors during sync. Check the logs above for details.');
    }
    
    // Check what's in the database now
    console.log('\n--- Checking database contents ---');
    const { data: visas, error: fetchError } = await supabase
      .from('visas')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching visas:', fetchError);
    } else {
      console.log(`Found ${visas?.length || 0} visas in database`);
      
      if (visas && visas.length > 0) {
        const enVisas = visas.filter(v => v.lang === 'en');
        const esVisas = visas.filter(v => v.lang === 'es');
        const popularVisas = visas.filter(v => v.is_popular);
        
        console.log(`English visas: ${enVisas.length}`);
        console.log(`Spanish visas: ${esVisas.length}`);
        console.log(`Popular visas: ${popularVisas.length}`);
        
        if (popularVisas.length > 0) {
          console.log('\nPopular visas:');
          popularVisas.forEach(visa => {
            console.log(`- ${visa.title} (${visa.lang})`);
          });
        }
      }
    }
    
  } catch (error) {
    console.error('Error in clear and sync process:', error);
  }
}

clearAndSyncVisas(); 