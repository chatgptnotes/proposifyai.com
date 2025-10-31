"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from '@/lib/supabase/client';
import LinkIcon from '@mui/icons-material/Link';
import CloudIcon from '@mui/icons-material/Cloud';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EmailIcon from '@mui/icons-material/Email';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import PaletteIcon from '@mui/icons-material/Palette';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import ViewListIcon from '@mui/icons-material/ViewList';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FormattingTab from '@/components/FormattingTab';

interface SavedContent {
  id?: string;
  title: string;
  content: string;
  category: 'bank_details' | 'company_info' | 'payment_terms' | 'standard_clause' | 'client_logo' | 'company_logo';
}

interface FormattingPreferences {
  // Typography
  font_family?: string;
  font_size_base?: number;
  font_size_heading_1?: number;
  font_size_heading_2?: number;
  font_size_heading_3?: number;
  line_height?: number;

  // Colors
  primary_color?: string;
  secondary_color?: string;
  text_color?: string;
  heading_color?: string;

  // Spacing
  page_margin_top?: number;
  page_margin_bottom?: number;
  page_margin_left?: number;
  page_margin_right?: number;
  section_spacing?: number;
  paragraph_spacing?: number;

  // Section Preferences
  include_cover_page?: boolean;
  include_table_of_contents?: boolean;
  include_executive_summary?: boolean;
  include_project_overview?: boolean;
  include_scope_of_work?: boolean;
  include_methodology?: boolean;
  include_timeline?: boolean;
  include_team?: boolean;
  include_pricing?: boolean;
  include_terms_conditions?: boolean;
  include_payment_schedule?: boolean;
  include_case_studies?: boolean;
  include_testimonials?: boolean;
  include_appendix?: boolean;

  // Content Size
  executive_summary_length?: 'short' | 'medium' | 'long';
  project_overview_length?: 'short' | 'medium' | 'long';
  scope_of_work_length?: 'brief' | 'detailed' | 'comprehensive';

  // Header & Footer
  show_header?: boolean;
  show_footer?: boolean;
  show_page_numbers?: boolean;

  // Styling
  heading_style?: 'normal' | 'bold' | 'underline' | 'bold-underline';
  list_style?: 'bullet' | 'number' | 'dash' | 'checkmark';
  table_style?: 'borderless' | 'bordered' | 'striped' | 'minimal';
}

interface ProfileData {
  full_name?: string;
  email?: string;
  company_name?: string;
  avatar_url?: string;
  job_title?: string;
  phone?: string;
  website?: string;
  industry?: string;
  address?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  // Handle URL query parameter for tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [saving, setSaving] = useState(false);
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [showAddContent, setShowAddContent] = useState(false);
  const [editingContent, setEditingContent] = useState<SavedContent | null>(null);
  const [newContent, setNewContent] = useState<SavedContent>({
    title: '',
    content: '',
    category: 'bank_details'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [letterhead, setLetterhead] = useState<string | null>(null);
  const [analyzingLetterhead, setAnalyzingLetterhead] = useState(false);
  const [letterheadData, setLetterheadData] = useState<any>(null);
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [formattingPrefs, setFormattingPrefs] = useState<FormattingPreferences>({
    font_family: 'Arial, Helvetica, sans-serif',
    font_size_base: 12,
    font_size_heading_1: 24,
    font_size_heading_2: 20,
    font_size_heading_3: 16,
    line_height: 1.5,
    primary_color: '#DC2626',
    secondary_color: '#000000',
    text_color: '#1F2937',
    heading_color: '#111827',
    page_margin_top: 20,
    page_margin_bottom: 20,
    page_margin_left: 20,
    page_margin_right: 20,
    section_spacing: 30,
    paragraph_spacing: 12,
    include_cover_page: true,
    include_table_of_contents: true,
    include_executive_summary: true,
    include_project_overview: true,
    include_scope_of_work: true,
    include_methodology: false,
    include_timeline: true,
    include_team: false,
    include_pricing: true,
    include_terms_conditions: true,
    include_payment_schedule: false,
    include_case_studies: false,
    include_testimonials: false,
    include_appendix: false,
    executive_summary_length: 'medium',
    project_overview_length: 'medium',
    scope_of_work_length: 'detailed',
    show_header: true,
    show_footer: true,
    show_page_numbers: true,
    heading_style: 'bold',
    list_style: 'bullet',
    table_style: 'bordered'
  });

  // Fetch profile data on mount
  useEffect(() => {
    if (activeTab === 'profile' || activeTab === 'company') {
      fetchProfileData();
    }
  }, [activeTab]);

  // Fetch saved content on mount
  useEffect(() => {
    if (activeTab === 'saved-content') {
      fetchSavedContent();
    }
  }, [activeTab]);

  // Fetch formatting preferences on mount
  useEffect(() => {
    if (activeTab === 'formatting') {
      fetchFormattingPreferences();
    }
  }, [activeTab]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile data');
      }

      if (data.data) {
        const profile = data.data;
        const preferences = profile.preferences || {};

        setProfileData({
          full_name: profile.full_name || '',
          email: profile.email || '',
          company_name: profile.company_name || '',
          avatar_url: profile.avatar_url || '',
          job_title: preferences.job_title || '',
          phone: preferences.phone || '',
          website: preferences.website || '',
          industry: preferences.industry || '',
          address: preferences.address || ''
        });

        setCompanyWebsite(preferences.website || '');

        // Load letterhead data if available
        if (preferences.letterhead) {
          setLetterhead(preferences.letterhead);
        }
        if (preferences.letterhead_data) {
          setLetterheadData(preferences.letterhead_data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormattingPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/formatting-preferences');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch formatting preferences');
      }

      if (data.data) {
        setFormattingPrefs(prev => ({ ...prev, ...data.data }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching formatting preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveFormattingPreferences = async () => {
    try {
      setSaving(true);
      setError(null);

      // Save formatting preferences
      const response = await fetch('/api/formatting-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattingPrefs)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save formatting preferences');
      }

      // Also save letterhead and company website to profile preferences
      const profileResponse = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterhead: letterhead,
          letterhead_data: letterheadData,
          website: companyWebsite
        })
      });

      if (!profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.error('Failed to save letterhead data:', profileData);
      }

      alert('Branding settings saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      alert('Error: ' + (err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      setSaving(false);
    }
  };

  const fetchSavedContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/saved-content');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch saved content');
      }

      setSavedContent(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching saved content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async () => {
    try {
      setSaving(true);
      setError(null);

      const method = editingContent ? 'PATCH' : 'POST';
      const url = editingContent
        ? `/api/saved-content/${editingContent.id}`
        : '/api/saved-content';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save content');
      }

      await fetchSavedContent();
      setShowAddContent(false);
      setEditingContent(null);
      setNewContent({ title: '', content: '', category: 'bank_details' });
      alert('Content saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      alert('Error: ' + (err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      const response = await fetch(`/api/saved-content/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete content');
      }

      await fetchSavedContent();
      alert('Content deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      alert('Error: ' + (err instanceof Error ? err.message : 'An error occurred'));
    }
  };

  const handleLetterheadUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setLetterhead(base64);

      // Analyze letterhead with AI
      setAnalyzingLetterhead(true);
      try {
        const response = await fetch('/api/ai/analyze-letterhead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });

        const data = await response.json();

        if (response.ok && data.analysis) {
          // Store the full extracted data
          setLetterheadData(data.analysis);

          // Auto-populate formatting preferences
          if (data.analysis.primaryColor) {
            setFormattingPrefs(prev => ({ ...prev, primary_color: data.analysis.primaryColor }));
          }
          if (data.analysis.secondaryColor) {
            setFormattingPrefs(prev => ({ ...prev, secondary_color: data.analysis.secondaryColor }));
          }
          if (data.analysis.textColor) {
            setFormattingPrefs(prev => ({ ...prev, text_color: data.analysis.textColor }));
          }

          // Update margins if provided
          if (data.analysis.margins) {
            setFormattingPrefs(prev => ({
              ...prev,
              page_margin_top: data.analysis.margins.top || prev.page_margin_top,
              page_margin_bottom: data.analysis.margins.bottom || prev.page_margin_bottom,
              page_margin_left: data.analysis.margins.left || prev.page_margin_left,
              page_margin_right: data.analysis.margins.right || prev.page_margin_right
            }));
          }
        }
      } catch (err) {
        console.error('Letterhead analysis error:', err);
      } finally {
        setAnalyzingLetterhead(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteLetterhead = () => {
    if (confirm('Are you sure you want to delete the letterhead? This will remove all extracted brand data.')) {
      setLetterhead(null);
      setLetterheadData(null);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
    }
  };

  const handleSave = async (tabType: 'profile' | 'company') => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      alert(`${tabType === 'profile' ? 'Profile' : 'Company'} settings saved successfully!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      alert('Error: ' + (err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Proposify AI</span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/proposals" className="text-gray-600 hover:text-gray-900">
                  Proposals
                </Link>
                <Link href="/templates" className="text-gray-600 hover:text-gray-900">
                  Templates
                </Link>
                <Link href="/settings" className="text-primary-600 font-medium">
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {profileData.full_name
                      ? profileData.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                      : profileData.email?.substring(0, 2).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full px-6 py-4 text-left font-medium transition ${
                  activeTab === "profile"
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("company")}
                className={`w-full px-6 py-4 text-left font-medium transition ${
                  activeTab === "company"
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Company
              </button>
              <button
                onClick={() => setActiveTab("branding")}
                className={`w-full px-6 py-4 text-left font-medium transition ${
                  activeTab === "branding"
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Branding
              </button>
              <button
                onClick={() => setActiveTab("integrations")}
                className={`w-full px-6 py-4 text-left font-medium transition ${
                  activeTab === "integrations"
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Integrations
              </button>
              <button
                onClick={() => setActiveTab("billing")}
                className={`w-full px-6 py-4 text-left font-medium transition ${
                  activeTab === "billing"
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Billing
              </button>
              <button
                onClick={() => setActiveTab("saved-content")}
                className={`w-full px-6 py-4 text-left font-medium transition ${
                  activeTab === "saved-content"
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Saved Content
              </button>
              <button
                onClick={() => setActiveTab("formatting")}
                className={`w-full px-6 py-4 text-left font-medium transition ${
                  activeTab === "formatting"
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Formatting
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-3xl">
                        {profileData.full_name
                          ? profileData.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                          : profileData.email?.substring(0, 2).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition mr-2">
                        Change Photo
                      </button>
                      <button className="px-4 py-2 text-gray-600 hover:text-red-600 transition">
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.full_name || ''}
                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email || ''}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        title="Email cannot be changed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        type="text"
                        value={profileData.job_title || ''}
                        onChange={(e) => setProfileData({...profileData, job_title: e.target.value})}
                        placeholder="e.g., Sales Manager"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone || ''}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleSave('profile')}
                      disabled={saving}
                      className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                    >
                      <LogoutIcon fontSize="small" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Company Tab */}
            {activeTab === "company" && (
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={profileData.company_name || ''}
                      onChange={(e) => setProfileData({...profileData, company_name: e.target.value})}
                      placeholder="Enter company name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={profileData.website || ''}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        placeholder="https://yourcompany.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                      <select
                        value={profileData.industry || 'Software Development'}
                        onChange={(e) => setProfileData({...profileData, industry: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option>Healthcare IT</option>
                        <option>Software Development</option>
                        <option>SaaS</option>
                        <option>Consulting</option>
                        <option>Marketing</option>
                        <option>E-commerce</option>
                        <option>Financial Services</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      rows={3}
                      value={profileData.address || ''}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      placeholder="Enter company address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => handleSave('company')}
                    disabled={saving}
                    className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === "branding" && (
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Brand Settings</h2>
                <div className="space-y-8">

                  {/* Letterhead Upload Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ImageIcon className="text-primary-600" />
                      Company Letterhead (AI-Powered)
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload your company letterhead and our AI will automatically extract brand colors, detect logo positioning, and suggest optimal text flow regions.
                    </p>
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-64 h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                          {letterhead ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={letterhead} alt="Letterhead" className="w-full h-full object-contain" />
                          ) : (
                            <div className="text-center p-4">
                              <ImageIcon className="text-gray-400 mx-auto mb-2" sx={{ fontSize: 48 }} />
                              <span className="text-gray-400 text-sm">No letterhead uploaded</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            id="letterhead-upload"
                            accept="image/*"
                            onChange={handleLetterheadUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="letterhead-upload"
                            className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition cursor-pointer"
                          >
                            {letterhead ? 'Change Letterhead' : 'Upload Letterhead'}
                          </label>
                          {letterhead && (
                            <button
                              onClick={handleDeleteLetterhead}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                            >
                              <DeleteIcon fontSize="small" />
                              Delete Letterhead
                            </button>
                          )}
                          {analyzingLetterhead && (
                            <span className="ml-4 text-sm text-gray-600">Analyzing with AI...</span>
                          )}
                        </div>

                        {!letterheadData ? (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                              <PaletteIcon fontSize="small" />
                              AI Will Auto-Extract:
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Primary and secondary brand colors</li>
                              <li>• Logo position and dimensions</li>
                              <li>• Safe text flow regions</li>
                              <li>• Margins and spacing</li>
                              <li>• Font style suggestions</li>
                            </ul>
                          </div>
                        ) : (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                              <CheckBoxIcon fontSize="small" />
                              Extracted Information:
                            </h4>
                            <div className="space-y-3 text-sm">
                              {letterheadData.primaryColor && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-green-800 w-32">Primary Color:</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: letterheadData.primaryColor }}></div>
                                    <span className="text-green-700">{letterheadData.primaryColor}</span>
                                  </div>
                                </div>
                              )}
                              {letterheadData.secondaryColor && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-green-800 w-32">Secondary Color:</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: letterheadData.secondaryColor }}></div>
                                    <span className="text-green-700">{letterheadData.secondaryColor}</span>
                                  </div>
                                </div>
                              )}
                              {letterheadData.textColor && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-green-800 w-32">Text Color:</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: letterheadData.textColor }}></div>
                                    <span className="text-green-700">{letterheadData.textColor}</span>
                                  </div>
                                </div>
                              )}
                              {letterheadData.logoPosition && (
                                <div className="flex items-start gap-2">
                                  <span className="font-medium text-green-800 w-32">Logo Position:</span>
                                  <span className="text-green-700">{letterheadData.logoPosition}</span>
                                </div>
                              )}
                              {letterheadData.logoDimensions && (
                                <div className="flex items-start gap-2">
                                  <span className="font-medium text-green-800 w-32">Logo Dimensions:</span>
                                  <span className="text-green-700">{letterheadData.logoDimensions}</span>
                                </div>
                              )}
                              {letterheadData.safeTextRegions && (
                                <div className="flex items-start gap-2">
                                  <span className="font-medium text-green-800 w-32">Safe Text Regions:</span>
                                  <span className="text-green-700">{letterheadData.safeTextRegions}</span>
                                </div>
                              )}
                              {letterheadData.margins && (
                                <div className="flex items-start gap-2">
                                  <span className="font-medium text-green-800 w-32">Margins:</span>
                                  <span className="text-green-700">
                                    Top: {letterheadData.margins.top}mm, Bottom: {letterheadData.margins.bottom}mm,
                                    Left: {letterheadData.margins.left}mm, Right: {letterheadData.margins.right}mm
                                  </span>
                                </div>
                              )}
                              {letterheadData.fontSuggestions && (
                                <div className="flex items-start gap-2">
                                  <span className="font-medium text-green-800 w-32">Font Suggestions:</span>
                                  <span className="text-green-700">{letterheadData.fontSuggestions}</span>
                                </div>
                              )}
                              {letterheadData.spacing && (
                                <div className="flex items-start gap-2">
                                  <span className="font-medium text-green-800 w-32">Spacing:</span>
                                  <span className="text-green-700">{letterheadData.spacing}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Company Website */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <LinkIcon className="text-primary-600" />
                      Company Website
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your website helps AI gather additional context about your company for better proposal generation.
                    </p>
                    <input
                      type="url"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://yourcompany.com"
                      className="w-full md:w-2/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Brand Colors (Auto-populated from letterhead or manual) */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={formattingPrefs.primary_color}
                            onChange={(e) => setFormattingPrefs({...formattingPrefs, primary_color: e.target.value})}
                            className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formattingPrefs.primary_color}
                            onChange={(e) => setFormattingPrefs({...formattingPrefs, primary_color: e.target.value})}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={formattingPrefs.secondary_color}
                            onChange={(e) => setFormattingPrefs({...formattingPrefs, secondary_color: e.target.value})}
                            className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formattingPrefs.secondary_color}
                            onChange={(e) => setFormattingPrefs({...formattingPrefs, secondary_color: e.target.value})}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={formattingPrefs.text_color}
                            onChange={(e) => setFormattingPrefs({...formattingPrefs, text_color: e.target.value})}
                            className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formattingPrefs.text_color}
                            onChange={(e) => setFormattingPrefs({...formattingPrefs, text_color: e.target.value})}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={saveFormattingPreferences}
                    disabled={saving}
                    className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Branding Settings'}
                  </button>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Integrations</h2>
                  <div className="space-y-4">
                    {[
                      { name: "HubSpot", connected: true, IconComponent: LinkIcon },
                      { name: "Salesforce", connected: false, IconComponent: CloudIcon },
                      { name: "Stripe", connected: true, IconComponent: CreditCardIcon },
                      { name: "Gmail", connected: true, IconComponent: EmailIcon },
                    ].map((integration) => (
                      <div
                        key={integration.name}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <integration.IconComponent className="text-primary-600" sx={{ fontSize: 32 }} />
                          <div>
                            <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                            <p className="text-sm text-gray-600">
                              {integration.connected ? "Connected" : "Not connected"}
                            </p>
                          </div>
                        </div>
                        <button
                          className={`px-4 py-2 font-medium rounded-lg transition ${
                            integration.connected
                              ? "bg-red-50 text-red-700 hover:bg-red-100"
                              : "bg-primary-600 text-white hover:bg-primary-700"
                          }`}
                        >
                          {integration.connected ? "Disconnect" : "Connect"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing & Subscription</h2>

                  {/* Current Plan */}
                  <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg p-6 text-white mb-6">
                    <h3 className="text-lg font-semibold mb-2">Professional Plan</h3>
                    <p className="text-3xl font-bold mb-1">$99<span className="text-lg font-normal">/month</span></p>
                    <p className="text-primary-100 text-sm">Next billing date: Feb 15, 2025</p>
                    <button className="mt-4 px-4 py-2 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition">
                      Upgrade to Enterprise
                    </button>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <CreditCardIcon className="text-gray-600" fontSize="small" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-600">Expires 12/25</p>
                        </div>
                      </div>
                      <button className="text-primary-600 hover:text-primary-700 font-medium">
                        Update
                      </button>
                    </div>
                  </div>

                  {/* Billing History */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Billing History</h3>
                    <div className="space-y-3">
                      {[
                        { date: "Jan 15, 2025", amount: "$99.00", status: "Paid" },
                        { date: "Dec 15, 2024", amount: "$99.00", status: "Paid" },
                        { date: "Nov 15, 2024", amount: "$99.00", status: "Paid" },
                      ].map((invoice, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{invoice.date}</p>
                            <p className="text-sm text-gray-600">{invoice.amount}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                              {invoice.status}
                            </span>
                            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Content Tab */}
            {activeTab === "saved-content" && (
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Saved Content Library</h2>
                    <p className="text-sm text-gray-600 mt-1">Save frequently used content for quick insertion into proposals</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddContent(true);
                      setEditingContent(null);
                      setNewContent({ title: '', content: '', category: 'bank_details' });
                    }}
                    className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                  >
                    <AddIcon fontSize="small" />
                    Add New
                  </button>
                </div>

                {/* Add/Edit Modal */}
                {showAddContent && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {editingContent ? 'Edit Saved Content' : 'Add New Saved Content'}
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Title {(newContent.category === 'client_logo' || newContent.category === 'company_logo') && (
                              <span className="text-xs text-gray-500 font-normal">(auto-filled from filename, you can edit)</span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={newContent.title}
                            onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                            placeholder={
                              (newContent.category === 'client_logo' || newContent.category === 'company_logo')
                                ? "e.g., Nike Logo, Client ABC Logo"
                                : "e.g., Primary Bank Account, Company Address"
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                          <select
                            value={newContent.category}
                            onChange={(e) => setNewContent({ ...newContent, category: e.target.value as any })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="bank_details">Bank Details</option>
                            <option value="company_info">Company Information</option>
                            <option value="payment_terms">Payment Terms</option>
                            <option value="standard_clause">Standard Clauses</option>
                            <option value="client_logo">Client Logos</option>
                            <option value="company_logo">Company Logos</option>
                          </select>
                        </div>

                        {/* Image Upload for Logos */}
                        {(newContent.category === 'client_logo' || newContent.category === 'company_logo') ? (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Upload {newContent.category === 'client_logo' ? 'Client' : 'Company'} Logo
                            </label>
                            <div className="space-y-4">
                              <input
                                type="file"
                                id="logo-upload"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    // Extract filename without extension for the title
                                    const fileName = file.name.replace(/\.[^/.]+$/, '');

                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setNewContent({
                                        ...newContent,
                                        content: reader.result as string,
                                        title: newContent.title || fileName // Auto-fill title if empty
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                              />
                              {newContent.content && (
                                <div className="mt-4">
                                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={newContent.content}
                                      alt="Logo preview"
                                      className="max-w-xs max-h-48 object-contain mx-auto"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                            <textarea
                              value={newContent.content}
                              onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                              placeholder="Enter your content here..."
                              rows={8}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-y"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => setShowAddContent(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveContent}
                          disabled={saving || !newContent.title || !newContent.content}
                          className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? 'Saving...' : 'Save Content'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-gray-600">Loading saved content...</div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {error}
                  </div>
                )}

                {/* Content Categories */}
                {!loading && (
                  <div className="space-y-6">
                    {['bank_details', 'company_info', 'payment_terms', 'standard_clause', 'client_logo', 'company_logo'].map((category) => {
                    const categoryIcons = {
                      bank_details: AccountBalanceIcon,
                      company_info: BusinessIcon,
                      payment_terms: CreditCardIcon,
                      standard_clause: DescriptionIcon,
                      client_logo: ImageIcon,
                      company_logo: ImageIcon
                    };
                    const categoryNames = {
                      bank_details: 'Bank Details',
                      company_info: 'Company Information',
                      payment_terms: 'Payment Terms',
                      standard_clause: 'Standard Clauses',
                      client_logo: 'Client Logos',
                      company_logo: 'Company Logos'
                    };
                    const Icon = categoryIcons[category as keyof typeof categoryIcons];
                    const items = savedContent.filter(item => item.category === category);

                    return (
                      <div key={category} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="text-primary-600" fontSize="small" />
                          <h3 className="font-semibold text-gray-900">
                            {categoryNames[category as keyof typeof categoryNames]}
                          </h3>
                          <span className="text-xs text-gray-500">({items.length})</span>
                        </div>

                        {items.length === 0 ? (
                          <p className="text-sm text-gray-500 italic">No saved content in this category</p>
                        ) : (
                          <div className="space-y-2">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                              >
                                {(item.category === 'client_logo' || item.category === 'company_logo') ? (
                                  <div className="flex items-center gap-3 flex-1">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={item.content}
                                      alt={item.title}
                                      className="w-16 h-16 object-contain bg-white border border-gray-200 rounded p-1"
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {item.category === 'client_logo' ? 'Client Logo' : 'Company Logo'}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.content}</p>
                                  </div>
                                )}
                                <div className="flex gap-2 ml-4">
                                  <button
                                    onClick={() => {
                                      setEditingContent(item);
                                      setNewContent(item);
                                      setShowAddContent(true);
                                    }}
                                    className="p-1 text-gray-600 hover:text-primary-600"
                                    title="Edit"
                                  >
                                    <EditIcon fontSize="small" />
                                  </button>
                                  <button
                                    onClick={() => item.id && handleDeleteContent(item.id)}
                                    className="p-1 text-gray-600 hover:text-red-600"
                                    title="Delete"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  </div>
                )}

                {/* Example Content Hint */}
                {!loading && savedContent.length === 0 && (
                  <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Get Started</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Save frequently used content like:
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Bank account details and wire transfer instructions</li>
                      <li>• Company address and contact information</li>
                      <li>• Standard payment terms (Net 30, deposits, etc.)</li>
                      <li>• Legal clauses and terms & conditions</li>
                      <li>• Client logos - Upload and store your clients&apos; branding</li>
                      <li>• Company logos - Upload your own company logos and branding assets</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Formatting Tab */}
            {activeTab === "formatting" && (
              <FormattingTab
                formattingPrefs={formattingPrefs}
                setFormattingPrefs={setFormattingPrefs}
                saveFormattingPreferences={saveFormattingPreferences}
                saving={saving}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
