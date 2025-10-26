import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  calculateAvgTimeSpent,
  calculateSectionEngagement,
  calculateEngagementScore,
} from '@/lib/analytics/calculations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const proposalId = params.id;

    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('*, workspace_id')
      .eq('id', proposalId)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    const { data: member } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', proposal.workspace_id)
      .eq('user_id', user.id)
      .single();

    if (!member) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const [
      { data: views },
      { data: tracking },
    ] = await Promise.all([
      supabase
        .from('proposal_views')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: false }),
      supabase
        .from('proposal_tracking')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: false }),
    ]);

    const totalViews = views?.length || 0;
    const uniqueViewers = new Set(views?.map(v => v.viewer_ip)).size;
    const avgTimeSpent = calculateAvgTimeSpent(views || []);
    const sectionEngagement = calculateSectionEngagement(tracking || []);
    const engagementScore = calculateEngagementScore(views || [], tracking || []);

    const maxScrollDepth = tracking?.reduce((max, t) => {
      const eventData = t.event_data as any;
      const depth = eventData?.scrollDepth || 0;
      return Math.max(max, depth);
    }, 0) || 0;

    const clickEvents = tracking?.filter(t => t.event_type === 'click') || [];
    const downloadEvents = tracking?.filter(t => t.event_type === 'download') || [];

    const viewTimeline = views?.map(view => ({
      id: view.id,
      viewedAt: view.created_at,
      lastViewedAt: view.last_viewed_at,
      timeSpent: view.time_spent,
      viewerIp: view.viewer_ip,
      userAgent: view.user_agent,
      sessionId: view.session_id,
    })) || [];

    const activityTimeline = tracking?.map(event => ({
      id: event.id,
      timestamp: event.created_at,
      eventType: event.event_type,
      eventData: event.event_data,
      sessionId: event.session_id,
    })) || [];

    const deviceBreakdown = views?.reduce((acc, view) => {
      const ua = view.user_agent.toLowerCase();
      let device = 'Desktop';
      if (/mobile/.test(ua)) device = 'Mobile';
      if (/tablet|ipad/.test(ua)) device = 'Tablet';

      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const browserBreakdown = views?.reduce((acc, view) => {
      const ua = view.user_agent.toLowerCase();
      let browser = 'Other';
      if (/chrome/.test(ua) && !/edg/.test(ua)) browser = 'Chrome';
      else if (/firefox/.test(ua)) browser = 'Firefox';
      else if (/safari/.test(ua) && !/chrome/.test(ua)) browser = 'Safari';
      else if (/edg/.test(ua)) browser = 'Edge';

      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const hourlyActivity = tracking?.reduce((acc, event) => {
      const hour = new Date(event.created_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>) || {};

    return NextResponse.json({
      summary: {
        totalViews,
        uniqueViewers,
        avgTimeSpent,
        engagementScore,
        maxScrollDepth,
        totalClicks: clickEvents.length,
        totalDownloads: downloadEvents.length,
      },
      sectionEngagement,
      viewTimeline,
      activityTimeline,
      deviceBreakdown,
      browserBreakdown,
      hourlyActivity,
      clickEvents: clickEvents.map(e => ({
        timestamp: e.created_at,
        data: e.event_data,
      })),
      downloadEvents: downloadEvents.map(e => ({
        timestamp: e.created_at,
        data: e.event_data,
      })),
    });
  } catch (error) {
    console.error('Proposal analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal analytics' },
      { status: 500 }
    );
  }
}
