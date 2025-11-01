'use client';

// Public Proposal View Page
// /p/[shareId]

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Calendar, Building2, User, CheckCircle, XCircle, Download, Eye } from 'lucide-react';
import PricingTable from '@/components/PricingTable';
import { PricingTable as PricingTableType } from '@/types/pricing';

// Helper function to adjust color brightness
function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

interface HeaderFooterData {
  header_logo?: string;
  header_client_logo?: string;
  header_show_client_logo?: boolean;
  header_company_name?: string;
  header_tagline?: string;
  header_bg_color?: string;
  header_text_color?: string;
  header_layout?: 'horizontal' | 'vertical';
  header_show_contact?: boolean;
  header_contact_phone?: string;
  header_contact_email?: string;
  header_contact_website?: string;
  header_contact_address?: string;
  footer_text?: string;
  footer_bg_color?: string;
  footer_text_color?: string;
  footer_font_size?: number;
  footer_alignment?: 'left' | 'center' | 'right';
  footer_show_border?: boolean;
  footer_border_color?: string;
}

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
  header?: HeaderFooterData | null;
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

  // Header customization with fallback defaults
  const header = proposal.header || {};
  const headerBgColor = header.header_bg_color || '#DC2626';
  const headerTextColor = header.header_text_color || '#FFFFFF';
  const headerLayout = header.header_layout || 'horizontal';
  const headerShowContact = header.header_show_contact !== false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Header */}
      {header && (header.header_company_name || header.header_logo) ? (
        <header
          className="border-b-4 sticky top-0 z-10 shadow-md"
          style={{
            backgroundColor: headerBgColor,
            color: headerTextColor,
            borderBottomColor: headerTextColor === '#FFFFFF' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'
          }}
        >
          <div className="max-w-5xl mx-auto px-6 py-8 sm:px-8 lg:px-12">
            <div className={`flex items-center ${headerLayout === 'vertical' ? 'flex-col text-center' : 'justify-between'} gap-6`}>
              {/* Logo and Company Info */}
              <div className={`flex items-center gap-6 ${headerLayout === 'vertical' ? 'flex-col' : ''}`}>
                {header.header_logo && (
                  <div className="bg-white rounded-lg p-3 shadow-lg border-4 border-white">
                    <img
                      src={header.header_logo}
                      alt="Company Logo"
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                )}
                <div className={headerLayout === 'vertical' ? 'text-center' : ''}>
                  {header.header_company_name && (
                    <h1 className="text-3xl font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {header.header_company_name}
                    </h1>
                  )}
                  {header.header_tagline && (
                    <p className="text-sm opacity-95 mt-2 tracking-widest uppercase font-light">
                      {header.header_tagline}
                    </p>
                  )}
                  {header.header_tagline && <div className={`h-0.5 w-20 mt-3 ${headerLayout === 'vertical' ? 'mx-auto' : ''}`} style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}></div>}
                </div>
                {header.header_show_client_logo && header.header_client_logo && (
                  <div className="bg-white rounded-lg p-3 shadow-lg border-4 border-white">
                    <img
                      src={header.header_client_logo}
                      alt="Client Logo"
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Contact Information */}
              {headerShowContact && (
                <div className={`text-sm space-y-2 ${headerLayout === 'vertical' ? 'text-center' : 'text-right'}`}>
                  {header.header_contact_phone && (
                    <div className="flex items-center gap-2 justify-end">
                      <svg className="w-4 h-4 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      <span>{header.header_contact_phone}</span>
                    </div>
                  )}
                  {header.header_contact_email && (
                    <div className="flex items-center gap-2 justify-end">
                      <svg className="w-4 h-4 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <span>{header.header_contact_email}</span>
                    </div>
                  )}
                  {header.header_contact_website && (
                    <div className="flex items-center gap-2 justify-end">
                      <svg className="w-4 h-4 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                      </svg>
                      <span>{header.header_contact_website}</span>
                    </div>
                  )}
                  {header.header_contact_address && (
                    <div className="flex items-center gap-2 justify-end">
                      <svg className="w-4 h-4 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span>{header.header_contact_address}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="mt-6 flex justify-center">
              {proposal.status === 'accepted' && (
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-5 py-2.5 rounded-full shadow-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Accepted</span>
                </div>
              )}
              {proposal.status === 'rejected' && (
                <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-5 py-2.5 rounded-full shadow-sm">
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">Rejected</span>
                </div>
              )}
              {isExpired && (
                <div className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-full font-semibold shadow-sm">
                  Expired
                </div>
              )}
            </div>
          </div>
        </header>
      ) : (
        /* Default Header */
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
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Proposal Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{proposal.title}</h1>

          {/* Client Information Section - QUOTATION FOR */}
          <div className="my-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 tracking-widest" style={{ color: headerBgColor }}>
              QUOTATION FOR
            </h2>

            <div className="flex gap-6 items-start">
              {/* Client Logo */}
              {header && header.header_show_client_logo && header.header_client_logo && (
                <div className="flex-shrink-0">
                  <div className="bg-white rounded-lg p-4 shadow-lg border-4 border-white">
                    <img
                      src={header.header_client_logo}
                      alt="Client Logo"
                      className="w-28 h-28 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Client Details */}
              <div className="flex-1">
                {proposal.client_company && (
                  <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-wide">
                    {proposal.client_company.toUpperCase()}
                  </h3>
                )}
                {proposal.client_name && (
                  <p className="text-lg text-gray-600 mb-1">{proposal.client_name}</p>
                )}
              </div>
            </div>
          </div>

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

      {/* Custom Footer */}
      {header && header.footer_text && (
        <footer
          className={`mt-auto shadow-inner ${header.footer_show_border ? 'border-t-4' : ''}`}
          style={{
            background: header.footer_bg_color
              ? `linear-gradient(135deg, ${header.footer_bg_color} 0%, ${adjustBrightness(header.footer_bg_color, -10)} 100%)`
              : 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            color: header.footer_text_color || '#FFFFFF',
            borderColor: header.footer_border_color || '#DC2626',
          }}
        >
          <div className="max-w-5xl mx-auto px-6 py-6 sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p
                className="font-medium opacity-95 leading-relaxed"
                style={{
                  fontSize: `${header.footer_font_size || 13}px`,
                  textAlign: header.footer_alignment || 'center',
                }}
              >
                {header.footer_text}
              </p>
              {(header.header_contact_phone || header.header_contact_email) && (
                <div className="flex items-center gap-4 text-xs opacity-90">
                  {header.header_contact_phone && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      {header.header_contact_phone}
                    </span>
                  )}
                  {header.header_contact_email && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      {header.header_contact_email}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
