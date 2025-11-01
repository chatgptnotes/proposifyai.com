"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ProposalListSkeleton } from "@/components/ProposalCardSkeleton";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Proposal {
  id: string;
  title: string;
  client_name: string;
  client_company?: string;
  total_value: number;
  currency: string;
  status: string;
  viewed_at?: string;
  created_at: string;
  template_name?: string;
}

export default function ProposalsPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "value">("date");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // Fetch proposals from API
  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/proposals?limit=100');
      const data = await response.json();

      console.log('🔍 DEBUG: API Response:', { ok: response.ok, proposalCount: data.proposals?.length });

      if (response.ok && data.proposals) {
        setProposals(data.proposals);
        console.log('✅ DEBUG: Proposals set in state:', data.proposals.length);
      } else {
        console.error('❌ DEBUG: Failed to load proposals:', data);
      }
    } catch (err) {
      console.error('Error fetching proposals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700 border border-gray-300";
      case "sent":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "opened":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "signed":
        return "bg-green-100 text-green-700 border border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <DescriptionIcon sx={{ fontSize: 14 }} />;
      case "sent":
        return <SendIcon sx={{ fontSize: 14 }} />;
      case "opened":
        return <VisibilityIcon sx={{ fontSize: 14 }} />;
      case "signed":
        return <CheckCircleIcon sx={{ fontSize: 14 }} />;
      default:
        return <DescriptionIcon sx={{ fontSize: 14 }} />;
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
    toast.success(favorites.includes(id) ? "Removed from favorites" : "Added to favorites");
  };

  const copyProposalId = (id: string, title: string) => {
    navigator.clipboard.writeText(`#${id} - ${title}`);
    toast.success("Proposal ID copied to clipboard!");
  };

  const deleteProposal = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/proposals/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Proposal "${title}" deleted successfully`);
        // Remove from local state
        setProposals(prev => prev.filter(p => p.id !== id));
      } else {
        throw new Error(data.error || 'Failed to delete proposal');
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete proposal');
    }
  };

  const filteredAndSortedProposals = useMemo(() => {
    let result = proposals;

    // Filter by status
    if (filter !== "all") {
      result = result.filter((p) => p.status === filter);
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.client_company && p.client_company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "value":
          return b.total_value - a.total_value;
        case "date":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    // Favorites first
    return result.sort((a, b) => {
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [proposals, filter, searchQuery, sortBy, favorites]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
            <p className="text-gray-600 mt-2">
              Manage and track all your proposals • {proposals.length} total
              {favorites.length > 0 && ` • ${favorites.length} favorited`}
            </p>
          </div>
          <Link
            href="/proposals/new"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-md hover:shadow-lg hover:scale-105 transform"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Proposal
          </Link>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals by title or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <div className="relative">
            <SortIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "name" | "value")}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none bg-white cursor-pointer font-medium"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="value">Sort by Value</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "all"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            All ({proposals.length})
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "draft"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Draft ({proposals.filter((p) => p.status === "draft").length})
          </button>
          <button
            onClick={() => setFilter("sent")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "sent"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Sent ({proposals.filter((p) => p.status === "sent").length})
          </button>
          <button
            onClick={() => setFilter("opened")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "opened"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Opened ({proposals.filter((p) => p.status === "opened").length})
          </button>
          <button
            onClick={() => setFilter("signed")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "signed"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Signed ({proposals.filter((p) => p.status === "signed").length})
          </button>
        </div>

        {/* Proposals List */}
        {isLoading ? (
          <ProposalListSkeleton count={5} />
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="divide-y divide-gray-200">
              {filteredAndSortedProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="px-6 py-5 hover:bg-gray-50 transition group relative"
              >
                {/* Favorite Star Badge */}
                {favorites.includes(proposal.id) && (
                  <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <StarIcon sx={{ fontSize: 12 }} />
                    Favorite
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Link href={`/proposals/${proposal.id}`} className="flex-1 min-w-0 block">
                    <div className="flex items-center space-x-3 mb-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(proposal.id);
                        }}
                        className="flex-shrink-0 text-gray-400 hover:text-yellow-500 transition"
                        title={favorites.includes(proposal.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {favorites.includes(proposal.id) ? (
                          <StarIcon className="text-yellow-500" />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{proposal.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          proposal.status
                        )}`}
                      >
                        <span>{getStatusIcon(proposal.status)}</span>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          copyProposalId(proposal.id, proposal.title);
                        }}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-primary-600 transition"
                        title="Copy proposal ID"
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Client:</span> {proposal.client_name}{proposal.client_company ? ` - ${proposal.client_company}` : ''}
                      </span>
                      {proposal.template_name && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Template:</span> {proposal.template_name}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Created:</span> {new Date(proposal.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Last viewed:</span> {getTimeAgo(proposal.viewed_at || proposal.created_at)}
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Proposal Value</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {formatCurrency(proposal.total_value)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2" style={{ border: '2px solid red', padding: '10px', backgroundColor: 'yellow' }}>
                      <button
                        onClick={(e) => {
                          console.log('🔵 CLICK: Edit button clicked for', proposal.id);
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = `/proposals/${proposal.id}`;
                        }}
                        className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition transform hover:scale-110"
                        title="Edit proposal"
                        style={{ border: '2px solid blue', display: 'block', visibility: 'visible' }}
                      >
                        <EditIcon sx={{ fontSize: 20 }} />
                      </button>
                      <button
                        onClick={(e) => {
                          console.log('🔴 CLICK: Delete button clicked for', proposal.id);
                          e.preventDefault();
                          e.stopPropagation();
                          deleteProposal(proposal.id, proposal.title);
                        }}
                        className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition transform hover:scale-110"
                        title="Delete proposal"
                        style={{ border: '2px solid red', display: 'block', visibility: 'visible' }}
                      >
                        <DeleteIcon sx={{ fontSize: 20 }} />
                      </button>
                    </div>
                    <Link href={`/proposals/${proposal.id}`}>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State (if no proposals) */}
        {!isLoading && filteredAndSortedProposals.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "Get started by creating your first proposal"
                : `No proposals with status "${filter}"`}
            </p>
            <Link
              href="/proposals/new"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Proposal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
