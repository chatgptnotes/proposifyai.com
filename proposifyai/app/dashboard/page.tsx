"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PendingIcon from '@mui/icons-material/Pending';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import RecentActivityFeed from '@/components/RecentActivityFeed';
import SettingsConfigModal from '@/components/SettingsConfigModal';

interface ProfileData {
  full_name?: string;
  email?: string;
  company_name?: string;
  avatar_url?: string;
  preferences?: any;
}

export default function DashboardPage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (response.ok && data.data) {
        setProfileData(data.data);

        // Check if essential settings are configured
        const hasEssentialSettings =
          data.data.full_name &&
          data.data.company_name &&
          data.data.preferences?.website;

        setShowSettingsModal(!hasEssentialSettings);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayName = () => {
    if (!profileData?.full_name) return "there";
    return profileData.full_name.split(' ')[0]; // Return first name
  };
  // Sample data - will be replaced with real data from Supabase
  const stats = [
    {
      label: "Total Proposals",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: DescriptionIcon,
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "Win Rate",
      value: "42%",
      change: "+8%",
      trend: "up",
      icon: CheckCircleIcon,
      color: "from-green-500 to-green-600"
    },
    {
      label: "Avg Deal Size",
      value: "$45K",
      change: "+15%",
      trend: "up",
      icon: AutoGraphIcon,
      color: "from-purple-500 to-purple-600"
    },
    {
      label: "Open Proposals",
      value: "8",
      change: "-2",
      trend: "down",
      icon: PendingIcon,
      color: "from-orange-500 to-orange-600"
    },
  ];

  const recentProposals = [
    {
      id: 1,
      title: "Website Redesign - Acme Corp",
      client: "Acme Corporation",
      value: "$50,000",
      status: "opened",
      lastViewed: "2 hours ago",
    },
    {
      id: 2,
      title: "Mobile App Development - TechStart",
      client: "TechStart Inc",
      value: "$120,000",
      status: "signed",
      lastViewed: "1 day ago",
    },
    {
      id: 3,
      title: "Marketing Campaign - GrowthCo",
      client: "GrowthCo",
      value: "$35,000",
      status: "draft",
      lastViewed: "3 days ago",
    },
    {
      id: 4,
      title: "Consulting Services - Enterprise LLC",
      client: "Enterprise LLC",
      value: "$80,000",
      status: "sent",
      lastViewed: "5 days ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
      case "sent":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "opened":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
      case "signed":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation with glassmorphism */}
      <Navigation glassmorphism={true} />

      {/* Main Content */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Settings Configuration Modal */}
        <SettingsConfigModal
          showModal={showSettingsModal && !loading}
          onClose={() => setShowSettingsModal(false)}
        />

        {/* Header with gradient */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-purple-800 bg-clip-text text-transparent">
            Welcome back, {loading ? "..." : getUserDisplayName()}!
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Here&apos;s what&apos;s happening with your proposals today</p>
        </motion.div>

        {/* Quick Actions with modern button */}
        <motion.div className="mb-8" variants={itemVariants}>
          <Link href="/proposals/new">
            <motion.button
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <AddIcon className="mr-2" />
              Create New Proposal
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Grid with glassmorphism */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="backdrop-blur-lg bg-white/60 rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all cursor-pointer"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <Icon className="text-white" fontSize="small" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <motion.span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${
                      stat.trend === "up"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {stat.change}
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Proposals with hover effects */}
        <motion.div
          className="backdrop-blur-lg bg-white/60 rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          variants={itemVariants}
        >
          <div className="px-6 py-5 border-b border-gray-200/50 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-transparent">
            <h2 className="text-2xl font-bold text-gray-900">Recent Proposals</h2>
            <Link
              href="/proposals"
              className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1 group"
            >
              View all
              <motion.span
                className="inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </Link>
          </div>
          <div className="divide-y divide-gray-200/50">
            {recentProposals.map((proposal, index) => (
              <Link
                key={proposal.id}
                href={`/proposals/${proposal.id}`}
              >
                <motion.div
                  className="block px-6 py-5 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-purple-50/50 transition-all cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{proposal.title}</h3>
                      <p className="text-sm text-gray-600">{proposal.client}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                          {proposal.value}
                        </p>
                        <p className="text-xs text-gray-500">{proposal.lastViewed}</p>
                      </div>
                      <motion.span
                        className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${getStatusColor(
                          proposal.status
                        )}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </motion.span>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          className="mt-8 grid md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <RecentActivityFeed />
          </motion.div>

          {/* AI Insights with enhanced glassmorphism */}
          <motion.div
            className="backdrop-blur-xl bg-gradient-to-br from-primary-50/80 via-purple-50/80 to-pink-50/80 rounded-2xl shadow-xl p-6 border border-white/30"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <LightbulbIcon className="text-yellow-600" fontSize="large" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
            </div>
            <div className="space-y-4">
              {[
                { icon: LightbulbIcon, color: "text-yellow-600", text: "Your proposals with case studies have 45% higher win rate" },
                { icon: AccessTimeIcon, color: "text-blue-600", text: "Best time to follow up with Acme Corp: Tomorrow at 10 AM" },
                { icon: TrendingUpIcon, color: "text-green-600", text: "Your average deal size increased by 23% this month" }
              ].map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={index}
                    className="backdrop-blur-md bg-white/90 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <p className="text-sm text-gray-900 flex items-start gap-3">
                      <Icon className={`${insight.color} flex-shrink-0 mt-0.5`} fontSize="small" />
                      <span className="flex-1">{insight.text}</span>
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
