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

    // Use GPT-4 Vision to analyze the letterhead
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional graphic design analyst. Analyze letterheads and extract brand information accurately.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this company letterhead and extract the following information in JSON format:

1. Primary brand color (hex code)
2. Secondary brand color (hex code)
3. Logo position (top-left, top-center, top-right)
4. Logo dimensions estimate (small, medium, large)
5. Safe text margins (top, bottom, left, right in mm)
6. Header height (in mm)
7. Footer presence (yes/no)
8. Font style recommendations (serif/sans-serif/modern)
9. Any other design suggestions

Return ONLY a JSON object with these fields:
{
  "primaryColor": "#hexcode",
  "secondaryColor": "#hexcode",
  "logoPosition": "position",
  "logoSize": "size",
  "margins": { "top": 0, "bottom": 0, "left": 0, "right": 0 },
  "headerHeight": 0,
  "hasFooter": false,
  "fontStyle": "style",
  "suggestions": "design suggestions as a string"
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
      max_tokens: 1000,
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
      ai_model: 'gpt-4-vision-preview',
      tokens_used: tokensUsed,
      latency_ms: latency,
      cost: (tokensUsed / 1000) * 0.04, // Vision pricing
      success: true,
    });

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        tokensUsed,
        model: 'gpt-4-vision-preview',
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
