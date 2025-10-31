'use client';

// Public Proposal View Page
// /p/[shareId]

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Calendar, Building2, User, CheckCircle, XCircle, Download, Eye } from 'lucide-react';
import PricingTable from '@/components/PricingTable';
import { PricingTable as PricingTableType } from '@/types/pricing';

interface PublicProposal {
  id: string;
  title: string;
  client_name: string;
  client_company: string;
  content: any;
  pricing: PricingTableType;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
  created_at: string;
  expires_at?: string;
  accepted_at?: string;
  rejected_at?: string;
}

export default function PublicProposalPage() {
  const params = useParams();
  const shareId = params?.shareId as string;

  const [proposal, setProposal] = useState<PublicProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch proposal
  useEffect(() => {
    if (shareId) {
      fetchProposal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareId]);

  const fetchProposal = async (pwd?: string) => {
    try {
      setLoading(true);
      setError('');

      const url = new URL(`/api/proposals/public/${shareId}`, window.location.origin);
      if (pwd) {
        url.searchParams.set('password', pwd);
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      if (!response.ok) {
        if (data.requiresPassword) {
          setRequiresPassword(true);
          setError('');
        } else {
          setError(data.error || 'Failed to load proposal');
        }
        return;
      }

      setProposal(data);
      setRequiresPassword(false);
    } catch (err) {
      setError('Failed to load proposal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProposal(password);
  };

  const handleAccept = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const signature = formData.get('signature') as string;

    try {
      const response = await fetch(`/api/proposals/public/${shareId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, signature }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to accept proposal');
        return;
      }

      // Refresh proposal to show accepted state
      await fetchProposal(password);
      setShowAcceptModal(false);
      alert('Proposal accepted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to accept proposal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const reason = formData.get('reason') as string;

    try {
      const response = await fetch(`/api/proposals/public/${shareId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to reject proposal');
        return;
      }

      // Refresh proposal to show rejected state
      await fetchProposal(password);
      setShowRejectModal(false);
      alert('Proposal rejected');
    } catch (err) {
      console.error(err);
      alert('Failed to reject proposal');
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposal...</p>
        </div>
      </div>
    );
  }

  // Password required
  if (requiresPassword && !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <FileText className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Protected Proposal</h1>
            <p className="text-gray-600">This proposal is password protected</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Access Proposal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Proposal Not Found</h1>
          <p className="text-gray-600 mb-4">
            {error || 'The proposal you are looking for does not exist or has been removed.'}
          </p>
          <a
            href="/"
            className="inline-block bg-primary-600 text-white py-2 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Check if expired
  const isExpired = proposal.expires_at && new Date(proposal.expires_at) < new Date();
  const canTakeAction = proposal.status !== 'accepted' && proposal.status !== 'rejected' && !isExpired;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Proposify AI</h1>
                <p className="text-sm text-gray-600">Professional Proposals</p>
              </div>
            </div>

            {/* Status Badge */}
            {proposal.status === 'accepted' && (
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Accepted</span>
              </div>
            )}
            {proposal.status === 'rejected' && (
              <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Rejected</span>
              </div>
            )}
            {isExpired && (
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium">
                Expired
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Proposal Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{proposal.title}</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-medium text-gray-900">{proposal.client_name}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium text-gray-900">{proposal.client_company}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(proposal.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {proposal.expires_at && (
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Expires</p>
                  <p className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                    {new Date(proposal.expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {proposal.accepted_at && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Accepted on {new Date(proposal.accepted_at).toLocaleDateString()}
              </p>
            </div>
          )}

          {proposal.rejected_at && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Rejected on {new Date(proposal.rejected_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Proposal Content */}
        {proposal.content && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Proposal Details</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: proposal.content }}
            />
          </div>
        )}

        {/* Pricing */}
        {proposal.pricing && (
          <div className="mb-6">
            <PricingTable data={proposal.pricing} />
          </div>
        )}

        {/* Action Buttons */}
        {canTakeAction && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Response</h3>
            <p className="text-gray-600 mb-6">
              Please review the proposal and let us know your decision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowAcceptModal(true)}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Accept Proposal</span>
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Reject Proposal</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Accept Proposal</h3>
            <p className="text-gray-600 mb-6">
              Please provide your details to accept this proposal.
            </p>

            <form onSubmit={handleAccept} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-1">
                  Electronic Signature (Type your full name)
                </label>
                <input
                  type="text"
                  id="signature"
                  name="signature"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-serif text-lg"
                  placeholder="Type your name as signature"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAcceptModal(false)}
                  disabled={actionLoading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'Accept'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Proposal</h3>
            <p className="text-gray-600 mb-6">
              Please provide your details and optionally a reason for rejecting.
            </p>

            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label htmlFor="reject-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="reject-name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="reject-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="reject-email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (Optional)
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Let us know why you're rejecting this proposal..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  disabled={actionLoading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
