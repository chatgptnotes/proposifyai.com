import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Extract fields that go directly in the profiles table
    const {
      full_name,
      company_name,
      avatar_url,
      // Header customization fields
      header_logo,
      header_client_logo,
      header_show_client_logo,
      header_company_name,
      header_tagline,
      header_bg_color,
      header_text_color,
      header_layout,
      header_show_contact,
      header_contact_phone,
      header_contact_email,
      header_contact_website,
      header_contact_address,
      // Footer customization fields
      footer_text,
      footer_bg_color,
      footer_text_color,
      footer_font_size,
      footer_alignment,
      footer_show_border,
      footer_border_color,
      ...additionalData
    } = body;

    // Get current preferences
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', user.id)
      .single();

    const currentPreferences = currentProfile?.preferences || {};

    // Update profile with direct fields
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Basic profile fields
    if (full_name !== undefined) updateData.full_name = full_name;
    if (company_name !== undefined) updateData.company_name = company_name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    // Header customization fields
    if (header_logo !== undefined) updateData.header_logo = header_logo;
    if (header_client_logo !== undefined) updateData.header_client_logo = header_client_logo;
    if (header_show_client_logo !== undefined) updateData.header_show_client_logo = header_show_client_logo;
    if (header_company_name !== undefined) updateData.header_company_name = header_company_name;
    if (header_tagline !== undefined) updateData.header_tagline = header_tagline;
    if (header_bg_color !== undefined) updateData.header_bg_color = header_bg_color;
    if (header_text_color !== undefined) updateData.header_text_color = header_text_color;
    if (header_layout !== undefined) updateData.header_layout = header_layout;
    if (header_show_contact !== undefined) updateData.header_show_contact = header_show_contact;
    if (header_contact_phone !== undefined) updateData.header_contact_phone = header_contact_phone;
    if (header_contact_email !== undefined) updateData.header_contact_email = header_contact_email;
    if (header_contact_website !== undefined) updateData.header_contact_website = header_contact_website;
    if (header_contact_address !== undefined) updateData.header_contact_address = header_contact_address;

    // Footer customization fields
    if (footer_text !== undefined) updateData.footer_text = footer_text;
    if (footer_bg_color !== undefined) updateData.footer_bg_color = footer_bg_color;
    if (footer_text_color !== undefined) updateData.footer_text_color = footer_text_color;
    if (footer_font_size !== undefined) updateData.footer_font_size = footer_font_size;
    if (footer_alignment !== undefined) updateData.footer_alignment = footer_alignment;
    if (footer_show_border !== undefined) updateData.footer_show_border = footer_show_border;
    if (footer_border_color !== undefined) updateData.footer_border_color = footer_border_color;

    // Merge remaining data into preferences
    if (Object.keys(additionalData).length > 0) {
      updateData.preferences = {
        ...currentPreferences,
        ...additionalData
      };
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: updatedProfile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
