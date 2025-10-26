'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';

interface SendProposalEmailProps {
  proposalId?: string;
  proposalTitle?: string;
  proposalLink?: string;
  onSuccess?: () => void;
  className?: string;
}

export default function SendProposalEmail({
  proposalId,
  proposalTitle = 'Proposal',
  proposalLink,
  onSuccess,
  className = '',
}: SendProposalEmailProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    recipientEmail: '',
    recipientName: '',
    subject: `${proposalTitle} - Proposal from ProposifyAI`,
    message: `Thank you for your interest. Please find attached our proposal for your review.\n\nWe look forward to working with you.`,
    includePDF: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipientEmail) {
      toast.error('Please enter recipient email');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/proposals/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId,
          recipientEmail: formData.recipientEmail,
          recipientName: formData.recipientName,
          subject: formData.subject,
          message: formData.message,
          proposalLink,
          // PDF attachment would be generated here
          pdfAttachment: formData.includePDF ? null : null, // Placeholder for PDF generation
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      toast.success('Proposal sent successfully!');
      setIsOpen(false);
      onSuccess?.();

      // Reset form
      setFormData({
        recipientEmail: '',
        recipientName: '',
        subject: `${proposalTitle} - Proposal from ProposifyAI`,
        message: `Thank you for your interest. Please find attached our proposal for your review.\n\nWe look forward to working with you.`,
        includePDF: true,
      });
    } catch (error: any) {
      console.error('Send error:', error);
      toast.error(error.message || 'Failed to send proposal');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all ${className}`}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <EmailIcon fontSize="small" />
        <span>Send Proposal</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => !isSending && setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900 dark:to-purple-900 rounded-xl">
                      <EmailIcon className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Send Proposal
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Email this proposal to your client
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => !isSending && setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    disabled={isSending}
                  >
                    <CloseIcon />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Recipient Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.recipientEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientEmail: e.target.value })
                      }
                      placeholder="client@example.com"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                      disabled={isSending}
                    />
                  </div>

                  {/* Recipient Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientName: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                      disabled={isSending}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                      disabled={isSending}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Cover Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all resize-none"
                      disabled={isSending}
                    />
                  </div>

                  {/* Include PDF */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <input
                      type="checkbox"
                      id="includePDF"
                      checked={formData.includePDF}
                      onChange={(e) =>
                        setFormData({ ...formData, includePDF: e.target.checked })
                      }
                      className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                      disabled={isSending}
                    />
                    <label
                      htmlFor="includePDF"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      <AttachFileIcon fontSize="small" />
                      Include proposal as PDF attachment
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      disabled={isSending}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isSending}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                      whileHover={!isSending ? { scale: 1.01 } : {}}
                      whileTap={!isSending ? { scale: 0.99 } : {}}
                    >
                      {isSending ? (
                        <>
                          <CircularProgress size={20} className="text-white" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <SendIcon fontSize="small" />
                          <span>Send Proposal</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
