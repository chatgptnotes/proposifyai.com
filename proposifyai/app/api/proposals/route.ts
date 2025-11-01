/**
 * Proposals API
 * GET /api/proposals - List user's proposals
 * POST /api/proposals - Create new proposal
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - List user's proposals
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query with template join
    let query = supabase
      .from('proposals')
      .select(`
        *,
        template:templates(name)
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: proposals, error, count } = await query;

    if (error) {
      throw error;
    }

    // Format proposals to include template_name
    const formattedProposals = (proposals || []).map((proposal: any) => ({
      ...proposal,
      template_name: proposal.template?.name || null,
      template: undefined, // Remove nested template object
    }));

    return NextResponse.json({
      success: true,
      proposals: formattedProposals,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    });

  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch proposals',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new proposal
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', details: authError?.message || 'No user session found' },
        { status: 401 }
      );
    }

    // Ensure user has a profile (create if doesn't exist)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      // Create profile for user
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || '',
          subscription_tier: 'free',
          onboarding_completed: false
        });

      if (insertError) {
        console.error("Failed to create profile:", insertError);
        return NextResponse.json(
          { error: 'Failed to create user profile', details: insertError.message },
          { status: 500 }
        );
      }
    }

    // Parse request body
    const body = await request.json();
    const {
      client_name,
      client_email,
      client_company,
      title,
      template_id,
      content,
      pricing,
      metadata,
      total_value,
      currency = 'USD'
    } = body;

    // Validate required fields
    if (!client_name || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: client_name and title are required' },
        { status: 400 }
      );
    }

    // Create proposal (template_id is optional, can be null)
    const proposalData: any = {
      user_id: user.id,
      client_name,
      client_email,
      client_company,
      title,
      content: content || {},
      pricing: pricing || {},
      metadata: metadata || {},
      total_value: total_value || 0,
      currency,
      status: 'draft'
    };

    // Only include template_id if it's a valid UUID
    if (template_id && template_id.length > 10 && template_id.includes('-')) {
      proposalData.template_id = template_id;
    }

    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert(proposalData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: { proposal }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      {
        error: 'Failed to create proposal',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
