'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CircularProgress from '@mui/material/CircularProgress';
import { exportToPDF, previewPDF, exportProposalPDF } from '@/lib/pdf-export';
import toast from 'react-hot-toast';

interface PDFExportButtonProps {
  elementId?: string;
  element?: HTMLElement;
  filename?: string;
  proposalData?: {
    title: string;
    client: string;
    content: string;
    pricing?: any;
    terms?: any;
  };
  variant?: 'export' | 'preview' | 'both';
  className?: string;
}

export default function PDFExportButton({
  elementId,
  element,
  filename = 'proposal.pdf',
  proposalData,
  variant = 'both',
  className = '',
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      if (proposalData) {
        // Use custom proposal export
        await exportProposalPDF(proposalData);
      } else {
        // Use element export
        const targetElement = element || (elementId ? document.getElementById(elementId) : null);

        if (!targetElement) {
          throw new Error('No element found to export');
        }

        await exportToPDF(targetElement, { filename });
      }

      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreview = async () => {
    setIsPreviewing(true);

    try {
      const targetElement = element || (elementId ? document.getElementById(elementId) : null);

      if (!targetElement) {
        throw new Error('No element found to preview');
      }

      await previewPDF(targetElement, { filename });
      toast.success('Opening PDF preview...');
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to preview PDF. Please try again.');
    } finally {
      setIsPreviewing(false);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {(variant === 'export' || variant === 'both') && (
        <motion.button
          onClick={handleExport}
          disabled={isExporting}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            isExporting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl'
          }`}
          whileHover={!isExporting ? { scale: 1.02, y: -2 } : {}}
          whileTap={!isExporting ? { scale: 0.98 } : {}}
        >
          {isExporting ? (
            <>
              <CircularProgress size={16} className="text-gray-500" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <DownloadIcon fontSize="small" />
              <span>Export PDF</span>
            </>
          )}
        </motion.button>
      )}

      {(variant === 'preview' || variant === 'both') && (
        <motion.button
          onClick={handlePreview}
          disabled={isPreviewing}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border-2 transition-all ${
            isPreviewing
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
          whileHover={!isPreviewing ? { scale: 1.02, y: -2 } : {}}
          whileTap={!isPreviewing ? { scale: 0.98 } : {}}
        >
          {isPreviewing ? (
            <>
              <CircularProgress size={16} className="text-gray-400" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <VisibilityIcon fontSize="small" />
              <span>Preview PDF</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}
