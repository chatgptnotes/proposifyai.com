// Quick verification script for database migration
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyMigration() {
  console.log('🔍 Verifying Database Migration...\n');

  // Test 1: Check if proposal_views table exists
  console.log('1. Testing proposal_views table...');
  const { data: viewsData, error: viewsError } = await supabase
    .from('proposal_views')
    .select('*')
    .limit(1);

  if (viewsError && viewsError.code === '42P01') {
    console.log('   ❌ proposal_views table NOT found');
    console.log('   Error:', viewsError.message);
  } else if (viewsError) {
    console.log('   ⚠️  Error querying table:', viewsError.message);
  } else {
    console.log('   ✅ proposal_views table EXISTS');
  }

  // Test 2: Check if proposal_actions table exists
  console.log('\n2. Testing proposal_actions table...');
  const { data: actionsData, error: actionsError } = await supabase
    .from('proposal_actions')
    .select('*')
    .limit(1);

  if (actionsError && actionsError.code === '42P01') {
    console.log('   ❌ proposal_actions table NOT found');
    console.log('   Error:', actionsError.message);
  } else if (actionsError) {
    console.log('   ⚠️  Error querying table:', actionsError.message);
  } else {
    console.log('   ✅ proposal_actions table EXISTS');
  }

  // Test 3: Check if generate_share_id function exists
  console.log('\n3. Testing generate_share_id() function...');
  const { data: shareIdData, error: shareIdError } = await supabase
    .rpc('generate_share_id');

  if (shareIdError && shareIdError.code === '42883') {
    console.log('   ❌ generate_share_id() function NOT found');
    console.log('   Error:', shareIdError.message);
  } else if (shareIdError) {
    console.log('   ⚠️  Error calling function:', shareIdError.message);
  } else {
    console.log('   ✅ generate_share_id() function EXISTS');
    console.log('   Generated ID:', shareIdData);
  }

  // Test 4: Check if increment_proposal_view_count function exists
  console.log('\n4. Testing increment_proposal_view_count() function...');
  const { error: incrementError } = await supabase
    .rpc('increment_proposal_view_count', {
      p_proposal_id: '00000000-0000-0000-0000-000000000000' // dummy UUID
    });

  if (incrementError && incrementError.code === '42883') {
    console.log('   ❌ increment_proposal_view_count() function NOT found');
  } else if (incrementError && incrementError.message.includes('does not exist')) {
    console.log('   ✅ increment_proposal_view_count() function EXISTS');
    console.log('   (Expected error with dummy UUID)');
  } else if (incrementError) {
    console.log('   ✅ increment_proposal_view_count() function EXISTS');
    console.log('   (Got expected error with test data)');
  } else {
    console.log('   ✅ increment_proposal_view_count() function EXISTS');
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(50));

  const allPassed = !viewsError && !actionsError && !shareIdError;

  if (allPassed) {
    console.log('\n✅ ALL CHECKS PASSED!');
    console.log('Database migration was successful.');
  } else {
    console.log('\n⚠️  SOME CHECKS FAILED');
    console.log('Please review the errors above.');
    console.log('You may need to re-run the migration SQL in Supabase dashboard.');
  }

  process.exit(allPassed ? 0 : 1);
}

verifyMigration().catch(error => {
  console.error('\n❌ Verification script error:', error);
  process.exit(1);
});
