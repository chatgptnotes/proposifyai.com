'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import TemplateIcon from '@mui/icons-material/InsertDriveFile';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

export default function QuickActionsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const quickActions: QuickAction[] = [
    {
      id: 'new-proposal',
      label: 'New Proposal',
      icon: <DescriptionIcon fontSize="small" />,
      action: () => {
        router.push('/proposals/new');
        setIsOpen(false);
      },
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'new-template',
      label: 'New Template',
      icon: <TemplateIcon fontSize="small" />,
      action: () => {
        router.push('/templates/new');
        setIsOpen(false);
      },
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      icon: <AnalyticsIcon fontSize="small" />,
      action: () => {
        router.push('/analytics');
        setIsOpen(false);
      },
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'settings',
      label: 'Quick Settings',
      icon: <SettingsIcon fontSize="small" />,
      action: () => {
        router.push('/settings');
        setIsOpen(false);
      },
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpIcon fontSize="small" />,
      action: () => {
        router.push('/help');
        setIsOpen(false);
      },
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 right-0 space-y-3 mb-2"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onClick={action.action}
                className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all group w-full"
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} shadow-md`}>
                  <span className="text-white">{action.icon}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isOpen
            ? 'bg-gradient-to-br from-red-500 to-red-600'
            : 'bg-gradient-to-br from-primary-600 to-purple-600'
        }`}
        whileHover={{ scale: 1.1, rotate: isOpen ? 0 : 90 }}
        whileTap={{ scale: 0.9 }}
        title={isOpen ? 'Close quick actions' : 'Open quick actions'}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <CloseIcon className="text-white" fontSize="large" />
          ) : (
            <AddIcon className="text-white" fontSize="large" />
          )}
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
