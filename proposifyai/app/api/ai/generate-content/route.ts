/**
 * AI Content Generation API
 * POST /api/ai/generate-content
 *
 * Generates proposal sections using OpenAI GPT-4
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateProposalContent } from '@/lib/ai/openai';
import { createClient } from '@/lib/supabase/server';

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
    const { sectionType, clientContext, tone, language, proposalId } = body;

    // Validate required fields
    if (!sectionType || !clientContext || !clientContext.name) {
      return NextResponse.json(
        { error: 'Missing required fields: sectionType and clientContext.name are required' },
        { status: 400 }
      );
    }

    // Fetch formatting preferences (proposal-specific or company default)
    let formattingPreferences = null;
    if (proposalId) {
      // Try to get proposal-specific formatting
      const { data: proposalFormatting } = await supabase
        .from('formatting_preferences')
        .select('*')
        .eq('proposal_id', proposalId)
        .eq('user_id', user.id)
        .single();
      formattingPreferences = proposalFormatting;
    }

    // If no proposal-specific formatting, get company default
    if (!formattingPreferences) {
      const { data: defaultFormatting } = await supabase
        .from('formatting_preferences')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_company_default', true)
        .single();
      formattingPreferences = defaultFormatting;
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
      free: 3,
      professional: Infinity,
      business: Infinity,
      enterprise: Infinity,
    };

    const userTier = profile?.subscription_tier || 'free';
    const limit = usageLimits[userTier as keyof typeof usageLimits];

    if ((monthlyUsage || 0) >= limit) {
      return NextResponse.json(
        {
          error: `Monthly limit reached. Your ${userTier} plan allows ${limit} AI generations per month. Upgrade to Professional for unlimited access.`
        },
        { status: 429 }
      );
    }

    // Generate content using OpenAI with formatting preferences
    const startTime = Date.now();
    const result = await generateProposalContent({
      sectionType,
      clientContext,
      tone,
      language,
      formattingPreferences: formattingPreferences || undefined,
    });
    const latency = Date.now() - startTime;

    // Log AI interaction for billing and analytics
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      interaction_type: 'content_gen',
      input_data: { sectionType, clientContext, tone, language },
      output_data: { content: result.content.substring(0, 200) + '...' }, // Store preview
      ai_model: result.model,
      tokens_used: result.tokensUsed,
      latency_ms: latency,
      cost: result.cost,
      success: true,
    });

    // Return generated content
    return NextResponse.json({
      success: true,
      data: {
        content: result.content,
        metadata: {
          tokensUsed: result.tokensUsed,
          model: result.model,
          cost: result.cost,
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
    console.error('AI content generation error:', error);

    // Log failed interaction
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('ai_interactions').insert({
          user_id: user.id,
          interaction_type: 'content_gen',
          success: false,
          error_message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return NextResponse.json(
      {
        error: 'Failed to generate content',
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
