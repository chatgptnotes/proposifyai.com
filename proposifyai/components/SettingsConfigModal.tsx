'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import PaletteIcon from '@mui/icons-material/Palette';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';

interface SettingsConfigModalProps {
  showModal: boolean;
  onClose: () => void;
}

export default function SettingsConfigModal({ showModal, onClose }: SettingsConfigModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const configSteps = [
    {
      icon: PersonIcon,
      title: 'Profile Settings',
      description: 'Add your name, contact information, and professional details',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BusinessIcon,
      title: 'Company Information',
      description: 'Configure your company name, address, and business details',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: PaletteIcon,
      title: 'Branding & Colors',
      description: 'Customize your brand colors and document styling preferences',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: ImageIcon,
      title: 'Logos & Images',
      description: 'Upload your company logo, client logos, and other images',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 p-8 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition"
                  title="Close"
                >
                  <CloseIcon />
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <SettingsIcon sx={{ fontSize: 48 }} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Complete Your Settings First!
                    </h2>
                    <p className="text-white/90 text-lg">
                      Configure your profile to generate accurate proposals
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    Before creating proposals, please take 2 minutes to configure your settings.
                    This ensures all your proposals contain accurate information and professional branding.
                  </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {configSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition"
                      >
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${step.color} mb-3`}>
                          <Icon className="text-white" sx={{ fontSize: 28 }} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {step.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Important Notice */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-500 rounded-lg flex-shrink-0">
                      <CheckCircleIcon className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                        Why This Is Important
                      </h4>
                      <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                        <li>✓ Ensures professional, branded documents</li>
                        <li>✓ Saves time on future proposals</li>
                        <li>✓ Maintains consistency across all documents</li>
                        <li>✓ Makes a great first impression with clients</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/settings" className="flex-1">
                    <motion.button
                      className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <SettingsIcon />
                        <span>Configure Settings Now</span>
                      </div>
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={onClose}
                    className="px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    I&apos;ll do this later
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
