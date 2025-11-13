/**
 * Test script to debug the "terms" section generation failure
 * Run with: node test-terms-generation.js
 */

const OpenAI = require('openai');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const clientContext = {
  name: "Hope Hospital",
  company: "Hope Hospital",
  industry: "Healthcare",
  projectType: "Hospital Management System",
  budget: 50000,
  timeline: "3 months",
  additionalInfo: "Need modern patient management system"
};

async function testTermsGeneration() {
  console.log('\n========================================');
  console.log('Testing OpenAI API - Terms Section');
  console.log('========================================\n');

  console.log('1. Checking OpenAI API Key...');
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment!');
    process.exit(1);
  }
  console.log(`✓ API Key found: ${process.env.OPENAI_API_KEY.substring(0, 20)}...`);

  console.log('\n2. Testing simple OpenAI request...');
  try {
    const simpleTest = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Say "API is working" if you can read this.' }
      ],
      max_tokens: 50,
    });
    console.log('✓ Simple test passed:', simpleTest.choices[0].message.content);
  } catch (error) {
    console.error('❌ Simple test failed:', error.message);
    console.error('Error details:', {
      status: error?.status,
      type: error?.type,
      code: error?.code
    });
    process.exit(1);
  }

  console.log('\n3. Testing TERMS section generation (actual prompt)...');

  const systemPrompt = `You are an expert proposal writer for DRMHOPE Software following Bettroi professional quotation standards.

Create comprehensive TERMS & CONDITIONS following Bettroi standards with EXACT FORMATTING:

**YOU MUST USE THIS EXACT FORMAT (numbered list with bold titles):**

1. **Payment Terms:** 60% advance payment upon project commencement, 40% upon final delivery and client approval. All payments must be made within 7 business days of invoice.

2. **Quotation Validity:** This quotation is valid for 30 days from the date of issue. Prices and terms are subject to change after this period.

3. **Taxes & Levies:** All amounts quoted are exclusive of GST and other applicable government taxes, which will be charged additionally as per prevailing rates.

4. **Revisions & Changes:** Up to 3 rounds of revisions are included in each development phase. Additional revision requests will be quoted separately based on scope and effort.

5. **Post-Launch Support:** DRMHOPE Software will provide three months of bug fixing support free of charge, commencing from the date of final delivery. This support covers only bugs and errors directly related to the original project scope and does not include new features or functionality changes beyond the original scope.

6. **Intellectual Property:** Upon receipt of the final payment in full, DRMHOPE Software agrees to transfer complete ownership of the source code and all intellectual property rights associated with the completed project to the client. Until final payment is made, all intellectual property rights will remain with DRMHOPE Software.

7. **Confidentiality:** DRMHOPE Software will maintain strict confidentiality of all project details, client data, and any information shared during the project. We will not disclose any sensitive information to third parties without the express consent of the client.

8. **Change Requests:** Any additional features, functionality changes, or modifications that are not included in the original project scope will be considered as change requests and will be quoted separately as an addendum.

9. **Testing & Feedback:** The client is responsible for providing timely feedback on testing and deliverables within 5 business days of receiving a test version. Delays in feedback may impact the project timeline and delivery dates.

10. **Deliverables & Documentation:** All project deliverables will be provided in source code format along with comprehensive technical documentation to support future development and maintenance efforts.

**CRITICAL:** Format as a numbered list (1-10) with each item starting with bold title followed by colon and description.

**Critical Requirements:**
- Use professional business language
- Include specific technical details
- Be comprehensive and detailed
- Follow the exact format specified above
- Use tables where specified
- Include all required elements
- Write in English
- Quality over brevity - be detailed and professional

Return ONLY the content in the specified format, no meta-commentary or explanations.`;

  const userPrompt = `Generate a professional, detailed terms for a software development proposal following Bettroi/DRMHOPE Software standards.

**CLIENT INFORMATION:**
- Client Name: ${clientContext.name}
- Company: ${clientContext.company}
- Industry: ${clientContext.industry}

**PROJECT DETAILS:**
- Project Type: ${clientContext.projectType}
- Budget Range: $${clientContext.budget?.toLocaleString()}
- Preferred Timeline: ${clientContext.timeline}
- Special Requirements: ${clientContext.additionalInfo}

Generate a comprehensive, professional terms now:`;

  console.log(`System prompt length: ${systemPrompt.length} chars`);
  console.log(`User prompt length: ${userPrompt.length} chars`);
  console.log(`Total prompt length: ${systemPrompt.length + userPrompt.length} chars`);

  try {
    console.log('\n4. Sending request to OpenAI...');
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const endTime = Date.now();
    const content = completion.choices[0]?.message?.content || '';

    console.log('\n✓ SUCCESS! Terms generated successfully!');
    console.log(`Response time: ${endTime - startTime}ms`);
    console.log(`Content length: ${content.length} chars`);
    console.log(`Tokens used: ${completion.usage?.total_tokens}`);
    console.log(`\nGenerated content preview:\n${content.substring(0, 500)}...\n`);

    // Save to file for inspection
    fs.writeFileSync('test-terms-output.txt', content);
    console.log('✓ Full content saved to: test-terms-output.txt');

  } catch (error) {
    console.error('\n❌ TERMS generation FAILED!');
    console.error('Error message:', error.message);
    console.error('Error details:', {
      status: error?.status,
      type: error?.type,
      code: error?.code,
      param: error?.param
    });

    if (error?.status === 429) {
      console.error('\n⚠️  RATE LIMIT: You have exceeded your OpenAI API quota or rate limit.');
      console.error('Solutions:');
      console.error('1. Check your OpenAI account usage at https://platform.openai.com/usage');
      console.error('2. Add billing/payment method at https://platform.openai.com/account/billing');
      console.error('3. Wait for rate limit to reset');
    } else if (error?.status === 401) {
      console.error('\n⚠️  AUTHENTICATION: Your OpenAI API key is invalid or expired.');
      console.error('Solutions:');
      console.error('1. Generate a new API key at https://platform.openai.com/api-keys');
      console.error('2. Update OPENAI_API_KEY in your .env.local file');
    } else if (error?.status === 400) {
      console.error('\n⚠️  BAD REQUEST: The request parameters are invalid.');
      console.error('This could be due to:');
      console.error('- Prompt is too long');
      console.error('- Invalid model name');
      console.error('- Malformed request');
    }

    process.exit(1);
  }

  console.log('\n========================================');
  console.log('Test Complete!');
  console.log('========================================\n');
}

// Run the test
testTermsGeneration().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
