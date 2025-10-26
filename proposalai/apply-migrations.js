const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://xmwnlgnfljufviigrois.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtd25sZ25mbGp1ZnZpaWdyb2lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM4MTY1NCwiZXhwIjoyMDc2OTU3NjU0fQ.B4oscpvlIBd8GDIsr6qhj51fgumHemPZ_6hkMIEx3lo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigrations() {
  console.log('Applying migrations...\n');

  const migrations = [
    'supabase/migrations/20251026000004_saved_content.sql',
    'supabase/migrations/20251026000005_formatting_preferences.sql'
  ];

  for (const migrationFile of migrations) {
    const migrationPath = path.join(__dirname, migrationFile);
    console.log(`📄 Reading ${migrationFile}...`);
    
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log(`🔄 Executing migration...`);
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        console.error(`❌ Error executing ${migrationFile}:`, error);
        // Try direct approach
        console.log('🔄 Trying direct SQL execution...');
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ query: sql })
        });
        
        if (!response.ok) {
          console.error(`❌ Failed: ${response.statusText}`);
          console.log('⚠️  You may need to apply this migration manually in Supabase dashboard');
        } else {
          console.log(`✅ Migration applied successfully!`);
        }
      } else {
        console.log(`✅ Migration applied successfully!`);
      }
    } catch (err) {
      console.error(`❌ Exception: ${err.message}`);
      console.log(`⚠️  Manual migration required for ${migrationFile}`);
      console.log('📋 SQL to execute:');
      console.log('='.repeat(80));
      console.log(sql);
      console.log('='.repeat(80));
    }
    
    console.log('');
  }

  console.log('✨ Migration process complete!');
  console.log('\n📝 If migrations failed, please:');
  console.log('1. Go to https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/editor');
  console.log('2. Copy the SQL from the migration files');
  console.log('3. Execute them in the SQL Editor');
}

applyMigrations().catch(console.error);
