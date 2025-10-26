const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xmwnlgnfljufviigrois.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtd25sZ25mbGp1ZnZpaWdyb2lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM4MTY1NCwiZXhwIjoyMDc2OTU3NjU0fQ.B4oscpvlIBd8GDIsr6qhj51fgumHemPZ_6hkMIEx3lo';

const supabase = createClient(supabaseUrl, serviceKey);

async function verifyMigrations() {
  console.log('🔍 Verifying database migrations...\n');

  // Test 1: Check saved_content table exists
  console.log('📋 Test 1: Checking saved_content table...');
  const { data: savedContentData, error: savedContentError } = await supabase
    .from('saved_content')
    .select('*')
    .limit(1);

  if (savedContentError) {
    console.log('❌ saved_content table error:', savedContentError.message);
  } else {
    console.log('✅ saved_content table exists and is accessible!');
    const count = savedContentData ? savedContentData.length : 0;
    console.log(`   Currently has ${count} records\n`);
  }

  // Test 2: Check formatting_preferences table exists
  console.log('📋 Test 2: Checking formatting_preferences table...');
  const { data: formattingData, error: formattingError } = await supabase
    .from('formatting_preferences')
    .select('*')
    .limit(1);

  if (formattingError) {
    console.log('❌ formatting_preferences table error:', formattingError.message);
  } else {
    console.log('✅ formatting_preferences table exists and is accessible!');
    const count = formattingData ? formattingData.length : 0;
    console.log(`   Currently has ${count} records\n`);
  }

  // Summary
  const allGood = !savedContentError && !formattingError;
  
  if (allGood) {
    console.log('✨ SUCCESS! All migrations verified successfully!\n');
    console.log('🎉 You can now:');
    console.log('   1. Navigate to Settings → Saved Content');
    console.log('   2. Add bank details, company info, or other content');
    console.log('   3. Navigate to Settings → Formatting');
    console.log('   4. Customize your proposal formatting preferences');
    console.log('\n📱 Test URLs:');
    console.log('   Production: https://proposifyai-dsfto2uwc-chatgptnotes-6366s-projects.vercel.app/settings');
    console.log('   Local: http://localhost:3000/settings');
  } else {
    console.log('⚠️  Some migrations may not have applied correctly.');
    console.log('   Please check the errors above and try running APPLY_MIGRATIONS.sql again.');
  }
}

verifyMigrations().catch(console.error);
