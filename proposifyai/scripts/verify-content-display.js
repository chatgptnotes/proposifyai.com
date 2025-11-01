/**
 * Content Display Verification Script
 *
 * This script verifies:
 * 1. Which proposals have AI content in database
 * 2. How the content is structured
 * 3. Whether the frontend should be displaying it
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && value) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyContentDisplay() {
  console.log('🔍 Verifying Content Display System\n');
  console.log('='.repeat(80));

  try {
    const { data: proposals, error } = await supabase
      .from('proposals')
      .select('id, title, client_name, content, metadata, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    if (!proposals || proposals.length === 0) {
      console.log('\n⚠️  No proposals found');
      return;
    }

    console.log(`\n✅ Found ${proposals.length} recent proposals\n`);

    const expectedSections = [
      'executive_summary',
      'scope_of_work',
      'pricing_breakdown',
      'timeline',
      'terms'
    ];

    proposals.forEach((proposal, idx) => {
      console.log(`\n${'─'.repeat(80)}`);
      console.log(`📄 ${idx + 1}. ${proposal.title} (${proposal.client_name})`);
      console.log(`${'─'.repeat(80)}`);
      console.log(`ID: ${proposal.id}`);
      console.log(`Created: ${new Date(proposal.created_at).toLocaleString()}`);
      console.log(`AI Generated: ${proposal.metadata?.aiGenerated ? 'YES' : 'NO'}`);

      const content = proposal.content || {};
      const contentKeys = Object.keys(content);

      console.log('\n📊 CONTENT STATUS:');

      if (contentKeys.length === 0) {
        console.log('  ❌ NO CONTENT - Proposal will appear BLANK!');
        console.log('\n  🔧 DIAGNOSIS:');
        console.log('     - Content object is empty');
        console.log('     - PATCH endpoint may not have been called');
        console.log('     - OR AI generation failed silently');
      } else {
        console.log(`  ✅ Content found: ${contentKeys.length} sections`);

        expectedSections.forEach(section => {
          const hasSection = content[section];
          const status = hasSection ? '✓' : '✗';
          const icon = hasSection ? '✅' : '⚠️';

          console.log(`\n  ${icon} ${section}:`);
          if (hasSection) {
            const preview = typeof content[section] === 'string'
              ? content[section].substring(0, 80).replace(/\n/g, ' ')
              : JSON.stringify(content[section]).substring(0, 80);
            console.log(`     Preview: ${preview}...`);
            console.log(`     Length: ${content[section].length} chars`);
            console.log(`     Status: WILL BE DISPLAYED in frontend ✓`);
          } else {
            console.log(`     Status: NOT FOUND - Section will NOT appear`);
          }
        });

        // Check for custom HTML
        if (content.custom_html) {
          console.log('\n  ✅ custom_html:');
          console.log(`     Length: ${content.custom_html.length} chars`);
          console.log('     Status: Contains user edits');
        }
      }

      console.log('\n🎯 FRONTEND RENDERING:');
      if (contentKeys.length === 0) {
        console.log('  The generateProposalHTML() function will:');
        console.log('  - Skip all content sections (none found)');
        console.log('  - Only show header/footer and client info');
        console.log('  - Result: MOSTLY BLANK PROPOSAL');
      } else {
        console.log('  The generateProposalHTML() function will:');
        const sectionsToRender = expectedSections.filter(s => content[s]);
        console.log(`  - Render ${sectionsToRender.length} sections:`);
        sectionsToRender.forEach(s => {
          const titles = {
            executive_summary: 'PROJECT OVERVIEW',
            scope_of_work: 'SCOPE OF WORK',
            pricing_breakdown: 'INVESTMENT BREAKDOWN',
            timeline: 'DEVELOPMENT TIMELINE',
            terms: 'TERMS & CONDITIONS'
          };
          console.log(`    • ${titles[s]}`);
        });
        console.log('  - Result: ✅ CONTENT WILL BE VISIBLE');
      }
    });

    console.log(`\n${'='.repeat(80)}`);
    console.log('\n📋 SUMMARY:\n');

    const withContent = proposals.filter(p => p.content && Object.keys(p.content).length > 0);
    const withoutContent = proposals.filter(p => !p.content || Object.keys(p.content).length === 0);
    const aiGenerated = proposals.filter(p => p.metadata?.aiGenerated);

    console.log(`Total proposals checked: ${proposals.length}`);
    console.log(`With content (visible): ${withContent.length}`);
    console.log(`Without content (blank): ${withoutContent.length}`);
    console.log(`Marked as AI-generated: ${aiGenerated.length}`);

    if (withoutContent.length > 0) {
      console.log('\n⚠️  ISSUES FOUND:');
      console.log(`\n${withoutContent.length} proposal(s) have NO CONTENT and will appear blank:`);
      withoutContent.forEach(p => {
        console.log(`  • "${p.title}" (ID: ${p.id.substring(0, 8)}...)`);
        console.log(`    AI Generated: ${p.metadata?.aiGenerated ? 'YES' : 'NO'}`);
        if (p.metadata?.aiGenerated) {
          console.log(`    ⚠️  Content was supposed to be generated but is missing!`);
        }
      });

      console.log('\n🔧 RECOMMENDED ACTIONS:');
      console.log('  1. Check browser console for PATCH request failures');
      console.log('  2. Verify AI generation API is returning content');
      console.log('  3. Check if PATCH endpoint is being called after generation');
      console.log('  4. Review /app/proposals/new/page.tsx lines 134-156');
    }

    if (withContent.length > 0) {
      console.log('\n✅ WORKING CORRECTLY:');
      console.log(`\n${withContent.length} proposal(s) have content and should display properly:`);
      withContent.forEach(p => {
        const sections = Object.keys(p.content || {}).filter(k =>
          ['executive_summary', 'scope_of_work', 'pricing_breakdown', 'timeline', 'terms'].includes(k)
        );
        console.log(`  • "${p.title}" - ${sections.length} sections`);
      });
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyContentDisplay()
  .then(() => {
    console.log('\n✅ Verification complete\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  });
