// Get Proposal Analytics
// GET /api/proposals/[id]/analytics

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verify ownership
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id, user_id, view_count, last_viewed_at, status, created_at')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    // Get view analytics
    const { data: views, error: viewsError } = await supabase
      .from('proposal_views')
      .select('*')
      .eq('proposal_id', id)
      .order('viewed_at', { ascending: false });

    if (viewsError) {
      console.error('Error fetching views:', viewsError);
    }

    // Get action history (accepts, rejects, downloads, shares)
    const { data: actions, error: actionsError } = await supabase
      .from('proposal_actions')
      .select('*')
      .eq('proposal_id', id)
      .order('created_at', { ascending: false });

    if (actionsError) {
      console.error('Error fetching actions:', actionsError);
    }

    // Calculate analytics
    const totalViews = views?.length || 0;
    const uniqueViews = views?.filter((v) => v.is_unique_view).length || 0;

    // Device breakdown
    const deviceCounts = views?.reduce((acc: Record<string, number>, view) => {
      const device = view.viewer_device?.type || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {}) || {};

    // Browser breakdown
    const browserCounts = views?.reduce((acc: Record<string, number>, view) => {
      const browser = view.viewer_device?.browser || 'unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {}) || {};

    // Action breakdown
    const actionCounts = actions?.reduce((acc: Record<string, number>, action) => {
      acc[action.action_type] = (acc[action.action_type] || 0) + 1;
      return acc;
    }, {}) || {};

    // Average time spent (if available)
    const timeSpentData = views?.filter((v) => v.time_spent_seconds) || [];
    const avgTimeSpent = timeSpentData.length > 0
      ? timeSpentData.reduce((sum, v) => sum + (v.time_spent_seconds || 0), 0) / timeSpentData.length
      : 0;

    // Recent views (last 10)
    const recentViews = views?.slice(0, 10).map((view) => ({
      id: view.id,
      viewedAt: view.viewed_at,
      device: view.viewer_device?.type || 'unknown',
      browser: view.viewer_device?.browser || 'unknown',
      timeSpent: view.time_spent_seconds,
      location: view.viewer_location,
    })) || [];

    // Timeline data (views per day for the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const viewsByDay = views?.reduce((acc: Record<string, number>, view) => {
      const date = new Date(view.viewed_at).toISOString().split('T')[0];
      if (new Date(view.viewed_at) >= thirtyDaysAgo) {
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {}) || {};

    return NextResponse.json({
      proposal: {
        id: proposal.id,
        status: proposal.status,
        createdAt: proposal.created_at,
        lastViewedAt: proposal.last_viewed_at,
      },
      overview: {
        totalViews,
        uniqueViews,
        avgTimeSpent: Math.round(avgTimeSpent),
        viewCount: proposal.view_count,
      },
      devices: deviceCounts,
      browsers: browserCounts,
      actions: actionCounts,
      recentViews,
      timeline: viewsByDay,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
