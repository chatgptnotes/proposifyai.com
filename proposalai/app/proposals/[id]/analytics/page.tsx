'use client';

// Proposal Analytics Page
// View detailed analytics for a specific proposal

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProposalAnalytics from '@/components/ProposalAnalytics';

export default function ProposalAnalyticsPage({ params }: { params: { id: string } }) {
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposal();
  }, [params.id]);

  const fetchProposal = async () => {
    try {
      const response = await fetch(`/api/proposals/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProposal(data.data.proposal);
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Proposal Not Found</h1>
          <Link
            href="/proposals"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Proposals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/proposals/${params.id}`}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Proposal</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{proposal.title}</h1>
                <p className="text-sm text-gray-600">
                  {proposal.client_name} - {proposal.client_company}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                proposal.status === 'accepted'
                  ? 'bg-green-100 text-green-800'
                  : proposal.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : proposal.status === 'viewed'
                  ? 'bg-blue-100 text-blue-800'
                  : proposal.status === 'sent'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProposalAnalytics proposalId={params.id} />
      </main>
    </div>
  );
}
