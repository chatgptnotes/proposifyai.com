/**
 * Individual Proposal API
 * GET /api/proposals/[id] - Get single proposal
 * PUT /api/proposals/[id] - Update proposal
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
      .select(`
        *,
        template:templates(name)
      `)
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

    // Format proposal to include template_name
    const formattedProposal = {
      ...proposal,
      template_name: proposal.template?.name || null,
      template: undefined,
    };

    return NextResponse.json({
      success: true,
      data: formattedProposal
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

// PUT - Update proposal
export async function PUT(
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

    // Verify ownership
    const { data: existingProposal, error: checkError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (checkError || !existingProposal) {
      return NextResponse.json(
        { error: 'Proposal not found or unauthorized' },
        { status: 404 }
      );
    }

    // Parse update data
    const body = await request.json();
    const {
      title,
      client_name,
      client_email,
      client_company,
      content,
      pricing,
      metadata,
      total_value,
      currency,
      status
    } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (client_name !== undefined) updateData.client_name = client_name;
    if (client_email !== undefined) updateData.client_email = client_email;
    if (client_company !== undefined) updateData.client_company = client_company;
    if (content !== undefined) updateData.content = content;
    if (pricing !== undefined) updateData.pricing = pricing;
    if (metadata !== undefined) updateData.metadata = metadata;
    if (total_value !== undefined) updateData.total_value = total_value;
    if (currency !== undefined) updateData.currency = currency;
    if (status !== undefined) updateData.status = status;

    // Always update updated_at
    updateData.updated_at = new Date().toISOString();

    const { data: proposal, error } = await supabase
      .from('proposals')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
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

    // Verify ownership before deleting
    const { data: existingProposal, error: checkError } = await supabase
      .from('proposals')
      .select('id, title')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (checkError || !existingProposal) {
      return NextResponse.json(
        { error: 'Proposal not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete the proposal
    const { error: deleteError } = await supabase
      .from('proposals')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'Proposal deleted successfully',
      data: { id: params.id, title: existingProposal.title }
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
