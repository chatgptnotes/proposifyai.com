import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  calculateWinRate,
  calculateAvgDealSize,
  calculateTotalRevenue,
  calculateAvgTimeToClose,
  calculateViewRate,
  calculateAvgTimeSpent,
  groupProposalsByStatus,
  generateTimeSeriesData,
  calculateSectionEngagement,
  calculateConversionFunnel,
} from '@/lib/analytics/calculations';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const interval = (searchParams.get('interval') || 'day') as 'day' | 'week' | 'month';

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Workspace ID required' },
        { status: 400 }
      );
    }

    const { data: member } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single();

    if (!member) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    let proposalsQuery = supabase
      .from('proposals')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (startDate) {
      proposalsQuery = proposalsQuery.gte('created_at', startDate);
    }
    if (endDate) {
      proposalsQuery = proposalsQuery.lte('created_at', endDate);
    }

    const { data: proposals, error: proposalsError } = await proposalsQuery;

    if (proposalsError) throw proposalsError;

    const proposalIds = proposals?.map(p => p.id) || [];

    const [
      { data: views },
      { data: tracking },
    ] = await Promise.all([
      supabase
        .from('proposal_views')
        .select('*')
        .in('proposal_id', proposalIds),
      supabase
        .from('proposal_tracking')
        .select('*')
        .in('proposal_id', proposalIds),
    ]);

    const metrics = {
      totalProposals: proposals?.length || 0,
      proposalsSent: proposals?.filter(p => p.status !== 'draft').length || 0,
      winRate: calculateWinRate(proposals || []),
      avgDealSize: calculateAvgDealSize(proposals || []),
      totalRevenue: calculateTotalRevenue(proposals || []),
      avgTimeToClose: calculateAvgTimeToClose(proposals || []),
      viewRate: calculateViewRate(proposals || [], views || []),
      avgTimeSpent: calculateAvgTimeSpent(views || []),
    };

    const proposalsByStatus = groupProposalsByStatus(proposals || []);

    const proposalsOverTime = generateTimeSeriesData(
      proposals || [],
      'created_at',
      interval
    );

    const revenueOverTime = generateTimeSeriesData(
      proposals || [],
      'updated_at',
      interval,
      true
    );

    const sectionEngagement = calculateSectionEngagement(tracking || []);

    const conversionFunnel = calculateConversionFunnel(proposals || []);

    const recentActivity = tracking
      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20);

    return NextResponse.json({
      metrics,
      proposalsByStatus,
      proposalsOverTime,
      revenueOverTime,
      sectionEngagement,
      conversionFunnel,
      recentActivity,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
