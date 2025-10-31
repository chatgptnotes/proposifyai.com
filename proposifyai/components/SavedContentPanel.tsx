"use client";

import { useState, useEffect } from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import GavelIcon from '@mui/icons-material/Gavel';
import ImageIcon from '@mui/icons-material/Image';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface SavedContent {
  id: string;
  title: string;
  content: string;
  category: 'bank_details' | 'company_info' | 'payment_terms' | 'standard_clause' | 'client_logo' | 'company_logo';
  metadata?: any;
  is_favorite?: boolean;
  created_at?: string;
}

interface SavedContentPanelProps {
  onInsertContent: (content: string) => void;
  onInsertLogo: (logoUrl: string, type: 'company' | 'client') => void;
}

export default function SavedContentPanel({ onInsertContent, onInsertLogo }: SavedContentPanelProps) {
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']));

  const categories = [
    { id: 'all', name: 'All Content', icon: BookmarkIcon, color: 'text-purple-600' },
    { id: 'bank_details', name: 'Bank Details', icon: AccountBalanceIcon, color: 'text-blue-600' },
    { id: 'company_info', name: 'Company Info', icon: BusinessIcon, color: 'text-green-600' },
    { id: 'payment_terms', name: 'Payment Terms', icon: PaymentIcon, color: 'text-yellow-600' },
    { id: 'standard_clause', name: 'Clauses', icon: GavelIcon, color: 'text-red-600' },
    { id: 'client_logo', name: 'Client Logos', icon: ImageIcon, color: 'text-indigo-600' },
    { id: 'company_logo', name: 'Company Logos', icon: ImageIcon, color: 'text-pink-600' },
  ];

  useEffect(() => {
    fetchSavedContent();
  }, []);

  const fetchSavedContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/saved-content');
      if (response.ok) {
        const data = await response.json();
        setSavedContent(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching saved content:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleInsert = (item: SavedContent) => {
    if (item.category === 'client_logo' || item.category === 'company_logo') {
      const type = item.category === 'client_logo' ? 'client' : 'company';
      onInsertLogo(item.content, type);
    } else {
      onInsertContent(item.content);
    }
  };

  const filteredContent = savedContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedContent = categories.reduce((acc, cat) => {
    if (cat.id === 'all') return acc;
    acc[cat.id] = filteredContent.filter(item => item.category === cat.id);
    return acc;
  }, {} as Record<string, SavedContent[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading saved content...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <BookmarkIcon className="text-primary-600" />
          <h3 className="font-semibold text-gray-900">Saved Content</h3>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <CloseIcon fontSize="small" />
            </button>
          )}
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {savedContent.length === 0 ? (
          <div className="text-center py-8">
            <BookmarkIcon className="text-gray-300 mx-auto mb-3" sx={{ fontSize: 48 }} />
            <p className="text-gray-500 text-sm mb-2">No saved content yet</p>
            <p className="text-gray-400 text-xs px-4">
              Save frequently used content in Settings to quickly insert it into proposals
            </p>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-8">
            <SearchIcon className="text-gray-300 mx-auto mb-3" sx={{ fontSize: 48 }} />
            <p className="text-gray-500 text-sm">No matching content found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.slice(1).map((category) => {
              const items = groupedContent[category.id] || [];
              if (items.length === 0) return null;

              const isExpanded = expandedCategories.has(category.id);
              const CategoryIcon = category.icon;

              return (
                <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon className={category.color} fontSize="small" />
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      <span className="text-xs text-gray-500">({items.length})</span>
                    </div>
                    <span className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* Category Items */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-100">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 hover:bg-gray-50 transition group"
                        >
                          {(item.category === 'client_logo' || item.category === 'company_logo') ? (
                            // Logo Preview
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded bg-white flex items-center justify-center overflow-hidden">
                                <img
                                  src={item.content}
                                  alt={item.title}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.category === 'client_logo' ? 'Client Logo' : 'Company Logo'}
                                </p>
                              </div>
                              <button
                                onClick={() => handleInsert(item)}
                                className="flex-shrink-0 p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                title="Insert logo"
                              >
                                <AddCircleIcon fontSize="small" />
                              </button>
                            </div>
                          ) : (
                            // Text Content
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h4>
                                <p className="text-xs text-gray-600 line-clamp-2">{item.content}</p>
                              </div>
                              <button
                                onClick={() => handleInsert(item)}
                                className="flex-shrink-0 p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                title="Insert content"
                              >
                                <AddCircleIcon fontSize="small" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <a
          href="/settings?tab=saved-content"
          className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Manage Saved Content →
        </a>
      </div>
    </div>
  );
}
