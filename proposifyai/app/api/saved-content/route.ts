import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch all saved content for the current user
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
    const category = searchParams.get('category');

    let query = supabase
      .from('saved_content')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching saved content:', error);
      return NextResponse.json(
        { error: 'Failed to fetch saved content' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Saved content GET error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch saved content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new saved content
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
    const { title, content, category, metadata, is_favorite } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, and category are required' },
        { status: 400 }
      );
    }

    const validCategories = ['bank_details', 'company_info', 'payment_terms', 'standard_clause', 'image'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    // Log content size for debugging
    const contentSize = content.length;
    console.log(`Saving content - Category: ${category}, Title: ${title}, Size: ${(contentSize / 1024).toFixed(1)}KB`);

    const { data, error } = await supabase
      .from('saved_content')
      .insert({
        user_id: user.id,
        title,
        content,
        category,
        metadata: metadata || {},
        is_favorite: is_favorite || false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating saved content:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json(
        {
          error: 'Failed to create saved content',
          details: error.message,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    }, { status: 201 });
  } catch (error) {
    console.error('Saved content POST error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create saved content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
