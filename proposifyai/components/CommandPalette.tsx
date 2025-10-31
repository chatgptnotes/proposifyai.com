'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import StyleIcon from '@mui/icons-material/Style';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { motion, AnimatePresence } from 'framer-motion';

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const commands: Command[] = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      subtitle: 'View your overview',
      icon: <DashboardIcon fontSize="small" />,
      action: () => router.push('/dashboard'),
      keywords: ['home', 'overview']
    },
    {
      id: 'proposals',
      title: 'View All Proposals',
      subtitle: 'See your proposals list',
      icon: <DescriptionIcon fontSize="small" />,
      action: () => router.push('/proposals'),
      keywords: ['list', 'all']
    },
    {
      id: 'new-proposal',
      title: 'Create New Proposal',
      subtitle: 'Start a new proposal',
      icon: <AddCircleIcon fontSize="small" />,
      action: () => router.push('/proposals/new'),
      keywords: ['create', 'add', 'new']
    },
    {
      id: 'templates',
      title: 'Browse Templates',
      subtitle: 'View proposal templates',
      icon: <StyleIcon fontSize="small" />,
      action: () => router.push('/templates'),
      keywords: ['browse', 'view']
    },
    {
      id: 'settings',
      title: 'Open Settings',
      subtitle: 'Manage your preferences',
      icon: <SettingsIcon fontSize="small" />,
      action: () => router.push('/settings'),
      keywords: ['preferences', 'config']
    },
    {
      id: 'shortcuts',
      title: 'View Keyboard Shortcuts',
      subtitle: 'See all shortcuts',
      icon: <KeyboardIcon fontSize="small" />,
      action: () => {
        setIsOpen(false);
        // Trigger keyboard shortcuts modal by pressing ?
        const event = new KeyboardEvent('keydown', { key: '?' });
        window.dispatchEvent(event);
      },
      keywords: ['help', 'keys']
    }
  ];

  const filteredCommands = search
    ? commands.filter(cmd =>
        cmd.title.toLowerCase().includes(search.toLowerCase()) ||
        cmd.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
        cmd.keywords?.some(k => k.toLowerCase().includes(search.toLowerCase()))
      )
    : commands;

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setSearch('');
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  }, []);

  const executeCommand = useCallback((command: Command) => {
    command.action();
    handleClose();
  }, [handleClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          handleOpen();
        }
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }

      // Arrow navigation when open
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        }
        if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault();
          executeCommand(filteredCommands[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, handleOpen, handleClose, executeCommand]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={handleClose}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[20%] left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
              <SearchIcon className="text-gray-400" />
              <input
                type="text"
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
                autoFocus
              />
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No commands found
                </div>
              ) : (
                filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => executeCommand(command)}
                    className={`w-full flex items-center gap-4 p-4 transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      index === selectedIndex
                        ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {command.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {command.title}
                      </div>
                      {command.subtitle && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {command.subtitle}
                        </div>
                      )}
                    </div>
                    {index === selectedIndex && (
                      <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                        Enter
                      </kbd>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">Enter</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">Esc</kbd>
                  Close
                </span>
              </div>
              <span>Press <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">⌘K</kbd> to toggle</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
