"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
  category: 'bank_details' | 'company_info' | 'payment_terms' | 'standard_clause' | 'image';
  metadata?: {
    subcategory?: 'company_logo' | 'client_logo' | 'general_image';
    [key: string]: any;
  };
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
  const [saving, setSaving] = useState(false);
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [showAddContent, setShowAddContent] = useState(false);
  const [editingContent, setEditingContent] = useState<SavedContent | null>(null);
  const [newContent, setNewContent] = useState<SavedContent>({
    title: '',
    content: '',
    category: 'bank_details'
  });
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [letterhead, setLetterhead] = useState<string | null>(null);
  const [analyzingLetterhead, setAnalyzingLetterhead] = useState(false);
  const [letterheadData, setLetterheadData] = useState<any>(null);
  const [companyWebsite, setCompanyWebsite] = useState('');

  // Header customization state
  const [headerLogo, setHeaderLogo] = useState<string>('');
  const [headerClientLogo, setHeaderClientLogo] = useState<string>('');
  const [headerShowClientLogo, setHeaderShowClientLogo] = useState(false);
  const [headerCompanyName, setHeaderCompanyName] = useState('DRMHOPE SOFTWARE');
  const [headerTagline, setHeaderTagline] = useState('Empowering businesses with intelligent AI agents');
  const [headerBgColor, setHeaderBgColor] = useState('#DC2626');
  const [headerTextColor, setHeaderTextColor] = useState('#FFFFFF');
  const [headerLayout, setHeaderLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [headerShowContact, setHeaderShowContact] = useState(true);
  const [headerContactPhone, setHeaderContactPhone] = useState('+91 937-3111-709');
  const [headerContactEmail, setHeaderContactEmail] = useState('murali@drmhope.com');
  const [headerContactWebsite, setHeaderContactWebsite] = useState('www.drmhope.com');
  const [headerContactAddress, setHeaderContactAddress] = useState('Nagpur, Maharashtra, India');

  // Footer customization state
  const [footerText, setFooterText] = useState('DRMHOPE SOFTWARE | Empowering businesses with intelligent AI agents');
  const [footerBgColor, setFooterBgColor] = useState('#1F2937');
  const [footerTextColor, setFooterTextColor] = useState('#FFFFFF');
  const [footerFontSize, setFooterFontSize] = useState(12);
  const [footerAlignment, setFooterAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [footerShowBorder, setFooterShowBorder] = useState(true);
  const [footerBorderColor, setFooterBorderColor] = useState('#DC2626');
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

  // Handle URL query parameter for tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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

  // Fetch profile data and saved content when letterhead tab is active
  useEffect(() => {
    if (activeTab === 'letterhead') {
      fetchProfileData();
      fetchSavedContent();
    }
  }, [activeTab]);

  // Auto-populate header logo with company logo from saved content
  useEffect(() => {
    console.log('Effect triggered - activeTab:', activeTab, 'savedContent length:', savedContent.length, 'current headerLogo:', headerLogo ? 'has value' : 'empty');

    if (activeTab === 'letterhead' && savedContent.length > 0) {
      console.log('Saved content items:', savedContent.map(item => ({ title: item.title, category: item.category })));

      // Find company logo - look for images with "logo" in title
      const companyLogo = savedContent.find(item =>
        item.category === 'image' &&
        item.title &&
        item.title.toLowerCase().includes('logo')
      );

      console.log('Found company logo:', companyLogo ? 'YES - ' + companyLogo.title : 'NO');

      if (companyLogo && companyLogo.content) {
        if (!headerLogo || headerLogo === '') {
          console.log('Auto-loading company logo, length:', companyLogo.content.length);
          setHeaderLogo(companyLogo.content);
        } else {
          console.log('Header logo already set, not overwriting');
        }
      }
    }
  }, [savedContent, activeTab]);

  // Auto-focus title field when modal opens
  useEffect(() => {
    if (showAddContent && titleInputRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [showAddContent]);

  // Image compression helper
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions for logos
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = height * (MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = width * (MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with quality reduction if needed
          let quality = 0.9;
          let result = canvas.toDataURL('image/jpeg', quality);

          // If still too large, reduce quality further
          while (result.length > 500000 && quality > 0.5) {
            quality -= 0.1;
            result = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(result);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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

        // Load header customization
        if (preferences.header_logo) {
          console.log('Loading header logo from preferences');
          setHeaderLogo(preferences.header_logo);
        } else {
          console.log('No header logo in preferences, will try to load from saved content');
        }
        if (preferences.header_client_logo) setHeaderClientLogo(preferences.header_client_logo);
        if (preferences.header_show_client_logo !== undefined) setHeaderShowClientLogo(preferences.header_show_client_logo);
        if (preferences.header_company_name) setHeaderCompanyName(preferences.header_company_name);
        if (preferences.header_tagline) setHeaderTagline(preferences.header_tagline);
        if (preferences.header_bg_color) setHeaderBgColor(preferences.header_bg_color);
        if (preferences.header_text_color) setHeaderTextColor(preferences.header_text_color);
        if (preferences.header_layout) setHeaderLayout(preferences.header_layout);
        if (preferences.header_show_contact !== undefined) setHeaderShowContact(preferences.header_show_contact);
        if (preferences.header_contact_phone) setHeaderContactPhone(preferences.header_contact_phone);
        if (preferences.header_contact_email) setHeaderContactEmail(preferences.header_contact_email);
        if (preferences.header_contact_website) setHeaderContactWebsite(preferences.header_contact_website);
        if (preferences.header_contact_address) setHeaderContactAddress(preferences.header_contact_address);

        // Load footer customization
        if (preferences.footer_text) setFooterText(preferences.footer_text);
        if (preferences.footer_bg_color) setFooterBgColor(preferences.footer_bg_color);
        if (preferences.footer_text_color) setFooterTextColor(preferences.footer_text_color);
        if (preferences.footer_font_size) setFooterFontSize(preferences.footer_font_size);
        if (preferences.footer_alignment) setFooterAlignment(preferences.footer_alignment);
        if (preferences.footer_show_border !== undefined) setFooterShowBorder(preferences.footer_show_border);
        if (preferences.footer_border_color) setFooterBorderColor(preferences.footer_border_color);
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

      // Also save letterhead, header/footer customization and company website to profile preferences
      const profileResponse = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterhead: letterhead,
          letterhead_data: letterheadData,
          website: companyWebsite,
          // Header customization
          header_logo: headerLogo,
          header_company_name: headerCompanyName,
          header_tagline: headerTagline,
          header_bg_color: headerBgColor,
          header_text_color: headerTextColor,
          header_layout: headerLayout,
          header_show_contact: headerShowContact,
          header_contact_phone: headerContactPhone,
          header_contact_email: headerContactEmail,
          header_contact_website: headerContactWebsite,
          header_contact_address: headerContactAddress,
          // Footer customization
          footer_text: footerText,
          footer_bg_color: footerBgColor,
          footer_text_color: footerTextColor,
          footer_font_size: footerFontSize,
          footer_alignment: footerAlignment,
          footer_show_border: footerShowBorder,
          footer_border_color: footerBorderColor
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

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses (like "Request Entity Too Large")
        const text = await response.text();
        data = { error: text || 'Server returned non-JSON response' };
      }

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
                onClick={() => setActiveTab("letterhead")}
                className={`w-full px-6 py-4 text-left font-medium transition ${
                  activeTab === "letterhead"
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Letterhead Customize
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

            {/* Letterhead Customize Tab */}
            {activeTab === "letterhead" && (
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Header & Footer Customization</h2>

                <div className="space-y-8">
                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Customize Your Proposal Headers & Footers</h3>
                    <p className="text-sm text-blue-800">
                      Design professional headers and footers for all your proposals. Changes will apply to all new proposals by default.
                    </p>
                  </div>

                  {/* HEADER CUSTOMIZATION */}
                  <div className="border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary-600 rounded"></span>
                      Header Customization
                    </h3>

                    <div className="space-y-6">
                      {/* Logo Upload */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Header Logo
                        </label>
                        {headerLogo ? (
                          <div className="flex items-center gap-4">
                            <img src={headerLogo} alt="Header Logo" className="h-16 w-16 object-contain border-2 border-gray-200 rounded-lg p-2" />
                            <label className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 cursor-pointer transition">
                              Change Logo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => setHeaderLogo(e.target?.result as string);
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            <button
                              onClick={() => setHeaderLogo('')}
                              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                            <div className="text-center">
                              <ImageIcon className="text-gray-400 mx-auto mb-2" style={{ fontSize: 32 }} />
                              <p className="text-sm text-gray-500">Click to upload logo</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (e) => setHeaderLogo(e.target?.result as string);
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Client Logo */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-semibold text-gray-700">
                            Client Logo
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={headerShowClientLogo}
                              onChange={(e) => setHeaderShowClientLogo(e.target.checked)}
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-600">Show in header</span>
                          </label>
                        </div>
                        {headerClientLogo ? (
                          <div className="flex items-center gap-4">
                            <img src={headerClientLogo} alt="Client Logo" className="h-16 w-16 object-contain border-2 border-gray-200 rounded-lg p-2" />
                            <label className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 cursor-pointer transition">
                              Change Logo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => setHeaderClientLogo(e.target?.result as string);
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            <button
                              onClick={() => setHeaderClientLogo('')}
                              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                            <div className="text-center">
                              <ImageIcon className="text-gray-400 mx-auto mb-2" style={{ fontSize: 32 }} />
                              <p className="text-sm text-gray-500">Click to upload client logo</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (e) => setHeaderClientLogo(e.target?.result as string);
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={headerCompanyName}
                          onChange={(e) => setHeaderCompanyName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="DRMHOPE SOFTWARE"
                        />
                      </div>

                      {/* Tagline */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tagline
                        </label>
                        <input
                          type="text"
                          value={headerTagline}
                          onChange={(e) => setHeaderTagline(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Empowering businesses with intelligent AI agents"
                        />
                      </div>

                      {/* Colors Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Background Color
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={headerBgColor}
                              onChange={(e) => setHeaderBgColor(e.target.value)}
                              className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={headerBgColor}
                              onChange={(e) => setHeaderBgColor(e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="#DC2626"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Text Color
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={headerTextColor}
                              onChange={(e) => setHeaderTextColor(e.target.value)}
                              className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={headerTextColor}
                              onChange={(e) => setHeaderTextColor(e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="#FFFFFF"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Layout */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Layout
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="headerLayout"
                              checked={headerLayout === 'horizontal'}
                              onChange={() => setHeaderLayout('horizontal')}
                              className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-sm text-gray-700">Horizontal</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="headerLayout"
                              checked={headerLayout === 'vertical'}
                              onChange={() => setHeaderLayout('vertical')}
                              className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-sm text-gray-700">Vertical</span>
                          </label>
                        </div>
                      </div>

                      {/* Contact Information Toggle */}
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={headerShowContact}
                            onChange={(e) => setHeaderShowContact(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded"
                          />
                          <span className="text-sm font-semibold text-gray-700">Show Contact Information</span>
                        </label>
                      </div>

                      {/* Contact Fields */}
                      {headerShowContact && (
                        <div className="pl-6 border-l-4 border-primary-200 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone
                            </label>
                            <input
                              type="text"
                              value={headerContactPhone}
                              onChange={(e) => setHeaderContactPhone(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="+91 937-3111-709"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={headerContactEmail}
                              onChange={(e) => setHeaderContactEmail(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="murali@drmhope.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Website
                            </label>
                            <input
                              type="text"
                              value={headerContactWebsite}
                              onChange={(e) => setHeaderContactWebsite(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="www.drmhope.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={headerContactAddress}
                              onChange={(e) => setHeaderContactAddress(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Nagpur, Maharashtra, India"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FOOTER CUSTOMIZATION */}
                  <div className="border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary-600 rounded"></span>
                      Footer Customization
                    </h3>

                    <div className="space-y-6">
                      {/* Footer Text */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Footer Text
                        </label>
                        <textarea
                          value={footerText}
                          onChange={(e) => setFooterText(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="DRMHOPE SOFTWARE | Empowering businesses with intelligent AI agents"
                        />
                      </div>

                      {/* Colors Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Background Color
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={footerBgColor}
                              onChange={(e) => setFooterBgColor(e.target.value)}
                              className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={footerBgColor}
                              onChange={(e) => setFooterBgColor(e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="#1F2937"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Text Color
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={footerTextColor}
                              onChange={(e) => setFooterTextColor(e.target.value)}
                              className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={footerTextColor}
                              onChange={(e) => setFooterTextColor(e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="#FFFFFF"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Font Size: {footerFontSize}px
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="20"
                          value={footerFontSize}
                          onChange={(e) => setFooterFontSize(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>10px</span>
                          <span>15px</span>
                          <span>20px</span>
                        </div>
                      </div>

                      {/* Text Alignment */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Text Alignment
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="footerAlignment"
                              checked={footerAlignment === 'left'}
                              onChange={() => setFooterAlignment('left')}
                              className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-sm text-gray-700">Left</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="footerAlignment"
                              checked={footerAlignment === 'center'}
                              onChange={() => setFooterAlignment('center')}
                              className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-sm text-gray-700">Center</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="footerAlignment"
                              checked={footerAlignment === 'right'}
                              onChange={() => setFooterAlignment('right')}
                              className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-sm text-gray-700">Right</span>
                          </label>
                        </div>
                      </div>

                      {/* Border Options */}
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer mb-3">
                          <input
                            type="checkbox"
                            checked={footerShowBorder}
                            onChange={(e) => setFooterShowBorder(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded"
                          />
                          <span className="text-sm font-semibold text-gray-700">Show Top Border</span>
                        </label>
                        {footerShowBorder && (
                          <div className="pl-6 border-l-4 border-primary-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Border Color
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={footerBorderColor}
                                onChange={(e) => setFooterBorderColor(e.target.value)}
                                className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={footerBorderColor}
                                onChange={(e) => setFooterBorderColor(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="#DC2626"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PREVIEW SECTION */}
                  <div className="border-2 border-primary-200 rounded-lg p-6 bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary-600 rounded"></span>
                      Live Preview
                    </h3>

                    {/* Header Preview */}
                    <div
                      className="mb-6 rounded-lg overflow-hidden shadow-lg"
                      style={{
                        backgroundColor: headerBgColor,
                        color: headerTextColor,
                        padding: headerLayout === 'horizontal' ? '2rem' : '2rem',
                      }}
                    >
                      {headerLayout === 'horizontal' ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {headerLogo && <img src={headerLogo} alt="Logo" className="h-12 w-auto" />}
                            <div>
                              <h3 className="font-bold text-xl">{headerCompanyName}</h3>
                              <p className="text-sm opacity-90">{headerTagline}</p>
                            </div>
                          </div>
                          {headerShowContact && (
                            <div className="text-right text-sm">
                              <p>{headerContactPhone}</p>
                              <p>{headerContactEmail}</p>
                              <p>{headerContactWebsite}</p>
                              <p>{headerContactAddress}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center">
                          {headerLogo && <img src={headerLogo} alt="Logo" className="h-16 w-auto mx-auto mb-3" />}
                          <h3 className="font-bold text-2xl mb-1">{headerCompanyName}</h3>
                          <p className="text-sm opacity-90 mb-3">{headerTagline}</p>
                          {headerShowContact && (
                            <div className="text-sm">
                              <p>{headerContactPhone} | {headerContactEmail}</p>
                              <p>{headerContactWebsite} | {headerContactAddress}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Preview */}
                    <div
                      className="rounded-lg overflow-hidden shadow-lg"
                      style={{
                        backgroundColor: footerBgColor,
                        color: footerTextColor,
                        padding: '1.5rem',
                        fontSize: `${footerFontSize}px`,
                        textAlign: footerAlignment,
                        borderTop: footerShowBorder ? `3px solid ${footerBorderColor}` : 'none',
                      }}
                    >
                      {footerText}
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={saveFormattingPreferences}
                    disabled={saving}
                    className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    {saving ? 'Saving...' : 'Save Header & Footer Settings'}
                  </button>
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
                            Title {newContent.category === 'image' && (
                              <span className="text-xs text-gray-500 font-normal">(auto-filled from filename, you can edit)</span>
                            )}
                          </label>
                          <input
                            ref={titleInputRef}
                            type="text"
                            value={newContent.title}
                            onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                            placeholder={
                              newContent.category === 'image'
                                ? "e.g., Company Logo, Client ABC Logo, Product Image"
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
                            <option value="image">Images & Logos</option>
                          </select>
                        </div>

                        {/* Subcategory for Images */}
                        {newContent.category === 'image' && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Image Type</label>
                            <select
                              value={newContent.metadata?.subcategory || 'company_logo'}
                              onChange={(e) => setNewContent({
                                ...newContent,
                                metadata: { ...newContent.metadata, subcategory: e.target.value as any }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="company_logo">Company Logo</option>
                              <option value="client_logo">Client Logo</option>
                              <option value="general_image">General Image</option>
                            </select>
                          </div>
                        )}

                        {/* Image Upload for Images */}
                        {newContent.category === 'image' ? (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Upload {newContent.metadata?.subcategory === 'company_logo' ? 'Company Logo' : newContent.metadata?.subcategory === 'client_logo' ? 'Client Logo' : 'Image'}
                            </label>
                            <div className="space-y-4">
                              <input
                                type="file"
                                id="logo-upload"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      // Extract filename without extension for the title
                                      const fileName = file.name.replace(/\.[^/.]+$/, '');

                                      // Show loading state
                                      setNewContent({
                                        ...newContent,
                                        title: newContent.title || fileName,
                                        content: '' // Clear content while processing
                                      });

                                      // Compress the image
                                      const compressedImage = await compressImage(file);

                                      setNewContent({
                                        ...newContent,
                                        content: compressedImage,
                                        title: newContent.title || fileName
                                      });
                                    } catch (error) {
                                      console.error('Error processing image:', error);
                                      alert('Failed to process image. Please try a different file.');
                                    }
                                  }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                              />
                              {newContent.content && (
                                <div className="mt-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-600">Preview:</p>
                                    <p className="text-xs text-gray-500">
                                      Size: {(newContent.content.length / 1024).toFixed(1)} KB
                                      {newContent.content.length > 500000 && (
                                        <span className="text-orange-600 ml-1">(Large - may take longer to save)</span>
                                      )}
                                    </p>
                                  </div>
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
                    {['bank_details', 'company_info', 'payment_terms', 'standard_clause', 'company_logo', 'client_logo', 'general_image'].map((category) => {
                    const categoryIcons = {
                      bank_details: AccountBalanceIcon,
                      company_info: BusinessIcon,
                      payment_terms: CreditCardIcon,
                      standard_clause: DescriptionIcon,
                      company_logo: ImageIcon,
                      client_logo: ImageIcon,
                      general_image: ImageIcon
                    };
                    const categoryNames = {
                      bank_details: 'Bank Details',
                      company_info: 'Company Information',
                      payment_terms: 'Payment Terms',
                      standard_clause: 'Standard Clauses',
                      company_logo: 'Company Logos',
                      client_logo: 'Client Logos',
                      general_image: 'General Images'
                    };
                    const Icon = categoryIcons[category as keyof typeof categoryIcons];
                    // Filter items based on category (for non-image) or subcategory (for images)
                    const items = category === 'company_logo' || category === 'client_logo' || category === 'general_image'
                      ? savedContent.filter(item => item.category === 'image' && item.metadata?.subcategory === category)
                      : savedContent.filter(item => item.category === category);

                    return (
                      <div key={category} className="border border-gray-200 rounded-lg p-4">
                        <div
                          className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition"
                          onDoubleClick={() => {
                            setShowAddContent(true);
                            setEditingContent(null);
                            // Handle image subcategories
                            if (category === 'company_logo' || category === 'client_logo' || category === 'general_image') {
                              setNewContent({
                                title: '',
                                content: '',
                                category: 'image',
                                metadata: { subcategory: category as any }
                              });
                            } else {
                              setNewContent({ title: '', content: '', category: category as any });
                            }
                          }}
                          title="Double-click to add new content in this category"
                        >
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
                                {item.category === 'image' ? (
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
                                        {item.metadata?.subcategory === 'company_logo' ? 'Company Logo' :
                                         item.metadata?.subcategory === 'client_logo' ? 'Client Logo' :
                                         item.metadata?.subcategory === 'general_image' ? 'General Image' : 'Image'}
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
