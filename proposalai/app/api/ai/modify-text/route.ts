/**
 * AI Text Modification API
 * POST /api/ai/modify-text
 *
 * Modifies selected text based on user instructions using AI
 */

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
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { text, instruction } = body;

    // Validate required fields
    if (!text || !instruction) {
      return NextResponse.json(
        { error: 'Missing required fields: text and instruction are required' },
        { status: 400 }
      );
    }

    // Check user subscription tier and usage limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    // Count AI interactions this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: monthlyUsage } = await supabase
      .from('ai_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString());

    // Check usage limits based on tier
    const usageLimits = {
      free: 10,
      professional: Infinity,
      business: Infinity,
      enterprise: Infinity,
    };

    const userTier = profile?.subscription_tier || 'free';
    const limit = usageLimits[userTier as keyof typeof usageLimits];

    if ((monthlyUsage || 0) >= limit) {
      return NextResponse.json(
        {
          error: `Monthly limit reached. Your ${userTier} plan allows ${limit} AI modifications per month. Upgrade to Professional for unlimited access.`
        },
        { status: 429 }
      );
    }

    // Modify text using OpenAI
    const startTime = Date.now();
    const openai = getOpenAIClient();

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional writing assistant. Modify the provided text according to the user\'s instructions. Return only the modified text without any explanations or additional commentary.'
        },
        {
          role: 'user',
          content: `${instruction}\n\nText to modify:\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const modifiedText = response.choices[0].message.content || text;
    const tokensUsed = response.usage?.total_tokens || 0;
    const latency = Date.now() - startTime;

    // Log AI interaction for billing and analytics
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      interaction_type: 'text_modification',
      input_data: { instruction, textLength: text.length },
      output_data: { modifiedTextLength: modifiedText.length },
      ai_model: 'gpt-4',
      tokens_used: tokensUsed,
      latency_ms: latency,
      cost: (tokensUsed / 1000) * 0.03, // Approximate cost
      success: true,
    });

    // Return modified content
    return NextResponse.json({
      success: true,
      data: {
        modifiedText,
        metadata: {
          tokensUsed,
          model: 'gpt-4',
          latencyMs: latency,
        },
        usage: {
          currentMonth: (monthlyUsage || 0) + 1,
          limit: limit === Infinity ? 'unlimited' : limit,
          tier: userTier,
        }
      }
    });

  } catch (error) {
    console.error('AI text modification error:', error);

    // Log failed interaction
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('ai_interactions').insert({
          user_id: user.id,
          interaction_type: 'text_modification',
          success: false,
          error_message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return NextResponse.json(
      {
        error: 'Failed to modify text',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
