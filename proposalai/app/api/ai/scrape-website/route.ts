import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url, purpose = 'general' } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Missing required field: url' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Fetch website content
    let websiteContent = '';
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'ProposifyAI/2.3.0 (Proposal Generator)'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch website: ${response.statusText}`);
      }

      const html = await response.text();

      // Extract text content from HTML (simple approach - strip tags)
      websiteContent = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 4000); // Limit to 4000 chars for token management

    } catch (fetchError) {
      console.error('Website fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch website content', details: fetchError instanceof Error ? fetchError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    // Use GPT-4 to extract relevant information
    const openai = getOpenAIClient();

    const systemPrompt = purpose === 'client'
      ? 'You are a business intelligence analyst. Extract key information about this company that would be useful for creating a tailored business proposal.'
      : 'You are a business research assistant. Extract key information about this company.';

    const userPrompt = purpose === 'client'
      ? `Analyze this company website content and extract the following information in JSON format:

{
  "companyName": "Official company name",
  "industry": "Primary industry/sector",
  "services": ["List of main services/products"],
  "size": "Company size estimate (startup/small/medium/large/enterprise)",
  "technologies": ["Technologies they use or mention"],
  "painPoints": ["Potential pain points or challenges mentioned"],
  "values": ["Company values or mission statements"],
  "recentNews": ["Any recent news, achievements, or initiatives"],
  "targetAudience": "Their target customers/audience",
  "competitors": ["Mentioned competitors if any"],
  "summary": "Brief 2-3 sentence summary"
}

Website content:
${websiteContent}`
      : `Analyze this company website and provide a JSON summary with: companyName, industry, services, summary.

Website content:
${websiteContent}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const analysisText = response.choices[0].message.content || '{}';
    const latency = Date.now() - startTime;
    const tokensUsed = response.usage?.total_tokens || 0;

    // Parse JSON response
    let analysis = {};
    try {
      const jsonMatch = analysisText.match(/```json\n?([\s\S]*?)\n?```/) ||
                       analysisText.match(/```\n?([\s\S]*?)\n?```/) ||
                       [null, analysisText];
      analysis = JSON.parse(jsonMatch[1] || analysisText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysis = { summary: analysisText };
    }

    // Log AI interaction
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      interaction_type: 'research',
      input_data: { url, purpose, contentLength: websiteContent.length },
      output_data: analysis,
      ai_model: 'gpt-4',
      tokens_used: tokensUsed,
      latency_ms: latency,
      cost: (tokensUsed / 1000) * 0.03,
      success: true,
    });

    return NextResponse.json({
      success: true,
      data: analysis,
      metadata: {
        tokensUsed,
        model: 'gpt-4',
        latencyMs: latency,
        url
      }
    });
  } catch (error) {
    console.error('Website scraping error:', error);
    return NextResponse.json(
      {
        error: 'Failed to scrape website',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
