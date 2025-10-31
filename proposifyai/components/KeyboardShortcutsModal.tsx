'use client';

import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ['Ctrl', 'D'], description: 'Go to Dashboard', category: 'Navigation' },
  { keys: ['Ctrl', 'P'], description: 'Go to Proposals', category: 'Navigation' },
  { keys: ['Ctrl', 'N'], description: 'Create New Proposal', category: 'Navigation' },
  { keys: ['Ctrl', ','], description: 'Open Settings', category: 'Navigation' },

  // Editing
  { keys: ['Ctrl', 'S'], description: 'Save Proposal', category: 'Editing' },
  { keys: ['Ctrl', 'E'], description: 'Toggle Edit Mode', category: 'Editing' },
  { keys: ['Ctrl', 'K'], description: 'Open Quick Insert', category: 'Editing' },
  { keys: ['Ctrl', 'B'], description: 'Bold Text', category: 'Editing' },
  { keys: ['Ctrl', 'I'], description: 'Italic Text', category: 'Editing' },
  { keys: ['Ctrl', 'Z'], description: 'Undo', category: 'Editing' },
  { keys: ['Ctrl', 'Y'], description: 'Redo', category: 'Editing' },

  // Actions
  { keys: ['Ctrl', 'Shift', 'P'], description: 'Generate PDF', category: 'Actions' },
  { keys: ['Ctrl', 'Shift', 'E'], description: 'Send Email', category: 'Actions' },
  { keys: ['Ctrl', 'Shift', 'V'], description: 'Preview', category: 'Actions' },
  { keys: ['Ctrl', '/'], description: 'Search', category: 'Actions' },

  // General
  { keys: ['?'], description: 'Show Keyboard Shortcuts', category: 'General' },
  { keys: ['Esc'], description: 'Close Modal/Dialog', category: 'General' },
];

export default function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Open modal with ?
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        // Don't trigger if typing in input/textarea
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          e.preventDefault();
          setIsOpen(true);
        }
      }

      // Close modal with Esc
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-40"
        title="Keyboard Shortcuts (Press ?)"
      >
        <KeyboardIcon />
      </button>
    );
  }

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <KeyboardIcon className="text-3xl" />
            <div>
              <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
              <p className="text-sm text-purple-100">Boost your productivity</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Close (Esc)"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded"></span>
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-700">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <span key={keyIdx} className="flex items-center gap-1">
                            <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm text-sm font-mono font-semibold text-gray-800 min-w-[40px] text-center">
                              {key}
                            </kbd>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="text-gray-400 font-bold">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 flex items-center justify-between rounded-b-2xl border-t">
          <p className="text-sm text-gray-600">
            Tip: Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">?</kbd> anytime to view shortcuts
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
