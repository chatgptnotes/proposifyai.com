'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data - would come from Supabase in production
  const analytics = useMemo(() => ({
    overview: {
      totalProposals: 45,
      totalValue: 542000,
      winRate: 42,
      avgDealSize: 45200,
      totalViews: 328,
      avgTimeToClose: 14,
    },
    trends: {
      proposals: { current: 45, previous: 38, change: 18.4 },
      value: { current: 542000, previous: 425000, change: 27.5 },
      winRate: { current: 42, previous: 38, change: 10.5 },
      views: { current: 328, previous: 285, change: 15.1 },
    },
    statusBreakdown: [
      { status: 'Won', count: 19, value: 227800, color: 'from-green-500 to-green-600' },
      { status: 'In Progress', count: 15, value: 180000, color: 'from-blue-500 to-blue-600' },
      { status: 'Lost', count: 8, value: 96200, color: 'from-red-500 to-red-600' },
      { status: 'Draft', count: 3, value: 38000, color: 'from-gray-500 to-gray-600' },
    ],
    topProposals: [
      { title: 'Enterprise Software Solution', client: 'TechCorp', value: 125000, status: 'won', views: 45, engagement: 92 },
      { title: 'Cloud Migration Project', client: 'FinanceInc', value: 98000, status: 'in_progress', views: 38, engagement: 78 },
      { title: 'Mobile App Development', client: 'StartupXYZ', value: 75000, status: 'won', views: 52, engagement: 88 },
      { title: 'AI Integration Platform', client: 'InnovateCo', value: 110000, status: 'in_progress', views: 41, engagement: 82 },
      { title: 'Website Redesign', client: 'RetailPlus', value: 32000, status: 'lost', views: 28, engagement: 54 },
    ],
    engagementMetrics: [
      { metric: 'Avg Views per Proposal', value: 7.3, trend: 'up', change: 12 },
      { metric: 'Avg Time on Proposal', value: '8:45', trend: 'up', change: 8 },
      { metric: 'Email Open Rate', value: '68%', trend: 'up', change: 5 },
      { metric: 'Proposal Download Rate', value: '45%', trend: 'down', change: -3 },
    ],
  }), []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const TrendIndicator = ({ change }: { change: number }) => {
    const isPositive = change >= 0;
    return (
      <div className={`flex items-center gap-1 text-sm font-semibold ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation glassmorphism={true} />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Breadcrumbs />

        {/* Header */}
        <motion.div className="mb-8 flex items-center justify-between" variants={itemVariants}>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-purple-800 bg-clip-text text-transparent dark:from-gray-100 dark:via-primary-400 dark:to-purple-400">
              Analytics & Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Track your proposal performance and make data-driven decisions
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {['7d', '30d', '90d', 'All'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          {[
            {
              label: 'Total Proposals',
              value: analytics.overview.totalProposals,
              icon: AnalyticsIcon,
              color: 'from-blue-500 to-blue-600',
              trend: analytics.trends.proposals.change,
            },
            {
              label: 'Total Value',
              value: formatCurrency(analytics.overview.totalValue),
              icon: AttachMoneyIcon,
              color: 'from-green-500 to-green-600',
              trend: analytics.trends.value.change,
            },
            {
              label: 'Win Rate',
              value: `${analytics.overview.winRate}%`,
              icon: CheckCircleIcon,
              color: 'from-purple-500 to-purple-600',
              trend: analytics.trends.winRate.change,
            },
            {
              label: 'Total Views',
              value: analytics.overview.totalViews,
              icon: VisibilityIcon,
              color: 'from-orange-500 to-orange-600',
              trend: analytics.trends.views.change,
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <Icon className="text-white" fontSize="small" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                  <TrendIndicator change={stat.trend} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Status Breakdown & Top Proposals */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Status Breakdown */}
          <motion.div
            className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <AnalyticsIcon className="text-primary-600 dark:text-primary-400" />
              Proposal Status Breakdown
            </h3>
            <div className="space-y-4">
              {analytics.statusBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {item.status}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.count} proposals
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${(item.count / analytics.overview.totalProposals) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Engagement Metrics */}
          <motion.div
            className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <PeopleIcon className="text-primary-600 dark:text-primary-400" />
              Engagement Metrics
            </h3>
            <div className="space-y-4">
              {analytics.engagementMetrics.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {item.metric}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {item.value}
                    </p>
                  </div>
                  <TrendIndicator change={item.change} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Performing Proposals */}
        <motion.div
          className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
          variants={itemVariants}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUpIcon className="text-primary-600 dark:text-primary-400" />
              Top Performing Proposals
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Proposal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {analytics.topProposals.map((proposal, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {proposal.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {proposal.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(proposal.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        proposal.status === 'won'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : proposal.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {proposal.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {proposal.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                            style={{ width: `${proposal.engagement}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {proposal.engagement}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
