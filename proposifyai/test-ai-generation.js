/**
 * Direct test of AI content generation endpoint
 * Run this to verify if AI generation is working
 */

const fetch = require('node-fetch');

async function testAIGeneration() {
  console.log('🧪 Testing AI Content Generation Endpoint...\n');

  const testPayload = {
    sectionType: 'executive_summary',
    clientContext: {
      name: 'Test Client',
      company: 'Test Company',
      industry: 'Software Development',
      projectType: 'Test Project',
      budget: 50000,
    },
    tone: 'professional',
  };

  try {
    console.log('📤 Sending request to /api/ai/generate-content...');
    console.log('Payload:', JSON.stringify(testPayload, null, 2));

    const response = await fetch('http://localhost:3000/api/ai/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    console.log(`\n📥 Response Status: ${response.status} ${response.statusText}`);

    const data = await response.json();

    if (response.ok) {
      console.log('\n✅ SUCCESS! AI generated content:');
      console.log('─'.repeat(80));
      console.log(data.data.content.substring(0, 500) + '...');
      console.log('─'.repeat(80));
      console.log(`\n📊 Metadata:`);
      console.log(`   - Content length: ${data.data.content.length} characters`);
      console.log(`   - Model: ${data.data.metadata?.model || 'unknown'}`);
      console.log(`   - Tokens used: ${data.data.metadata?.tokensUsed || 'unknown'}`);
      console.log(`   - Cost: $${data.data.metadata?.cost || 'unknown'}`);
      console.log(`   - Latency: ${data.data.metadata?.latencyMs || 'unknown'}ms`);

      console.log('\n✅ AI generation is working correctly!');
      console.log('The issue must be in the proposal creation/saving flow.');
    } else {
      console.log('\n❌ ERROR! AI generation failed:');
      console.log(JSON.stringify(data, null, 2));

      if (data.error?.includes('Unauthorized')) {
        console.log('\n⚠️  Authentication issue - user not logged in');
      } else if (data.error?.includes('limit')) {
        console.log('\n⚠️  Usage limit reached');
      } else if (data.error?.includes('API key')) {
        console.log('\n⚠️  OpenAI API key issue');
      }
    }
  } catch (error) {
    console.log('\n❌ NETWORK ERROR:');
    console.log(error.message);

    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n⚠️  Server is not running. Start it with: npm run dev');
    }
  }
}

console.log('═'.repeat(80));
console.log('AI CONTENT GENERATION TEST');
console.log('═'.repeat(80));
console.log('\nThis test will verify if the AI generation endpoint is working.\n');

testAIGeneration().catch(console.error);
