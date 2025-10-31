/**
 * Individual Proposal API
 * GET /api/proposals/[id] - Get single proposal
 * PATCH /api/proposals/[id] - Update proposal
 * DELETE /api/proposals/[id] - Delete proposal
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Get single proposal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: proposal, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: { proposal }
    });

  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch proposal',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH - Update proposal
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Remove fields that shouldn't be updated directly
    const { id, user_id, created_at, ...updateData } = body;

    // Update proposal
    const { data: proposal, error } = await supabase
      .from('proposals')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: { proposal }
    });

  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      {
        error: 'Failed to update proposal',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete proposal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Proposal deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete proposal',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
