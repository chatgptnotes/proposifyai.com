'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import DarkModeToggle from './DarkModeToggle';
import NotificationsDropdown from './NotificationsDropdown';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LogoutIcon from '@mui/icons-material/Logout';
import { createClient } from '@/lib/supabase/client';

interface NavigationProps {
  glassmorphism?: boolean;
}

interface ProfileData {
  full_name?: string;
  email?: string;
}

export default function Navigation({ glassmorphism = false }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [proposalCount, setProposalCount] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch user profile
  useEffect(() => {
    fetchProfileData();
  }, []);

  // In a real app, this would fetch from your API/database
  useEffect(() => {
    // Simulate fetching proposal count
    setProposalCount(24);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (response.ok && data.data) {
        setProfileData(data.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const getUserInitials = () => {
    if (!profileData?.full_name) {
      // Fallback to email initials if no name
      if (profileData?.email) {
        return profileData.email.substring(0, 2).toUpperCase();
      }
      return "U"; // Ultimate fallback
    }

    const names = profileData.full_name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
    }
  };

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

            {/* Profile Dropdown */}
            <div className="relative" ref={menuRef}>
              <motion.div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={profileData?.full_name || "User profile"}
              >
                <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
              </motion.div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-4 bg-gradient-to-br from-primary-50 to-purple-50 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">{getUserInitials()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {profileData?.full_name || "User"}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {profileData?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link href="/settings">
                        <motion.button
                          onClick={() => setShowProfileMenu(false)}
                          whileHover={{ backgroundColor: '#F3F4F6' }}
                          className="w-full px-4 py-3 flex items-center space-x-3 text-left text-gray-700 hover:bg-gray-100 transition"
                        >
                          <PersonIcon className="text-primary-600" fontSize="small" />
                          <span className="font-medium">Profile Settings</span>
                        </motion.button>
                      </Link>

                      <Link href="/settings?tab=billing">
                        <motion.button
                          onClick={() => setShowProfileMenu(false)}
                          whileHover={{ backgroundColor: '#F3F4F6' }}
                          className="w-full px-4 py-3 flex items-center space-x-3 text-left text-gray-700 hover:bg-gray-100 transition"
                        >
                          <CreditCardIcon className="text-primary-600" fontSize="small" />
                          <span className="font-medium">Billing & Payments</span>
                        </motion.button>
                      </Link>

                      <Link href="/settings?tab=billing">
                        <motion.button
                          onClick={() => setShowProfileMenu(false)}
                          whileHover={{ backgroundColor: '#F3F4F6' }}
                          className="w-full px-4 py-3 flex items-center space-x-3 text-left text-gray-700 hover:bg-gray-100 transition"
                        >
                          <SubscriptionsIcon className="text-primary-600" fontSize="small" />
                          <span className="font-medium">Subscription</span>
                        </motion.button>
                      </Link>

                      <Link href="/settings">
                        <motion.button
                          onClick={() => setShowProfileMenu(false)}
                          whileHover={{ backgroundColor: '#F3F4F6' }}
                          className="w-full px-4 py-3 flex items-center space-x-3 text-left text-gray-700 hover:bg-gray-100 transition"
                        >
                          <SettingsIcon className="text-primary-600" fontSize="small" />
                          <span className="font-medium">Settings</span>
                        </motion.button>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200">
                      <motion.button
                        onClick={handleLogout}
                        whileHover={{ backgroundColor: '#FEE2E2' }}
                        className="w-full px-4 py-3 flex items-center space-x-3 text-left text-red-600 hover:bg-red-50 transition"
                      >
                        <LogoutIcon fontSize="small" />
                        <span className="font-medium">Log Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
