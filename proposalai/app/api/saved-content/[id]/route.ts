import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PATCH - Update saved content
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { title, content, category, metadata, is_favorite } = body;

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('saved_content')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Saved content not found' },
        { status: 404 }
      );
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have permission to update this content' },
        { status: 403 }
      );
    }

    // Build update object with only provided fields
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (category !== undefined) {
      const validCategories = ['bank_details', 'company_info', 'payment_terms', 'standard_clause', 'image'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
          { status: 400 }
        );
      }
      updates.category = category;
    }
    if (metadata !== undefined) updates.metadata = metadata;
    if (is_favorite !== undefined) updates.is_favorite = is_favorite;

    const { data, error } = await supabase
      .from('saved_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating saved content:', error);
      return NextResponse.json(
        { error: 'Failed to update saved content' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Saved content PATCH error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update saved content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete saved content
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('saved_content')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Saved content not found' },
        { status: 404 }
      );
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have permission to delete this content' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('saved_content')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting saved content:', error);
      return NextResponse.json(
        { error: 'Failed to delete saved content' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Saved content deleted successfully'
    });
  } catch (error) {
    console.error('Saved content DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete saved content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Increment usage count
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { id } = params;

    const { data, error } = await supabase.rpc('increment_saved_content_usage', {
      content_id: id
    });

    if (error) {
      // If RPC doesn't exist, fallback to manual increment
      const { data: current, error: fetchError } = await supabase
        .from('saved_content')
        .select('usage_count, user_id')
        .eq('id', id)
        .single();

      if (fetchError || !current || current.user_id !== user.id) {
        return NextResponse.json(
          { error: 'Saved content not found' },
          { status: 404 }
        );
      }

      const { data: updated, error: updateError } = await supabase
        .from('saved_content')
        .update({ usage_count: (current.usage_count || 0) + 1 })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to increment usage count' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updated
      });
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Saved content usage increment error:', error);
    return NextResponse.json(
      {
        error: 'Failed to increment usage count',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
