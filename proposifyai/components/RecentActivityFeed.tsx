'use client';

import { useState, useEffect } from 'react';
import TimelineIcon from '@mui/icons-material/Timeline';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  type: 'created' | 'edited' | 'sent' | 'signed' | 'viewed';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

export default function RecentActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // In real app, fetch from API
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'created',
        title: 'Created new proposal',
        description: 'Website Redesign - Acme Corp',
        timestamp: '2 minutes ago',
        icon: <DescriptionIcon fontSize="small" />,
        color: 'blue'
      },
      {
        id: '2',
        type: 'edited',
        title: 'Edited proposal',
        description: 'Mobile App Development - TechStart',
        timestamp: '15 minutes ago',
        icon: <EditIcon fontSize="small" />,
        color: 'purple'
      },
      {
        id: '3',
        type: 'sent',
        title: 'Sent to client',
        description: 'Marketing Campaign - GrowthCo',
        timestamp: '1 hour ago',
        icon: <SendIcon fontSize="small" />,
        color: 'green'
      },
      {
        id: '4',
        type: 'signed',
        title: 'Proposal signed',
        description: 'Consulting Services - Enterprise LLC',
        timestamp: '3 hours ago',
        icon: <CheckCircleIcon fontSize="small" />,
        color: 'green'
      },
      {
        id: '5',
        type: 'viewed',
        title: 'Client viewed proposal',
        description: 'Cloud Migration - DataCorp',
        timestamp: '5 hours ago',
        icon: <TimelineIcon fontSize="small" />,
        color: 'yellow'
      }
    ];

    setActivities(mockActivities);
  }, []);

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <TimelineIcon className="text-primary-600" />
          Recent Activity
        </h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
          >
            <div className={`p-2 rounded-lg ${getColorClasses(activity.color)}`}>
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {activity.timestamp}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <TimelineIcon className="mx-auto mb-2 text-4xl opacity-20" />
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
}
