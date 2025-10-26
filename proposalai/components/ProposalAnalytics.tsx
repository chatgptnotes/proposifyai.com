'use client';

// Proposal Analytics Component
// Displays engagement metrics and analytics for a proposal

import React, { useState, useEffect } from 'react';
import {
  Eye,
  Users,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  XCircle,
  Download,
  Share2,
  TrendingUp,
  Calendar,
} from 'lucide-react';

interface ProposalAnalyticsProps {
  proposalId: string;
  className?: string;
}

interface AnalyticsData {
  proposal: {
    id: string;
    status: string;
    createdAt: string;
    lastViewedAt?: string;
  };
  overview: {
    totalViews: number;
    uniqueViews: number;
    avgTimeSpent: number;
    viewCount: number;
  };
  devices: Record<string, number>;
  browsers: Record<string, number>;
  actions: Record<string, number>;
  recentViews: Array<{
    id: string;
    viewedAt: string;
    device: string;
    browser: string;
    timeSpent?: number;
  }>;
  timeline: Record<string, number>;
}

export default function ProposalAnalytics({
  proposalId,
  className = '',
}: ProposalAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}/analytics`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data);
      setError('');
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 ${className}`}>
        <p className="text-red-600">{error || 'Failed to load analytics'}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>Auto-refreshing</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          icon={<Eye className="w-6 h-6 text-blue-600" />}
          label="Total Views"
          value={analytics.overview.totalViews}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-green-600" />}
          label="Unique Viewers"
          value={analytics.overview.uniqueViews}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          label="Avg Time Spent"
          value={formatTime(analytics.overview.avgTimeSpent)}
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-orange-600" />}
          label="Last Viewed"
          value={
            analytics.proposal.lastViewedAt
              ? new Date(analytics.proposal.lastViewedAt).toLocaleDateString()
              : 'Never'
          }
          bgColor="bg-orange-50"
        />
      </div>

      {/* Actions */}
      {Object.keys(analytics.actions).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {analytics.actions.accepted && (
              <ActionStat
                icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                label="Accepted"
                count={analytics.actions.accepted}
              />
            )}
            {analytics.actions.rejected && (
              <ActionStat
                icon={<XCircle className="w-5 h-5 text-red-600" />}
                label="Rejected"
                count={analytics.actions.rejected}
              />
            )}
            {analytics.actions.downloaded && (
              <ActionStat
                icon={<Download className="w-5 h-5 text-blue-600" />}
                label="Downloaded"
                count={analytics.actions.downloaded}
              />
            )}
            {analytics.actions.shared && (
              <ActionStat
                icon={<Share2 className="w-5 h-5 text-purple-600" />}
                label="Shared"
                count={analytics.actions.shared}
              />
            )}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Devices */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Devices</h3>
          <div className="space-y-3">
            {Object.entries(analytics.devices).map(([device, count]) => (
              <div key={device} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getDeviceIcon(device)}
                  <span className="text-sm text-gray-700 capitalize">{device}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / analytics.overview.totalViews) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browsers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
          <div className="space-y-3">
            {Object.entries(analytics.browsers).map(([browser, count]) => (
              <div key={browser} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{browser}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(count / analytics.overview.totalViews) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Views */}
      {analytics.recentViews.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Views</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Device
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Browser
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time Spent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.recentViews.map((view) => (
                  <tr key={view.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(view.viewedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(view.device)}
                        <span className="capitalize">{view.device}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{view.browser}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {view.timeSpent ? formatTime(view.timeSpent) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timeline Chart */}
      {Object.keys(analytics.timeline).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Timeline (Last 30 Days)</h3>
          <div className="flex items-end space-x-1 h-48">
            {Object.entries(analytics.timeline)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, count]) => {
                const maxCount = Math.max(...Object.values(analytics.timeline));
                const height = (count / maxCount) * 100;
                return (
                  <div
                    key={date}
                    className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors relative group"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {new Date(date).toLocaleDateString()}: {count} views
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for stat cards
function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

// Helper component for action stats
function ActionStat({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
      {icon}
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-lg font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );
}
