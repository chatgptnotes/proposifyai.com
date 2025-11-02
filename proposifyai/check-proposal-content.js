const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProposal(id) {
  console.log(`Checking proposal: ${id}\n`);

  const { data, error } = await supabase
    .from('proposals')
    .select('id, title, content')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Title:', data.title);
  console.log('\nContent object keys:', Object.keys(data.content || {}));
  console.log('\nContent sections:');

  const sections = ['executive_summary', 'scope_of_work', 'pricing_breakdown', 'timeline', 'terms'];
  sections.forEach(section => {
    const content = data.content?.[section];
    if (content) {
      console.log(`  ✅ ${section}: ${content.length} characters`);
    } else {
      console.log(`  ❌ ${section}: MISSING`);
    }
  });

  console.log('\nFull content object:');
  console.log(JSON.stringify(data.content, null, 2));
}

// Check the proposal that was just created
checkProposal('c05184c0-d5c3-4db1-a7a6-746f8f895a66');
