/**
 * Database Inspection Script for Proposals
 *
 * This script checks the proposals table to:
 * 1. View proposal content structure
 * 2. Check if AI-generated content is being saved
 * 3. Diagnose visibility issues
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
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectProposals() {
  console.log('🔍 Inspecting Proposals Database\n');
  console.log('='.repeat(80));
  console.log('\n');

  try {
    // Fetch all proposals
    const { data: proposals, error } = await supabase
      .from('proposals')
      .select('id, title, client_name, content, metadata, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching proposals:', error);
      return;
    }

    if (!proposals || proposals.length === 0) {
      console.log('⚠️  No proposals found in the database');
      return;
    }

    console.log(`✅ Found ${proposals.length} proposals\n`);

    proposals.forEach((proposal, index) => {
      console.log(`\n${'─'.repeat(80)}`);
      console.log(`📄 Proposal ${index + 1}: ${proposal.title}`);
      console.log(`${'─'.repeat(80)}`);
      console.log(`ID: ${proposal.id}`);
      console.log(`Client: ${proposal.client_name}`);
      console.log(`Created: ${new Date(proposal.created_at).toLocaleString()}`);
      console.log(`Updated: ${new Date(proposal.updated_at).toLocaleString()}`);

      console.log('\n📦 CONTENT STRUCTURE:');
      if (proposal.content && typeof proposal.content === 'object') {
        const contentKeys = Object.keys(proposal.content);
        console.log(`  Keys found: ${contentKeys.length > 0 ? contentKeys.join(', ') : 'NONE'}`);

        if (contentKeys.length > 0) {
          contentKeys.forEach(key => {
            const value = proposal.content[key];
            const preview = typeof value === 'string'
              ? value.substring(0, 100) + (value.length > 100 ? '...' : '')
              : JSON.stringify(value).substring(0, 100);
            console.log(`  • ${key}: ${preview}`);
          });
        } else {
          console.log('  ⚠️  CONTENT OBJECT IS EMPTY!');
        }
      } else {
        console.log('  ⚠️  CONTENT IS NULL OR NOT AN OBJECT');
        console.log(`  Type: ${typeof proposal.content}`);
        console.log(`  Value: ${JSON.stringify(proposal.content)}`);
      }

      console.log('\n📋 METADATA:');
      if (proposal.metadata && typeof proposal.metadata === 'object') {
        console.log(`  ${JSON.stringify(proposal.metadata, null, 2)}`);
      } else {
        console.log('  No metadata or invalid format');
      }
    });

    console.log(`\n${'='.repeat(80)}\n`);
    console.log('📊 SUMMARY:\n');

    const proposalsWithContent = proposals.filter(p =>
      p.content && typeof p.content === 'object' && Object.keys(p.content).length > 0
    );

    const proposalsWithAIContent = proposals.filter(p =>
      p.content && typeof p.content === 'object' && (
        p.content.executive_summary ||
        p.content.scope_of_work ||
        p.content.pricing_breakdown ||
        p.content.timeline ||
        p.content.terms
      )
    );

    console.log(`Total proposals: ${proposals.length}`);
    console.log(`Proposals with content: ${proposalsWithContent.length}`);
    console.log(`Proposals with AI-generated sections: ${proposalsWithAIContent.length}`);
    console.log(`Proposals with EMPTY content: ${proposals.length - proposalsWithContent.length}`);

    if (proposalsWithAIContent.length > 0) {
      console.log('\n✅ AI-generated content IS being saved to database');
    } else {
      console.log('\n⚠️  No AI-generated content found in any proposal');
      console.log('   Possible issues:');
      console.log('   1. PATCH endpoint not being called after generation');
      console.log('   2. Content not being saved in the correct format');
      console.log('   3. Frontend not calling the save endpoint');
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the inspection
inspectProposals()
  .then(() => {
    console.log('\n✅ Inspection complete\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Inspection failed:', error);
    process.exit(1);
  });
