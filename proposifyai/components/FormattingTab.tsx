'use client';

import FormatSizeIcon from '@mui/icons-material/FormatSize';
import PaletteIcon from '@mui/icons-material/Palette';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import ViewListIcon from '@mui/icons-material/ViewList';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface FormattingTabProps {
  formattingPrefs: any;
  setFormattingPrefs: (prefs: any) => void;
  saveFormattingPreferences: () => void;
  saving: boolean;
  loading: boolean;
  error: string | null;
}

export default function FormattingTab({
  formattingPrefs,
  setFormattingPrefs,
  saveFormattingPreferences,
  saving,
  loading,
  error
}: FormattingTabProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Formatting Preferences</h2>
          <p className="text-sm text-gray-600 mt-1">Customize default formatting for all proposals</p>
        </div>
        <button
          onClick={saveFormattingPreferences}
          disabled={saving}
          className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Loading formatting preferences...</div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          {error}
        </div>
      )}

      {!loading && (
        <div className="space-y-8">
          {/* Typography Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FormatSizeIcon className="text-primary-600" />
              Typography
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={formattingPrefs.font_family}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, font_family: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Arial, Helvetica, sans-serif">Arial</option>
                  <option value="'Times New Roman', Times, serif">Times New Roman</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Courier New', Courier, monospace">Courier New</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Font Size (pt)
                </label>
                <input
                  type="number"
                  min="8"
                  max="24"
                  value={formattingPrefs.font_size_base}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, font_size_base: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading 1 Size (pt)
                </label>
                <input
                  type="number"
                  min="16"
                  max="48"
                  value={formattingPrefs.font_size_heading_1}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, font_size_heading_1: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Line Height
                </label>
                <input
                  type="number"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={formattingPrefs.line_height}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, line_height: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Logo & Branding Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PaletteIcon className="text-primary-600" />
              Logo & Branding Defaults
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Set default logo preferences that will be applied to all new proposals. These can be customized per-proposal in the editor.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Logo Position
                </label>
                <select
                  value={formattingPrefs.default_logo_position || 'top-center'}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, default_logo_position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="top-center">Top Center</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="next-to-title">Next to Title</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Logo Size
                </label>
                <select
                  value={formattingPrefs.default_logo_size || 'medium'}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, default_logo_size: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="small">Small (60px)</option>
                  <option value="medium">Medium (100px)</option>
                  <option value="large">Large (150px)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Logo Layout
                </label>
                <select
                  value={formattingPrefs.default_logo_layout || 'side-by-side'}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, default_logo_layout: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="side-by-side">Side by Side</option>
                  <option value="stacked">Stacked (Vertical)</option>
                  <option value="opposite-sides">Opposite Sides</option>
                </select>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Upload your company and client logos in the <strong>Saved Content</strong> tab, then insert them from the Quick Insert panel when editing proposals. Logo defaults will apply automatically.
              </p>
            </div>
          </div>

          {/* Colors Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PaletteIcon className="text-primary-600" />
              Colors
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={formattingPrefs.primary_color}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, primary_color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <span className="text-xs text-gray-500 mt-1 block">{formattingPrefs.primary_color}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <input
                  type="color"
                  value={formattingPrefs.secondary_color}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, secondary_color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <span className="text-xs text-gray-500 mt-1 block">{formattingPrefs.secondary_color}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <input
                  type="color"
                  value={formattingPrefs.text_color}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, text_color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <span className="text-xs text-gray-500 mt-1 block">{formattingPrefs.text_color}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading Color
                </label>
                <input
                  type="color"
                  value={formattingPrefs.heading_color}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, heading_color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <span className="text-xs text-gray-500 mt-1 block">{formattingPrefs.heading_color}</span>
              </div>
            </div>
          </div>

          {/* Spacing Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <SpaceBarIcon className="text-primary-600" />
              Spacing & Layout
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Spacing (px)
                </label>
                <input
                  type="number"
                  min="10"
                  max="80"
                  value={formattingPrefs.section_spacing}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, section_spacing: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paragraph Spacing (px)
                </label>
                <input
                  type="number"
                  min="4"
                  max="40"
                  value={formattingPrefs.paragraph_spacing}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, paragraph_spacing: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Margins (mm)
                </label>
                <input
                  type="number"
                  min="10"
                  max="50"
                  value={formattingPrefs.page_margin_top}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setFormattingPrefs({
                      ...formattingPrefs,
                      page_margin_top: value,
                      page_margin_bottom: value,
                      page_margin_left: value,
                      page_margin_right: value
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Section Preferences */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ViewListIcon className="text-primary-600" />
              Default Sections
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'include_cover_page', label: 'Cover Page' },
                { key: 'include_table_of_contents', label: 'Table of Contents' },
                { key: 'include_executive_summary', label: 'Executive Summary' },
                { key: 'include_project_overview', label: 'Project Overview' },
                { key: 'include_scope_of_work', label: 'Scope of Work' },
                { key: 'include_methodology', label: 'Methodology' },
                { key: 'include_timeline', label: 'Timeline' },
                { key: 'include_team', label: 'Team' },
                { key: 'include_pricing', label: 'Pricing' },
                { key: 'include_terms_conditions', label: 'Terms & Conditions' },
                { key: 'include_payment_schedule', label: 'Payment Schedule' },
                { key: 'include_case_studies', label: 'Case Studies' },
                { key: 'include_testimonials', label: 'Testimonials' },
                { key: 'include_appendix', label: 'Appendix' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formattingPrefs[key] || false}
                    onChange={(e) => setFormattingPrefs({ ...formattingPrefs, [key]: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Content Length Preferences */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckBoxIcon className="text-primary-600" />
              Content Length
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Executive Summary
                </label>
                <select
                  value={formattingPrefs.executive_summary_length}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, executive_summary_length: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Overview
                </label>
                <select
                  value={formattingPrefs.project_overview_length}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, project_overview_length: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scope of Work
                </label>
                <select
                  value={formattingPrefs.scope_of_work_length}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, scope_of_work_length: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="brief">Brief</option>
                  <option value="detailed">Detailed</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Styling Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Styling Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading Style
                </label>
                <select
                  value={formattingPrefs.heading_style}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, heading_style: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="underline">Underline</option>
                  <option value="bold-underline">Bold + Underline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  List Style
                </label>
                <select
                  value={formattingPrefs.list_style}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, list_style: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="bullet">Bullet Points</option>
                  <option value="number">Numbers</option>
                  <option value="dash">Dashes</option>
                  <option value="checkmark">Checkmarks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Style
                </label>
                <select
                  value={formattingPrefs.table_style}
                  onChange={(e) => setFormattingPrefs({ ...formattingPrefs, table_style: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="borderless">Borderless</option>
                  <option value="bordered">Bordered</option>
                  <option value="striped">Striped</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
