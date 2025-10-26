'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import toast from 'react-hot-toast';

interface SavedContent {
  id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  usage_count: number;
  created_at: string;
}

interface SavedContentLibraryProps {
  onSelect?: (content: SavedContent) => void;
  showHeader?: boolean;
}

export default function SavedContentLibrary({
  onSelect,
  showHeader = true,
}: SavedContentLibraryProps) {
  const [savedContents, setSavedContents] = useState<SavedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    category: 'text',
  });

  // Fetch saved content
  useEffect(() => {
    fetchSavedContent();
  }, []);

  const fetchSavedContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/saved-content');
      if (response.ok) {
        const result = await response.json();
        setSavedContents(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch saved content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNew = async () => {
    if (!newContent.title || !newContent.content) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      const response = await fetch('/api/saved-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });

      if (response.ok) {
        toast.success('Content saved successfully!');
        setIsAddingNew(false);
        setNewContent({ title: '', content: '', category: 'text' });
        fetchSavedContent();
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      toast.error('Failed to save content');
    }
  };

  const handleCopy = (content: SavedContent) => {
    navigator.clipboard.writeText(content.content);
    toast.success('Content copied to clipboard!');

    if (onSelect) {
      onSelect(content);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(`/api/saved-content/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Content deleted successfully');
        fetchSavedContent();
      }
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  const filteredContents = savedContents.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === 'all' || content.category === filterType;

    return matchesSearch && matchesFilter;
  });

  const contentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'text', label: 'Text' },
    { value: 'payment_terms', label: 'Payment Terms' },
    { value: 'company_info', label: 'Company Info' },
    { value: 'bank_details', label: 'Bank Details' },
    { value: 'standard_clause', label: 'Standard Clause' },
    { value: 'image', label: 'Image' },
  ];

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Saved Content Library
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Reusable content snippets for your proposals
            </p>
          </div>
          <motion.button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AddIcon fontSize="small" />
            Add New Content
          </motion.button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search saved content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div className="relative">
          <FilterListIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 appearance-none cursor-pointer"
          >
            {contentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New Content Modal */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Add New Content
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newContent.title}
                    onChange={(e) =>
                      setNewContent({ ...newContent, title: e.target.value })
                    }
                    placeholder="e.g., Standard Payment Terms"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newContent.category}
                    onChange={(e) =>
                      setNewContent({ ...newContent, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    {contentTypes.slice(1).map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newContent.content}
                    onChange={(e) =>
                      setNewContent({ ...newContent, content: e.target.value })
                    }
                    rows={6}
                    placeholder="Enter your reusable content here..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsAddingNew(false)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNew}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700"
                  >
                    Save Content
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : filteredContents.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              No saved content found. Add some to get started!
            </p>
          </div>
        ) : (
          filteredContents.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {content.title}
                    </h3>
                    <span className="px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full">
                      {content.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {content.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>Used {content.usage_count} times</span>
                    <span>•</span>
                    <span>
                      {new Date(content.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleCopy(content)}
                    className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Copy to clipboard"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(content.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
