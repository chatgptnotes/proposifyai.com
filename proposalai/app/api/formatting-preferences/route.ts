import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch formatting preferences
// Query params: ?proposal_id=xxx (for proposal-specific) or none (for company defaults)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get('proposal_id');

    let query = supabase
      .from('formatting_preferences')
      .select('*')
      .eq('user_id', user.id);

    if (proposalId) {
      // Fetch proposal-specific preferences
      query = query.eq('proposal_id', proposalId);
    } else {
      // Fetch company defaults
      query = query.eq('is_company_default', true);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching formatting preferences:', error);
      return NextResponse.json(
        { error: 'Failed to fetch formatting preferences' },
        { status: 500 }
      );
    }

    // If no preferences exist, return default values
    if (!data) {
      return NextResponse.json({
        success: true,
        data: null, // Client should use default values
        message: 'No preferences found, using defaults'
      });
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Formatting preferences GET error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch formatting preferences',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create or update formatting preferences
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
    const { proposal_id, ...preferences } = body;

    // Determine if this is company default or proposal-specific
    const isCompanyDefault = !proposal_id;

    // Check if preferences already exist
    let query = supabase
      .from('formatting_preferences')
      .select('id')
      .eq('user_id', user.id);

    if (proposal_id) {
      query = query.eq('proposal_id', proposal_id);
    } else {
      query = query.eq('is_company_default', true);
    }

    const { data: existing } = await query.single();

    if (existing) {
      // Update existing preferences
      const { data, error } = await supabase
        .from('formatting_preferences')
        .update({
          ...preferences,
          is_company_default: isCompanyDefault,
          proposal_id: proposal_id || null
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating formatting preferences:', error);
        return NextResponse.json(
          { error: 'Failed to update formatting preferences' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data,
        message: 'Formatting preferences updated successfully'
      });
    } else {
      // Create new preferences
      const { data, error } = await supabase
        .from('formatting_preferences')
        .insert({
          user_id: user.id,
          ...preferences,
          is_company_default: isCompanyDefault,
          proposal_id: proposal_id || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating formatting preferences:', error);
        return NextResponse.json(
          { error: 'Failed to create formatting preferences' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data,
        message: 'Formatting preferences created successfully'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Formatting preferences POST error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save formatting preferences',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Reset to defaults (delete custom preferences)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get('proposal_id');

    if (!proposalId) {
      return NextResponse.json(
        { error: 'Cannot delete company default preferences' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('formatting_preferences')
      .delete()
      .eq('user_id', user.id)
      .eq('proposal_id', proposalId);

    if (error) {
      console.error('Error deleting formatting preferences:', error);
      return NextResponse.json(
        { error: 'Failed to delete formatting preferences' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Formatting preferences reset to company defaults'
    });
  } catch (error) {
    console.error('Formatting preferences DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete formatting preferences',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
