# Professional Proposal System - Implementation Guide

## Overview
This document describes the complete professional proposal/template creation system with letterhead backgrounds, logo integration, and saved content management.

## System Components

### 1. SavedContentPanel Component
**Location:** `/components/SavedContentPanel.tsx`

**Purpose:** Provides a comprehensive sidebar panel for quick insertion of saved content and logos into proposals.

**Features:**
- Category-based organization (Bank Details, Company Info, Payment Terms, Clauses, Logos)
- Search functionality
- Expandable/collapsible categories
- Logo preview
- One-click insertion
- Link to settings for management

**Usage:**
```tsx
import SavedContentPanel from '@/components/SavedContentPanel';

<SavedContentPanel
  onInsertContent={(content) => insertContentAtCursor(content, editableRef.current!)}
  onInsertLogo={(logoUrl, type) => insertLogoAtCursor(logoUrl, type === 'company' ? 'Company Logo' : 'Client Logo', editableRef.current!)}
/>
```

### 2. HTML Generation Utility
**Location:** `/utils/proposalHTMLGenerator.ts`

**Purpose:** Generates professional, print-ready HTML with letterhead backgrounds and proper styling.

**Key Functions:**
- `generateProposalHTML(proposal, options)` - Full HTML document generation
- `generateProposalPreviewHTML(proposal, options)` - Preview HTML (body only)
- `downloadProposalHTML(proposal, options)` - Direct download functionality

**Features:**
- Letterhead as background image
- A4-sized pages (210mm × 297mm)
- Print-optimized CSS with @media print rules
- Logo placement options (top-center, top-left, top-right, next-to-title)
- Logo layout options (side-by-side, stacked, opposite-sides)
- Customizable colors, fonts, margins
- Page numbers
- Professional styling
- Base64 image embedding support

**Options:**
```typescript
interface ProposalHTMLOptions {
  letterhead?: string;          // Base64 or URL
  companyLogo?: string;
  clientLogo?: string;
  logoPosition?: 'top-center' | 'top-left' | 'top-right' | 'next-to-title';
  logoSize?: 'small' | 'medium' | 'large';
  logoLayout?: 'side-by-side' | 'stacked' | 'opposite-sides';
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  headingColor?: string;
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  pageMarginTop?: number;
  pageMarginBottom?: number;
  pageMarginLeft?: number;
  pageMarginRight?: number;
  includePageNumbers?: boolean;
  includeHeader?: boolean;
  includeFooter?: boolean;
}
```

### 3. Editor Helper Functions
**Location:** `/utils/proposalEditorHelpers.ts`

**Purpose:** Utility functions for proposal editor integration.

**Key Functions:**
- `fetchUserBrandingSettings()` - Load letterhead and preferences
- `insertContentAtCursor()` - Insert content at cursor position
- `insertLogoAtCursor()` - Insert logo images
- `extractProposalDataFromHTML()` - Convert editor HTML to data
- `getHTMLOptionsFromProposal()` - Generate export options
- `applyLetterheadBackground()` - Apply letterhead to preview
- `exportProposalAsHTML()` - Export with all settings
- `saveProposalCustomization()` - Save customization to database

## Integration Steps

### Step 1: Update Proposal Editor Imports

Add to `/app/proposals/[id]/page.tsx`:

```typescript
import SavedContentPanel from '@/components/SavedContentPanel';
import {
  fetchUserBrandingSettings,
  insertContentAtCursor,
  insertLogoAtCursor,
  applyLetterheadBackground,
  removeLetterheadBackground,
  exportProposalAsHTML,
  getHTMLOptionsFromProposal
} from '@/utils/proposalEditorHelpers';
import { generateProposalHTML, downloadProposalHTML } from '@/utils/proposalHTMLGenerator';
```

### Step 2: Add State Variables

Add these state variables to the editor component:

```typescript
const [letterhead, setLetterhead] = useState<string>('');
const [formattingPrefs, setFormattingPrefs] = useState<any>({});
const [showLetterhead, setShowLetterhead] = useState(true);
```

### Step 3: Fetch Branding Settings on Mount

Add useEffect to load letterhead and formatting preferences:

```typescript
useEffect(() => {
  async function loadBrandingSettings() {
    const settings = await fetchUserBrandingSettings();
    if (settings.letterhead) {
      setLetterhead(settings.letterhead);
    }
    if (settings.formattingPrefs) {
      setFormattingPrefs(settings.formattingPrefs);
    }
  }

  loadBrandingSettings();
}, []);
```

### Step 4: Apply Letterhead to Editor

Update the editor contenteditable div to include letterhead:

```typescript
useEffect(() => {
  if (editableRef.current && letterhead && showLetterhead) {
    applyLetterheadBackground(editableRef.current, letterhead);
  } else if (editableRef.current) {
    removeLetterheadBackground(editableRef.current);
  }
}, [letterhead, showLetterhead]);
```

### Step 5: Replace Quick Insert with SavedContentPanel

Find the existing "Quick Insert" section in the sidebar (around line 1238-1293) and replace it with:

```tsx
<div className="mt-4 pt-4 border-t border-gray-200">
  <SavedContentPanel
    onInsertContent={(content) => {
      if (editMode && editableRef.current) {
        const success = insertContentAtCursor(content, editableRef.current);
        if (success) {
          toast.success('Content inserted successfully');
        } else {
          toast.error('Failed to insert content');
        }
      } else {
        toast.error('Please enable Edit Mode to insert content');
      }
    }}
    onInsertLogo={(logoUrl, type) => {
      if (editMode && editableRef.current) {
        const alt = type === 'company' ? 'Company Logo' : 'Client Logo';
        const success = insertLogoAtCursor(logoUrl, alt, editableRef.current);
        if (success) {
          toast.success(`${alt} inserted successfully`);
        } else {
          toast.error('Failed to insert logo');
        }
      } else {
        toast.error('Please enable Edit Mode to insert images');
      }
    }}
  />
</div>
```

### Step 6: Add Letterhead Toggle to Customization Panel

In the customization panel (around line 1300), add a letterhead toggle:

```tsx
{/* Letterhead Toggle */}
{letterhead && (
  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-gray-800 mb-1">Letterhead Background</h4>
        <p className="text-sm text-gray-600">Show your company letterhead as background</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={showLetterhead}
          onChange={(e) => setShowLetterhead(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
      </label>
    </div>
  </div>
)}
```

### Step 7: Update HTML Export Function

Replace or enhance the existing export function with:

```typescript
const handleExportHTML = async () => {
  try {
    setDownloading(true);

    const userSettings = {
      letterhead,
      formattingPrefs,
    };

    await exportProposalAsHTML(proposal, content, userSettings);

    toast.success('HTML exported successfully!');
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Failed to export HTML');
  } finally {
    setDownloading(false);
  }
};
```

### Step 8: Add Export Button

Add an HTML export button to the toolbar:

```tsx
<button
  onClick={handleExportHTML}
  disabled={downloading}
  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
>
  <DownloadIcon fontSize="small" />
  {downloading ? 'Exporting...' : 'Export HTML'}
</button>
```

## Testing Checklist

### Settings Page Tests
- [ ] Upload letterhead image in Settings → Branding
- [ ] Verify AI analysis extracts colors and layout info
- [ ] Add bank details in Saved Content
- [ ] Add company information in Saved Content
- [ ] Add payment terms in Saved Content
- [ ] Upload company logos in Saved Content
- [ ] Upload client logos in Saved Content
- [ ] Verify all saved content appears in the list

### Proposal Creation Tests
- [ ] Create new proposal
- [ ] Enter client details
- [ ] Generate with AI or create manually
- [ ] Verify proposal opens in editor

### Editor Tests
- [ ] Verify SavedContentPanel appears in sidebar
- [ ] Search for saved content works
- [ ] Click to insert bank details → content appears in editor
- [ ] Click to insert company logo → logo appears in editor
- [ ] Click to insert client logo → logo appears in editor
- [ ] Toggle letterhead background on/off → background changes
- [ ] Upload logos via Customization panel → logos appear
- [ ] Change logo position → layout updates
- [ ] Change logo size → size updates
- [ ] Change colors → preview updates

### HTML Export Tests
- [ ] Click "Export HTML" button
- [ ] Open exported HTML file in browser
- [ ] Verify letterhead appears as background
- [ ] Verify logos are embedded and display correctly
- [ ] Verify content is properly formatted
- [ ] Print preview (Ctrl/Cmd + P) → verify A4 layout
- [ ] Check margins are correct
- [ ] Check colors match settings
- [ ] Check fonts match settings
- [ ] Verify page numbers appear (if enabled)

### Print/PDF Tests
- [ ] Open exported HTML in browser
- [ ] Print to PDF
- [ ] Verify PDF quality is professional
- [ ] Verify letterhead background is visible
- [ ] Verify logos are crisp and clear
- [ ] Verify text is readable
- [ ] Verify no content is cut off
- [ ] Check multiple pages if applicable

## Database Schema Notes

### profiles Table
Letterhead and preferences are stored in the `preferences` JSONB field:
```json
{
  "letterhead": "data:image/png;base64,...",
  "letterhead_data": {
    "primaryColor": "#DC2626",
    "secondaryColor": "#000000",
    "logoPosition": "top-center",
    ...
  },
  "website": "https://company.com",
  ...
}
```

### saved_content Table
```sql
CREATE TABLE saved_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### formatting_preferences Table
```sql
CREATE TABLE formatting_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  font_family TEXT DEFAULT 'Arial, Helvetica, sans-serif',
  font_size_base INTEGER DEFAULT 12,
  primary_color TEXT DEFAULT '#DC2626',
  secondary_color TEXT DEFAULT '#000000',
  page_margin_top INTEGER DEFAULT 20,
  page_margin_bottom INTEGER DEFAULT 20,
  page_margin_left INTEGER DEFAULT 20,
  page_margin_right INTEGER DEFAULT 20,
  ...
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints Used

- `GET /api/user/profile` - Fetch user profile and letterhead
- `PATCH /api/user/profile` - Update profile and letterhead
- `GET /api/saved-content` - Fetch all saved content
- `POST /api/saved-content` - Create new saved content
- `GET /api/formatting-preferences` - Fetch formatting preferences
- `POST /api/formatting-preferences` - Update formatting preferences
- `GET /api/proposals/:id` - Fetch proposal
- `PATCH /api/proposals/:id` - Update proposal and metadata

## Features Implemented

### ✅ Completed Features
1. **SavedContentPanel Component**
   - Category-based organization
   - Search functionality
   - Logo preview
   - Quick insert

2. **HTML Generation System**
   - Letterhead background support
   - Logo embedding (base64)
   - A4-sized pages
   - Print-ready CSS
   - Professional styling
   - Page numbers
   - Customizable fonts, colors, margins

3. **Editor Helper Functions**
   - Content insertion at cursor
   - Logo insertion at cursor
   - Letterhead background application
   - HTML export with settings

4. **Saved Content System**
   - Bank details storage
   - Company info storage
   - Payment terms storage
   - Standard clauses storage
   - Logo storage (company & client)
   - Category-based organization

5. **Settings Integration**
   - Letterhead upload and AI analysis
   - Color extraction
   - Layout detection
   - Saved content management
   - Formatting preferences

## User Workflow

### 1. Setup (One-time)
```
Settings → Branding
  ↓
Upload Letterhead
  ↓
AI Analyzes Colors & Layout
  ↓
Settings → Saved Content
  ↓
Add Bank Details, Company Info, Payment Terms, Logos
  ↓
Settings → Formatting
  ↓
Configure Fonts, Colors, Margins
```

### 2. Create Proposal
```
Proposals → New Proposal
  ↓
Select Template
  ↓
Enter Client Details
  ↓
Generate with AI (optional)
  ↓
Opens in Editor
```

### 3. Edit Proposal
```
Editor → Enable Edit Mode
  ↓
Sidebar → SavedContentPanel
  ↓
Click to Insert Bank Details
  ↓
Click to Insert Company Logo
  ↓
Click to Insert Client Logo
  ↓
Edit Text Manually or with AI
  ↓
Customize → Toggle Letterhead
  ↓
Customize → Adjust Logo Position/Size
```

### 4. Export
```
Editor → Export HTML Button
  ↓
Downloads Professional HTML
  ↓
Open in Browser
  ↓
Print to PDF
  ↓
Send to Client
```

## Architecture Benefits

### 1. Separation of Concerns
- `SavedContentPanel` - UI component
- `proposalHTMLGenerator` - HTML generation logic
- `proposalEditorHelpers` - Integration utilities
- API routes - Data persistence

### 2. Reusability
- SavedContentPanel can be used in other editors
- HTML generator can be used for email templates
- Helper functions work with any contenteditable element

### 3. Maintainability
- Clean, documented code
- TypeScript type safety
- Modular architecture
- Easy to test

### 4. Scalability
- Support for unlimited saved content
- Support for multiple letterheads (future)
- Support for templates (future)
- Support for team sharing (future)

## Future Enhancements

### Planned Features
1. **Template System**
   - Pre-built proposal templates
   - Industry-specific templates
   - Template marketplace

2. **Advanced Logo Management**
   - Logo positioning on specific pages
   - Multiple logos per proposal
   - Logo watermarks

3. **Collaboration**
   - Share saved content with team
   - Template sharing
   - Team letterhead library

4. **PDF Generation**
   - Direct PDF export (without HTML intermediate)
   - Better print quality
   - Embedded fonts

5. **Version Control**
   - Track proposal versions
   - Compare versions
   - Restore previous versions

6. **Analytics**
   - Track which saved content is most used
   - Template effectiveness
   - Client engagement with proposals

## Troubleshooting

### Letterhead Not Showing
- Check if letterhead is uploaded in Settings → Branding
- Verify letterhead toggle is enabled in editor
- Check browser console for image loading errors
- Verify base64 encoding is correct

### Logos Not Appearing in HTML Export
- Ensure logos are saved as base64 in saved_content
- Check logo URLs are valid
- Verify proposal metadata includes logo references
- Check browser console for errors

### Content Not Inserting
- Ensure Edit Mode is enabled
- Check cursor is inside contenteditable area
- Verify saved content exists in database
- Check browser console for JavaScript errors

### Print Quality Issues
- Use "Export HTML" instead of "Download PDF" from editor
- Open HTML in browser and use Print → Save as PDF
- Check browser print settings (margins, scale)
- Verify letterhead image resolution is high enough (300 DPI recommended)

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all API endpoints return 200 status
3. Check database tables have correct data
4. Review this documentation
5. Contact development team

## Version History

- **v2.1.0** (2025-10-31) - Initial implementation
  - SavedContentPanel component
  - HTML generation system
  - Editor helper functions
  - Letterhead support
  - Saved content integration
