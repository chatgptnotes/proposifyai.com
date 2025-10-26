import { Database } from '@/lib/database.types';

type Proposal = Database['public']['Tables']['proposals']['Row'];
type ProposalView = Database['public']['Tables']['proposal_views']['Row'];
type ProposalTracking = Database['public']['Tables']['proposal_tracking']['Row'];

export interface AnalyticsMetrics {
  totalProposals: number;
  proposalsSent: number;
  winRate: number;
  avgDealSize: number;
  totalRevenue: number;
  avgTimeToClose: number;
  viewRate: number;
  avgTimeSpent: number;
}

export interface ProposalsByStatus {
  draft: number;
  sent: number;
  viewed: number;
  accepted: number;
  rejected: number;
}

export interface TimeSeriesData {
  date: string;
  count: number;
  revenue?: number;
}

export interface SectionEngagement {
  sectionId: string;
  sectionTitle: string;
  views: number;
  avgTimeSpent: number;
  scrollDepth: number;
}

export function calculateWinRate(proposals: Proposal[]): number {
  const sentProposals = proposals.filter(p => p.status !== 'draft');
  if (sentProposals.length === 0) return 0;

  const wonProposals = sentProposals.filter(p => p.status === 'accepted');
  return Math.round((wonProposals.length / sentProposals.length) * 100);
}

export function calculateAvgDealSize(proposals: Proposal[]): number {
  const wonProposals = proposals.filter(p => p.status === 'accepted');
  if (wonProposals.length === 0) return 0;

  const totalRevenue = wonProposals.reduce((sum, p) => {
    const metadata = p.metadata as any;
    return sum + (metadata?.dealSize || 0);
  }, 0);

  return Math.round(totalRevenue / wonProposals.length);
}

export function calculateTotalRevenue(proposals: Proposal[]): number {
  const wonProposals = proposals.filter(p => p.status === 'accepted');

  return wonProposals.reduce((sum, p) => {
    const metadata = p.metadata as any;
    return sum + (metadata?.dealSize || 0);
  }, 0);
}

export function calculateAvgTimeToClose(proposals: Proposal[]): number {
  const closedProposals = proposals.filter(
    p => (p.status === 'accepted' || p.status === 'rejected') && p.sent_at
  );

  if (closedProposals.length === 0) return 0;

  const totalDays = closedProposals.reduce((sum, p) => {
    const sentDate = new Date(p.sent_at!);
    const closedDate = new Date(p.updated_at);
    const days = Math.floor((closedDate.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  return Math.round(totalDays / closedProposals.length);
}

export function calculateViewRate(
  proposals: Proposal[],
  views: ProposalView[]
): number {
  const sentProposals = proposals.filter(p => p.status !== 'draft');
  if (sentProposals.length === 0) return 0;

  const viewedProposalIds = new Set(views.map(v => v.proposal_id));
  const viewedCount = sentProposals.filter(p => viewedProposalIds.has(p.id)).length;

  return Math.round((viewedCount / sentProposals.length) * 100);
}

export function calculateAvgTimeSpent(views: ProposalView[]): number {
  if (views.length === 0) return 0;

  const totalSeconds = views.reduce((sum, v) => sum + (v.time_spent || 0), 0);
  return Math.round(totalSeconds / views.length);
}

export function groupProposalsByStatus(proposals: Proposal[]): ProposalsByStatus {
  return proposals.reduce((acc, proposal) => {
    const status = proposal.status as keyof ProposalsByStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {
    draft: 0,
    sent: 0,
    viewed: 0,
    accepted: 0,
    rejected: 0,
  } as ProposalsByStatus);
}

export function generateTimeSeriesData(
  proposals: Proposal[],
  dateField: 'created_at' | 'sent_at' | 'updated_at',
  interval: 'day' | 'week' | 'month',
  includeRevenue: boolean = false
): TimeSeriesData[] {
  const groupedData = new Map<string, { count: number; revenue: number }>();

  proposals.forEach(proposal => {
    const date = proposal[dateField];
    if (!date) return;

    const key = formatDateKey(new Date(date), interval);
    const current = groupedData.get(key) || { count: 0, revenue: 0 };

    current.count += 1;
    if (includeRevenue && proposal.status === 'accepted') {
      const metadata = proposal.metadata as any;
      current.revenue += metadata?.dealSize || 0;
    }

    groupedData.set(key, current);
  });

  return Array.from(groupedData.entries())
    .map(([date, data]) => ({
      date,
      count: data.count,
      ...(includeRevenue && { revenue: data.revenue }),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateSectionEngagement(
  tracking: ProposalTracking[]
): SectionEngagement[] {
  const sectionMap = new Map<string, {
    title: string;
    views: number;
    totalTime: number;
    totalScrollDepth: number;
  }>();

  tracking.forEach(t => {
    const eventData = t.event_data as any;
    const sectionId = eventData?.sectionId || eventData?.section_id;

    if (t.event_type === 'section_view' && sectionId) {
      const current = sectionMap.get(sectionId) || {
        title: eventData?.sectionTitle || eventData?.section_title || sectionId,
        views: 0,
        totalTime: 0,
        totalScrollDepth: 0,
      };

      current.views += 1;
      current.totalTime += eventData?.timeSpent || 0;
      current.totalScrollDepth += eventData?.scrollDepth || 0;

      sectionMap.set(sectionId, current);
    }
  });

  return Array.from(sectionMap.entries())
    .map(([sectionId, data]) => ({
      sectionId,
      sectionTitle: data.title,
      views: data.views,
      avgTimeSpent: data.views > 0 ? Math.round(data.totalTime / data.views) : 0,
      scrollDepth: data.views > 0 ? Math.round(data.totalScrollDepth / data.views) : 0,
    }))
    .sort((a, b) => b.views - a.views);
}

export function calculateEngagementScore(
  views: ProposalView[],
  tracking: ProposalTracking[]
): number {
  if (views.length === 0) return 0;

  const avgTimeSpent = calculateAvgTimeSpent(views);
  const avgScrollDepth = tracking.reduce((sum, t) => {
    const eventData = t.event_data as any;
    return sum + (eventData?.scrollDepth || 0);
  }, 0) / (tracking.length || 1);

  const timeScore = Math.min(avgTimeSpent / 300, 1) * 50;
  const scrollScore = (avgScrollDepth / 100) * 50;

  return Math.round(timeScore + scrollScore);
}

export function getTopPerformingProposals(
  proposals: Proposal[],
  views: ProposalView[],
  limit: number = 5
): Array<Proposal & { viewCount: number; avgTimeSpent: number }> {
  const proposalStats = proposals.map(proposal => {
    const proposalViews = views.filter(v => v.proposal_id === proposal.id);
    return {
      ...proposal,
      viewCount: proposalViews.length,
      avgTimeSpent: calculateAvgTimeSpent(proposalViews),
    };
  });

  return proposalStats
    .sort((a, b) => {
      const scoreA = a.viewCount * 10 + a.avgTimeSpent / 60;
      const scoreB = b.viewCount * 10 + b.avgTimeSpent / 60;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

function formatDateKey(date: Date, interval: 'day' | 'week' | 'month'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  switch (interval) {
    case 'day':
      return `${year}-${month}-${day}`;
    case 'week':
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      return formatDateKey(weekStart, 'day');
    case 'month':
      return `${year}-${month}`;
  }
}

export function calculateConversionFunnel(proposals: Proposal[]): {
  stage: string;
  count: number;
  percentage: number;
}[] {
  const total = proposals.length;
  const sent = proposals.filter(p => p.status !== 'draft').length;
  const viewed = proposals.filter(p => p.status === 'viewed' || p.status === 'accepted' || p.status === 'rejected').length;
  const accepted = proposals.filter(p => p.status === 'accepted').length;

  return [
    { stage: 'Created', count: total, percentage: 100 },
    { stage: 'Sent', count: sent, percentage: total > 0 ? Math.round((sent / total) * 100) : 0 },
    { stage: 'Viewed', count: viewed, percentage: total > 0 ? Math.round((viewed / total) * 100) : 0 },
    { stage: 'Accepted', count: accepted, percentage: total > 0 ? Math.round((accepted / total) * 100) : 0 },
  ];
}
