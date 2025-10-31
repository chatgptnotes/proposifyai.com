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
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Missing required field: image' },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();
    const startTime = Date.now();

    // Use GPT-4o with vision to analyze the letterhead
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a professional graphic design analyst. Analyze this company letterhead and extract the following information in JSON format:

1. Primary brand color (hex code) - the dominant color used
2. Secondary brand color (hex code) - complementary or accent color
3. Text color (hex code) - main text color
4. Logo position (describe where the logo is positioned, e.g., "top-left", "top-center", "top-right")
5. Logo dimensions (describe size, e.g., "120x120px" or "small", "medium", "large")
6. Safe text flow regions (describe safe areas for text placement)
7. Margins (estimate in mm: top, bottom, left, right)
8. Spacing recommendations
9. Font style suggestions (based on visual analysis)

Return ONLY a valid JSON object with these exact fields:
{
  "primaryColor": "#hexcode",
  "secondaryColor": "#hexcode",
  "textColor": "#hexcode",
  "logoPosition": "position description",
  "logoDimensions": "dimension description",
  "safeTextRegions": "description of safe text areas",
  "margins": { "top": 20, "bottom": 20, "left": 20, "right": 20 },
  "spacing": "spacing recommendations",
  "fontSuggestions": "font style suggestions"
}`
            },
            {
              type: 'image_url',
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    const analysisText = response.choices[0].message.content || '{}';
    const latency = Date.now() - startTime;
    const tokensUsed = response.usage?.total_tokens || 0;

    // Try to parse JSON from the response
    let analysis = {};
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\n?([\s\S]*?)\n?```/) ||
                       analysisText.match(/```\n?([\s\S]*?)\n?```/) ||
                       [null, analysisText];
      analysis = JSON.parse(jsonMatch[1] || analysisText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return raw text if JSON parsing fails
      analysis = { suggestions: analysisText };
    }

    // Log AI interaction
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      interaction_type: 'design',
      input_data: { imageSize: image.length },
      output_data: analysis,
      ai_model: 'gpt-4o',
      tokens_used: tokensUsed,
      latency_ms: latency,
      cost: (tokensUsed / 1000) * 0.005, // GPT-4o pricing
      success: true,
    });

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        tokensUsed,
        model: 'gpt-4o',
        latencyMs: latency,
      }
    });
  } catch (error) {
    console.error('Letterhead analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze letterhead',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
