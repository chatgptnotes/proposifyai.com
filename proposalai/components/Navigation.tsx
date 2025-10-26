'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import DarkModeToggle from './DarkModeToggle';
import NotificationsDropdown from './NotificationsDropdown';

interface NavigationProps {
  glassmorphism?: boolean;
}

export default function Navigation({ glassmorphism = false }: NavigationProps) {
  const pathname = usePathname();
  const [proposalCount, setProposalCount] = useState(0);

  // In a real app, this would fetch from your API/database
  useEffect(() => {
    // Simulate fetching proposal count
    setProposalCount(24);
  }, []);

  const navClass = glassmorphism
    ? "sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-lg"
    : "bg-white border-b border-gray-200";

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-xl">P</span>
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Proposify AI
              </span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-lg transition-all ${
                  isActive('/dashboard')
                    ? "text-primary-600 font-semibold bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/proposals"
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  isActive('/proposals')
                    ? "text-primary-600 font-semibold bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Proposals
                {proposalCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-gradient-to-r from-primary-600 to-purple-600 rounded-full shadow-sm">
                    {proposalCount}
                  </span>
                )}
              </Link>
              <Link
                href="/templates"
                className={`px-3 py-2 rounded-lg transition-all ${
                  isActive('/templates')
                    ? "text-primary-600 font-semibold bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Templates
              </Link>
              <Link
                href="/settings"
                className={`px-3 py-2 rounded-lg transition-all ${
                  isActive('/settings')
                    ? "text-primary-600 font-semibold bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Settings
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DarkModeToggle />
            <NotificationsDropdown />
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="User profile"
              >
                <span className="text-white font-semibold text-sm">JD</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
