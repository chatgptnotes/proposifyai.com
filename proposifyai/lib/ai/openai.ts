/**
 * OpenAI Client Wrapper
 * Handles GPT-4 content generation, embeddings, and AI interactions
 */

import OpenAI from 'openai';

// Initialize OpenAI client lazily to avoid build-time errors
let openaiInstance: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

// Types
export interface ContentGenerationParams {
  sectionType: 'executive_summary' | 'scope_of_work' | 'pricing_breakdown' | 'timeline' | 'terms';
  clientContext: {
    name: string;
    company?: string;
    industry?: string;
    projectType?: string;
    budget?: number;
    timeline?: string;
    additionalInfo?: string;
    website?: string;
  };
  tone?: 'professional' | 'casual' | 'technical' | 'executive';
  language?: string;
  maxTokens?: number;
  formattingPreferences?: {
    font_family?: string;
    font_size_base?: number;
    primary_color?: string;
    secondary_color?: string;
    heading_style?: string;
    line_height?: number;
    paragraph_spacing?: number;
    section_spacing?: number;
    bullet_style?: string;
    numbering_style?: string;
    table_style?: string;
    border_style?: string;
  };
}

export interface EmbeddingParams {
  text: string;
  model?: 'text-embedding-3-small' | 'text-embedding-3-large';
}

export interface ChatCompletionParams {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Generate proposal content using GPT-4
 */
export async function generateProposalContent(params: ContentGenerationParams): Promise<{
  content: string;
  tokensUsed: number;
  model: string;
  cost: number;
}> {
  const {
    sectionType,
    clientContext,
    tone = 'professional',
    language = 'en',
    maxTokens = 1500,
    formattingPreferences
  } = params;

  // Build context-aware system prompt
  const systemPrompt = buildSystemPrompt(sectionType, tone, language, formattingPreferences);

  // Build user prompt with client context
  const userPrompt = buildUserPrompt(sectionType, clientContext);

  try {
    const openai = getOpenAIClient();

    console.log(`[OpenAI] Starting generation for section: ${sectionType}`);
    console.log(`[OpenAI] System prompt length: ${systemPrompt.length} chars`);
    console.log(`[OpenAI] User prompt length: ${userPrompt.length} chars`);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    const content = completion.choices[0]?.message?.content || '';
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Calculate cost (GPT-4 Turbo: $0.01/1K input, $0.03/1K output)
    const cost = calculateCost(
      completion.usage?.prompt_tokens || 0,
      completion.usage?.completion_tokens || 0,
      'gpt-4-turbo-preview'
    );

    console.log(`[OpenAI] ✓ Successfully generated ${sectionType}: ${content.length} chars, ${tokensUsed} tokens, $${cost}`);

    return {
      content,
      tokensUsed,
      model: 'gpt-4-turbo-preview',
      cost
    };
  } catch (error: any) {
    console.error(`[OpenAI] ✗ Content generation error for ${sectionType}:`, {
      message: error?.message,
      status: error?.status,
      type: error?.type,
      code: error?.code,
      error: error
    });

    // Extract more specific error information
    let errorMessage = 'Unknown error';
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    }

    throw new Error(`Failed to generate content: ${errorMessage}`);
  }
}

/**
 * Generate text embeddings for semantic search
 */
export async function generateEmbedding(params: EmbeddingParams): Promise<{
  embedding: number[];
  tokensUsed: number;
  cost: number;
}> {
  const { text, model = 'text-embedding-3-large' } = params;

  try {
    const openai = getOpenAIClient();
    const response = await openai.embeddings.create({
      model,
      input: text,
      encoding_format: 'float',
    });

    const embedding = response.data[0].embedding;
    const tokensUsed = response.usage.total_tokens;

    // Calculate cost (text-embedding-3-large: $0.00013/1K tokens)
    const cost = (tokensUsed / 1000) * 0.00013;

    return {
      embedding,
      tokensUsed,
      cost
    };
  } catch (error) {
    console.error('OpenAI embedding generation error:', error);
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generic chat completion (flexible for various use cases)
 */
export async function chatCompletion(params: ChatCompletionParams): Promise<{
  content: string;
  tokensUsed: number;
  model: string;
  cost: number;
}> {
  const {
    messages,
    model = 'gpt-4-turbo-preview',
    temperature = 0.7,
    maxTokens = 2000
  } = params;

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    const content = completion.choices[0]?.message?.content || '';
    const tokensUsed = completion.usage?.total_tokens || 0;
    const cost = calculateCost(
      completion.usage?.prompt_tokens || 0,
      completion.usage?.completion_tokens || 0,
      model
    );

    return {
      content,
      tokensUsed,
      model,
      cost
    };
  } catch (error) {
    console.error('OpenAI chat completion error:', error);
    throw new Error(`Chat completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Build system prompt based on section type and tone
 * NOW USES BETTROI PROFESSIONAL TEMPLATE STANDARDS
 * ENHANCED with formatting preferences integration
 */
function buildSystemPrompt(
  sectionType: ContentGenerationParams['sectionType'],
  tone: string,
  language: string,
  formattingPreferences?: ContentGenerationParams['formattingPreferences']
): string {
  // Extract formatting preferences or use defaults
  const fontFamily = formattingPreferences?.font_family || 'Arial, Helvetica, sans-serif';
  const fontSize = formattingPreferences?.font_size_base || 12;
  const primaryColor = formattingPreferences?.primary_color || '#DC2626';
  const secondaryColor = formattingPreferences?.secondary_color || '#B91C1C';
  const lineHeight = formattingPreferences?.line_height || 1.9;
  const headingStyle = formattingPreferences?.heading_style || 'bold';
  const bulletStyle = formattingPreferences?.bullet_style || 'checkmark';
  const tableStyle = formattingPreferences?.table_style || 'modern';
  const borderStyle = formattingPreferences?.border_style || '2px solid';
  const sectionSpacing = formattingPreferences?.section_spacing || 30;
  const paragraphSpacing = formattingPreferences?.paragraph_spacing || 20;
  const sectionInstructions = {
    executive_summary: `Create a comprehensive PROJECT OVERVIEW section (2-3 paragraphs) following Bettroi professional standards:

**Required Elements:**
- Project name and type clearly stated
- AI-powered solution description with specific technology mentions
- Business value proposition and expected outcomes
- Platform coverage (web/iOS/Android as applicable)
- Professional, persuasive language
- Real-world impact metrics where possible

**Quality Standards:**
- 150-250 words minimum
- Specific technical details (not generic "we will build")
- Clear value proposition
- Industry-specific terminology
- End with strong transition to scope of work

**Example Quality Level:**
"Development of a comprehensive AI-powered virtual fashion try-on platform featuring web and mobile applications. The solution leverages advanced AI technology to provide real-time fashion visualization, enabling users to virtually try on top-line fashion items, clothing, and accessories before making purchase decisions. This innovative platform combines computer vision, machine learning, and 3D rendering to create an immersive shopping experience that increases conversion rates by up to 40% and reduces returns by 30%."`,

    scope_of_work: `Create SCOPE OF WORK section with proper HTML and custom styling:

**CRITICAL: You MUST output HTML code with proper structure:**

<div style="margin: ${sectionSpacing}px 0; font-family: ${fontFamily};">
<h2 style="color: ${primaryColor}; font-size: ${fontSize + 8}px; font-weight: ${headingStyle === 'bold' ? '700' : '600'}; margin-bottom: ${paragraphSpacing}px; padding-bottom: 10px; border-bottom: ${borderStyle} ${primaryColor};">Scope of Work</h2>

<div style="background: #FAFAFA; border-left: 4px solid ${primaryColor}; padding: 25px; margin: ${paragraphSpacing}px 0; border-radius: 0 8px 8px 0;">
<h3 style="color: #333; font-size: ${fontSize + 6}px; font-weight: 600; margin-bottom: 15px;">1. Web Application Development</h3>
<div style="line-height: ${lineHeight}; color: #555; font-size: ${fontSize}px;">
✓ Responsive web platform with modern UI/UX design optimized for desktop and mobile browsers<br/>
✓ AI/ML API integration framework (API costs borne by client) with seamless third-party service connectivity<br/>
✓ Real-time capabilities using WebSocket technology for instant updates and live data synchronization<br/>
✓ User authentication and profile management with OAuth 2.0, JWT tokens, and multi-factor authentication<br/>
✓ Core feature implementation specific to [project type] with full CRUD operations and data management<br/>
✓ Admin dashboard with comprehensive analytics, reporting, and user management capabilities<br/>
✓ RESTful API backend with Node.js/Express or similar framework for robust data handling<br/>
✓ Cloud database integration (PostgreSQL/MySQL/MongoDB) with data encryption and backup systems<br/>
✓ Advanced search and filtering capabilities with full-text search and intelligent query optimization<br/>
✓ File upload and management system with cloud storage integration (AWS S3/Google Cloud Storage)<br/>
✓ Email notification system with customizable templates and automated workflow triggers<br/>
✓ Performance optimization with caching, CDN integration, and lazy loading for fast page speeds<br/>
</div>
</div>

<div style="background: white; border-left: 4px solid #DC2626; padding: 25px; margin: 20px 0; border-radius: 0 8px 8px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
<h3 style="color: #333; font-size: 18px; font-weight: 600; margin-bottom: 15px;">2. iOS Application Development</h3>
<div style="line-height: 1.9; color: #555;">
✓ Native iOS application with SwiftUI/UIKit following Apple Human Interface Guidelines<br/>
✓ Complete feature parity with web platform ensuring consistent user experience across devices<br/>
✓ iOS-specific features: Face ID/Touch ID authentication, Push Notifications, and Haptic Feedback<br/>
✓ Offline-first architecture with CoreData local storage and background sync capabilities<br/>
✓ App Store optimization including metadata, screenshots, and compliance with Apple guidelines<br/>
✓ Deep linking support for seamless navigation from external sources and notifications<br/>
✓ Integration with iOS native features (Camera, Photo Library, Location Services as applicable)<br/>
✓ Performance optimization for various iPhone models and iOS versions (iOS 15+)<br/>
✓ Comprehensive error handling and crash reporting with Firebase Crashlytics or similar<br/>
✓ TestFlight beta testing setup for pre-launch quality assurance<br/>
</div>
</div>

<div style="background: #FAFAFA; border-left: 4px solid #DC2626; padding: 25px; margin: 20px 0; border-radius: 0 8px 8px 0;">
<h3 style="color: #333; font-size: 18px; font-weight: 600; margin-bottom: 15px;">3. Android Application Development</h3>
<div style="line-height: 1.9; color: #555;">
✓ Native Android application with Kotlin/Java following Material Design 3 guidelines<br/>
✓ Complete feature parity with web and iOS platforms for consistent cross-platform experience<br/>
✓ Android-specific features: Biometric authentication, Push Notifications, and Material Motion<br/>
✓ Offline-first architecture with Room database and WorkManager for background sync<br/>
✓ Google Play Store optimization including ASO, screenshots, and compliance requirements<br/>
✓ Deep linking and App Links support for seamless integration with external systems<br/>
✓ Integration with Android native features (Camera, Gallery, GPS as applicable)<br/>
✓ Performance optimization for various Android devices and OS versions (Android 8+)<br/>
✓ Comprehensive error handling and crash reporting with Firebase or similar tools<br/>
✓ Internal testing and staged rollout preparation for smooth Play Store launch<br/>
</div>
</div>
</div>

**CRITICAL: Use proper HTML with inline CSS, custom brand colors (${primaryColor}), and 10-12 features per platform.**
**BULLET STYLE: Use ${bulletStyle === 'checkmark' ? '✓' : bulletStyle === 'arrow' ? '→' : '•'} before each feature.**`,

    pricing_breakdown: `Create INVESTMENT BREAKDOWN section with HTML TABLE following professional template format:

**CRITICAL: You MUST output HTML code, not markdown. Use this exact structure with custom colors:**

<div style="margin: ${sectionSpacing}px 0; font-family: ${fontFamily};">
<h2 style="color: ${primaryColor}; font-size: ${fontSize + 8}px; font-weight: ${headingStyle === 'bold' ? '700' : '600'}; margin-bottom: ${paragraphSpacing}px; padding-bottom: 10px; border-bottom: ${borderStyle} ${primaryColor};">Investment Breakdown</h2>

<table style="width: 100%; border-collapse: collapse; margin: ${paragraphSpacing}px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: ${fontFamily};">
<thead>
<tr style="background: ${primaryColor}; color: white;">
<th style="padding: 15px; text-align: left; font-weight: 600;">DELIVERABLE</th>
<th style="padding: 15px; text-align: left; font-weight: 600;">DESCRIPTION</th>
<th style="padding: 15px; text-align: right; font-weight: 600;">AMOUNT (USD)</th>
</tr>
</thead>
<tbody>
<tr style="background: #FAFAFA;">
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">Web Application Development</td>
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">Complete responsive web platform with modern UI/UX design, all core features, admin dashboard, and cloud integration</td>
<td style="padding: 15px; text-align: right; border-bottom: 1px solid #E5E7EB; font-weight: 600;">$[Calculate 40-50% of budget]</td>
</tr>
<tr style="background: white;">
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">iOS Application Development</td>
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">Native iOS application with full feature parity, App Store optimization, and iOS-specific features</td>
<td style="padding: 15px; text-align: right; border-bottom: 1px solid #E5E7EB; font-weight: 600;">$[Calculate 25-30% of budget]</td>
</tr>
<tr style="background: #FAFAFA;">
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">Android Application Development</td>
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">Native Android application with Material Design, Play Store optimization, and Android-specific features</td>
<td style="padding: 15px; text-align: right; border-bottom: 1px solid #E5E7EB; font-weight: 600;">$[Calculate 25-30% of budget]</td>
</tr>
<tr style="background: ${primaryColor}; color: white;">
<td style="padding: 15px; font-weight: 700; font-size: ${fontSize + 4}px;" colspan="2">TOTAL PROJECT INVESTMENT</td>
<td style="padding: 15px; text-align: right; font-weight: 700; font-size: ${fontSize + 6}px;">$[Total Budget]</td>
</tr>
</tbody>
</table>

<div style="background: #FEF2F2; border-left: 4px solid ${primaryColor}; padding: ${paragraphSpacing}px; margin: ${sectionSpacing}px 0; border-radius: 0 8px 8px 0;">
<h3 style="color: ${secondaryColor}; font-size: ${fontSize + 4}px; font-weight: 600; margin-bottom: 15px;">Exclusions (Quoted Separately Upon Request):</h3>
<ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
<li style="color: #7F1D1D; margin-bottom: 8px;"><strong>AI Model API Costs:</strong> All AI model API subscriptions, usage fees, and related costs to be borne directly by client</li>
<li style="color: #7F1D1D; margin-bottom: 8px;"><strong>Third-party API Integrations:</strong> Costs for any third-party services</li>
<li style="color: #7F1D1D; margin-bottom: 8px;"><strong>Server Deployment & Hosting:</strong> Cloud infrastructure setup, domain, and SSL certificates</li>
<li style="color: #7F1D1D; margin-bottom: 8px;"><strong>App Store Fees:</strong> Apple App Store ($99/year) and Google Play Store ($25 one-time)</li>
<li style="color: #7F1D1D; margin-bottom: 8px;"><strong>Ongoing Maintenance:</strong> Post-launch support beyond 3-month period</li>
<li style="color: #7F1D1D; margin-bottom: 8px;"><strong>Marketing & Content:</strong> Promotional materials and campaigns</li>
</ul>
</div>

<p style="color: #666; font-size: 14px; font-style: italic;">All amounts are exclusive of applicable GST/VAT taxes.</p>
</div>

**CRITICAL: Use ONLY HTML table tags, inline CSS styles, and custom brand colors (${primaryColor}). Calculate realistic amounts from budget provided.**`,

    timeline: `Create DEVELOPMENT TIMELINE section with HTML TABLE following professional template format:

**CRITICAL: You MUST output HTML code, not markdown. Use this exact structure with custom colors:**

<div style="margin: ${sectionSpacing}px 0; font-family: ${fontFamily};">
<h2 style="color: ${primaryColor}; font-size: ${fontSize + 8}px; font-weight: ${headingStyle === 'bold' ? '700' : '600'}; margin-bottom: ${paragraphSpacing}px; padding-bottom: 10px; border-bottom: ${borderStyle} ${primaryColor};">Development Timeline</h2>

<table style="width: 100%; border-collapse: collapse; margin: ${paragraphSpacing}px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: ${fontFamily};">
<thead>
<tr style="background: ${primaryColor}; color: white;">
<th style="padding: 15px; text-align: left; font-weight: 600;">PHASE</th>
<th style="padding: 15px; text-align: left; font-weight: 600;">DELIVERABLES</th>
<th style="padding: 15px; text-align: center; font-weight: 600;">DURATION</th>
</tr>
</thead>
<tbody>
<tr style="background: #FAFAFA;">
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB; font-weight: 600;">Phase 1: Discovery & Planning</td>
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">Client requirements gathering, technical analysis, project roadmap, and customization specifications</td>
<td style="padding: 15px; text-align: center; border-bottom: 1px solid #E5E7EB; font-weight: 600;">1-2 weeks</td>
</tr>
<tr style="background: white;">
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB; font-weight: 600;">Phase 2: Web Application Development</td>
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">Frontend/backend development, database setup, API integration, admin dashboard implementation</td>
<td style="padding: 15px; text-align: center; border-bottom: 1px solid #E5E7EB; font-weight: 600;">3-4 weeks</td>
</tr>
<tr style="background: #FAFAFA;">
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB; font-weight: 600;">Phase 3: iOS Application Development</td>
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">Native iOS app development, App Store preparation, iOS-specific features and optimization</td>
<td style="padding: 15px; text-align: center; border-bottom: 1px solid #E5E7EB; font-weight: 600;">2-3 weeks</td>
</tr>
<tr style="background: white;">
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB; font-weight: 600;">Phase 4: Android Application Development</td>
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">Native Android app development, Play Store preparation, Material Design implementation</td>
<td style="padding: 15px; text-align: center; border-bottom: 1px solid #E5E7EB; font-weight: 600;">2-3 weeks</td>
</tr>
<tr style="background: #FAFAFA;">
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB; font-weight: 600;">Phase 5: Integration & Testing</td>
<td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">Cross-platform testing, QA, bug fixes, performance optimization, and final delivery</td>
<td style="padding: 15px; text-align: center; border-bottom: 1px solid #E5E7EB; font-weight: 600;">1-2 weeks</td>
</tr>
<tr style="background: ${primaryColor}; color: white;">
<td style="padding: 15px; font-weight: 700; font-size: ${fontSize + 4}px;" colspan="2">TOTAL PROJECT TIMELINE</td>
<td style="padding: 15px; text-align: center; font-weight: 700; font-size: ${fontSize + 4}px;">8-12 weeks</td>
</tr>
</tbody>
</table>

<p style="color: #666; font-size: ${fontSize}px; font-style: italic; margin-top: 15px;"><strong>Note:</strong> A fast-track delivery option is available upon request with additional resources.</p>
</div>

**CRITICAL: Use ONLY HTML table tags, inline CSS styles, and custom brand colors (${primaryColor}). Adjust timeline realistically based on project complexity.**`,

    terms: `Create comprehensive TERMS & CONDITIONS following Bettroi standards with EXACT FORMATTING:

**YOU MUST USE THIS EXACT FORMAT (numbered list with bold titles):**

1. **Payment Terms:** 60% advance payment upon project commencement, 40% upon final delivery and client approval. All payments must be made within 7 business days of invoice.

2. **Quotation Validity:** This quotation is valid for 30 days from the date of issue. Prices and terms are subject to change after this period.

3. **Taxes & Levies:** All amounts quoted are exclusive of GST and other applicable government taxes, which will be charged additionally as per prevailing rates.

4. **Revisions & Changes:** Up to 3 rounds of revisions are included in each development phase. Additional revision requests will be quoted separately based on scope and effort.

5. **Post-Launch Support:** Bettroi will provide three months of bug fixing support free of charge, commencing from the date of final delivery. This support covers only bugs and errors directly related to the original project scope and does not include new features or functionality changes beyond the original scope.

6. **Intellectual Property:** Upon receipt of the final payment in full, Bettroi agrees to transfer complete ownership of the source code and all intellectual property rights associated with the completed project to the client. Until final payment is made, all intellectual property rights will remain with Bettroi.

7. **Confidentiality:** Bettroi will maintain strict confidentiality of all project details, client data, and any information shared during the project. We will not disclose any sensitive information to third parties without the express consent of the client.

8. **Change Requests:** Any additional features, functionality changes, or modifications that are not included in the original project scope will be considered as change requests and will be quoted separately as an addendum.

9. **Testing & Feedback:** The client is responsible for providing timely feedback on testing and deliverables within 5 business days of receiving a test version. Delays in feedback may impact the project timeline and delivery dates.

10. **Deliverables & Documentation:** All project deliverables will be provided in source code format along with comprehensive technical documentation to support future development and maintenance efforts.

**CRITICAL:** Format as a numbered list (1-10) with each item starting with bold title followed by colon and description.`
  };

  return `You are an expert proposal writer for Bettroi following professional business quotation standards.

${sectionInstructions[sectionType]}

**Critical Requirements:**
- Use professional business language
- Include specific technical details
- Be comprehensive and detailed
- Follow the exact format specified above
- Use tables where specified
- Include all required elements
- Write in ${language === 'en' ? 'English' : language}
- Quality over brevity - be detailed and professional

Return ONLY the content in the specified format, no meta-commentary or explanations.`;
}

/**
 * Build user prompt with client context
 * ENHANCED for Bettroi-style comprehensive proposals
 */
function buildUserPrompt(
  sectionType: ContentGenerationParams['sectionType'],
  clientContext: ContentGenerationParams['clientContext']
): string {
  const { name, company, industry, projectType, budget, timeline, additionalInfo } = clientContext;

  let prompt = `Generate a professional, detailed ${sectionType.replace('_', ' ')} for a software development proposal following Bettroi professional standards.\n\n`;

  prompt += '**CLIENT INFORMATION:**\n';
  prompt += `- Client Name: ${name}\n`;
  if (company) prompt += `- Company: ${company}\n`;
  if (industry) prompt += `- Industry: ${industry}\n`;
  prompt += '\n';

  prompt += '**PROJECT DETAILS:**\n';
  if (projectType) prompt += `- Project Type: ${projectType}\n`;
  if (budget) prompt += `- Budget Range: $${budget.toLocaleString()}\n`;
  if (timeline) prompt += `- Preferred Timeline: ${timeline}\n`;
  if (additionalInfo) prompt += `- Special Requirements: ${additionalInfo}\n`;
  prompt += '\n';

  // Add section-specific context
  if (sectionType === 'scope_of_work') {
    prompt += `**IMPORTANT:** Generate detailed scope of work with:\n`;
    prompt += `- Minimum 10-12 specific features per platform\n`;
    prompt += `- Technical details in each feature (not generic descriptions)\n`;
    prompt += `- Checkmarks (✓) before each feature\n`;
    prompt += `- Industry-specific terminology for ${industry || projectType}\n`;
    prompt += `- Include AI API integration note with "(API costs by client)"\n`;
    prompt += `\n`;
  }

  if (sectionType === 'pricing_breakdown') {
    prompt += `**PRICING CONTEXT:**\n`;
    prompt += `- This is for professional software development\n`;
    prompt += `- Include platform breakdown (Web/iOS/Android as applicable)\n`;
    prompt += `- Add comprehensive exclusions list\n`;
    prompt += `- Include important note about AI API costs\n`;
    if (budget) {
      prompt += `- Total should be around $${budget.toLocaleString()}\n`;
    }
    prompt += `\n`;
  }

  if (sectionType === 'timeline') {
    prompt += `**TIMELINE REQUIREMENTS:**\n`;
    prompt += `- Break down by development phases\n`;
    prompt += `- Include requirements gathering, development, testing phases\n`;
    prompt += `- Be realistic (typically 4-12 weeks for ${projectType})\n`;
    if (timeline) {
      prompt += `- Should fit within or be close to: ${timeline}\n`;
    }
    prompt += `\n`;
  }

  prompt += `Generate a comprehensive, professional ${sectionType.replace('_', ' ')} now:`;

  return prompt;
}

/**
 * Calculate AI API cost
 */
function calculateCost(promptTokens: number, completionTokens: number, model: string): number {
  const pricing = {
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 }, // per 1K tokens
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
  };

  const modelPricing = pricing[model as keyof typeof pricing] || pricing['gpt-4-turbo-preview'];

  const inputCost = (promptTokens / 1000) * modelPricing.input;
  const outputCost = (completionTokens / 1000) * modelPricing.output;

  return parseFloat((inputCost + outputCost).toFixed(4));
}

/**
 * Streaming chat completion (for real-time UI updates)
 */
export async function streamChatCompletion(
  messages: ChatCompletionParams['messages'],
  onChunk: (chunk: string) => void
): Promise<void> {
  try {
    const openai = getOpenAIClient();
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('OpenAI streaming error:', error);
    throw error;
  }
}
