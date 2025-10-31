/**
 * AI Semantic Search API
 * POST /api/ai/search-content
 *
 * Search content library using vector similarity (embeddings)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/ai/openai';
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
    const { query, limit = 5, contentType } = body;

    // Validate required fields
    if (!query) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
        { status: 400 }
      );
    }

    // Generate embedding for search query
    const { embedding, tokensUsed, cost } = await generateEmbedding({
      text: query,
      model: 'text-embedding-3-large'
    });

    // Build SQL query for vector similarity search
    let rpcQuery = supabase.rpc('search_content_by_similarity', {
      query_embedding: embedding,
      match_threshold: 0.7, // 70% similarity threshold
      match_count: limit,
      filter_user_id: user.id
    });

    // Add content type filter if specified
    if (contentType) {
      rpcQuery = rpcQuery.eq('content_type', contentType);
    }

    // Execute search
    const { data: results, error: searchError } = await rpcQuery;

    if (searchError) {
      console.error('Vector search error:', searchError);
      throw new Error('Failed to search content library');
    }

    // Log AI interaction
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      interaction_type: 'content_gen', // Using content_gen for semantic search
      input_data: { query, limit, contentType },
      output_data: { resultsCount: results?.length || 0 },
      ai_model: 'text-embedding-3-large',
      tokens_used: tokensUsed,
      cost: cost,
      success: true,
    });

    // Return search results
    return NextResponse.json({
      success: true,
      data: {
        results: results || [],
        metadata: {
          query,
          resultsCount: results?.length || 0,
          tokensUsed,
          cost,
        }
      }
    });

  } catch (error) {
    console.error('Semantic search error:', error);

    return NextResponse.json(
      {
        error: 'Failed to search content',
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
