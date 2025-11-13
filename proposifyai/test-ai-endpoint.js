/**
 * Test AI Generation Endpoint
 * Run with: node test-ai-endpoint.js
 */

const testAIEndpoint = async () => {
  try {
    console.log('Testing AI generation endpoint...\n');

    // Test data
    const testData = {
      sectionType: 'executive_summary',
      clientContext: {
        name: 'Test Hospital',
        company: 'Test Hospital',
        industry: 'Healthcare',
        projectType: 'Hospital Management System',
        budget: 50000,
        additionalInfo: 'Modern patient management system with AI capabilities'
      },
      tone: 'professional',
      language: 'en'
    };

    console.log('Test payload:', JSON.stringify(testData, null, 2));
    console.log('\nSending request to http://localhost:3000/api/ai/generate-content...\n');

    const response = await fetch('http://localhost:3000/api/ai/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'sb-xmwnlgnfljufviigrois-auth-token=test' // Mock auth for testing
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();

    if (response.ok) {
      console.log('\n✅ SUCCESS!\n');
      console.log('Generated content:', data.data.content.substring(0, 500) + '...');
      console.log('\nMetadata:', data.data.metadata);
      console.log('Usage:', data.data.usage);
    } else {
      console.log('\n❌ ERROR!\n');
      console.log('Error details:', JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('\n❌ EXCEPTION!\n');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
};

testAIEndpoint();
