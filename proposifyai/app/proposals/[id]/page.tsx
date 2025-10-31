"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BarChartIcon from '@mui/icons-material/BarChart';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PaletteIcon from '@mui/icons-material/Palette';
import UploadIcon from '@mui/icons-material/Upload';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import GavelIcon from '@mui/icons-material/Gavel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArticleIcon from '@mui/icons-material/Article';
import { exportToWordModern } from '@/utils/exportToWord';

export default function EditProposalPage({ params }: { params: { id: string } }) {
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState("");
  const [showCustomization, setShowCustomization] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#DC2626");
  const [companyLogo, setCompanyLogo] = useState("");
  const [clientLogo, setClientLogo] = useState("");
  const [logoPosition, setLogoPosition] = useState<'top-center' | 'top-left' | 'top-right' | 'next-to-title'>('top-center');
  const [logoSize, setLogoSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [logoLayout, setLogoLayout] = useState<'side-by-side' | 'stacked' | 'opposite-sides'>('side-by-side');
  const editableRef = useRef<HTMLDivElement>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailCC, setEmailCC] = useState("");
  const [emailBCC, setEmailBCC] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiProcessing, setAiProcessing] = useState(false);
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [savedContent, setSavedContent] = useState<any[]>([]);
  const [loadingSavedContent, setLoadingSavedContent] = useState(false);
  const [fontFamily, setFontFamily] = useState("Arial, Helvetica, sans-serif");
  const [fontSize, setFontSize] = useState(12);
  const [lineHeight, setLineHeight] = useState(1.9);
  const [useCustomFormatting, setUseCustomFormatting] = useState(false);

  // AI Tools State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [researchTopic, setResearchTopic] = useState("");
  const [pricingContext, setPricingContext] = useState("");
  const [chartData, setChartData] = useState("");
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [imagePrompt, setImagePrompt] = useState("");
  const [aiToolProcessing, setAiToolProcessing] = useState(false);

  // Fetch proposal data on mount
  useEffect(() => {
    async function fetchProposal() {
      try {
        const response = await fetch(`/api/proposals/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProposal(data.data.proposal);

          // Load customization settings from metadata
          const metadata = data.data.proposal.metadata || {};
          if (metadata.primaryColor) setPrimaryColor(metadata.primaryColor);
          if (metadata.companyLogo) setCompanyLogo(metadata.companyLogo);
          if (metadata.clientLogo) setClientLogo(metadata.clientLogo);
          if (metadata.logoPosition) setLogoPosition(metadata.logoPosition);
          if (metadata.logoSize) setLogoSize(metadata.logoSize);
          if (metadata.logoLayout) setLogoLayout(metadata.logoLayout);

          // Load formatting preferences if custom formatting is enabled
          if (metadata.useCustomFormatting) {
            setUseCustomFormatting(true);
            if (metadata.fontFamily) setFontFamily(metadata.fontFamily);
            if (metadata.fontSize) setFontSize(metadata.fontSize);
            if (metadata.lineHeight) setLineHeight(metadata.lineHeight);
          }

          // Initialize email fields
          const proposal = data.data.proposal;
          setEmailTo(proposal.client_email || '');
          setEmailSubject(`Proposal: ${proposal.title}`);
          setEmailBody(`Dear ${proposal.client_name},\n\nPlease find attached our proposal for ${proposal.title}.\n\nWe look forward to the opportunity to work with you on this exciting project.\n\nBest regards,\nDRMHOPE Software`);

          // Convert proposal content to HTML for display
          const proposalContent = data.data.proposal.content || {};
          const html = generateProposalHTML(data.data.proposal, proposalContent, {
            companyLogo: metadata.companyLogo || '',
            clientLogo: metadata.clientLogo || '',
            logoPosition: metadata.logoPosition || 'top-center',
            logoSize: metadata.logoSize || 'medium',
            logoLayout: metadata.logoLayout || 'side-by-side'
          });
          setContent(html);
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProposal();
    // generateProposalHTML is defined in the same component and doesn't change, safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Fetch saved content for Quick Insert
  useEffect(() => {
    async function fetchSavedContent() {
      setLoadingSavedContent(true);
      try {
        const response = await fetch('/api/saved-content');
        if (response.ok) {
          const data = await response.json();
          setSavedContent(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching saved content:", error);
      } finally {
        setLoadingSavedContent(false);
      }
    }

    fetchSavedContent();
  }, []);

  // Regenerate HTML when logo settings change
  useEffect(() => {
    if (proposal && !editMode) {
      const proposalContent = proposal.content || {};
      const html = generateProposalHTML(proposal, proposalContent, {
        companyLogo,
        clientLogo,
        logoPosition,
        logoSize,
        logoLayout
      });
      setContent(html);
    }
    // generateProposalHTML is defined in the same component and doesn't change, safe to omit
    // proposal and editMode are intentionally omitted to only trigger on logo settings changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoPosition, logoSize, logoLayout, companyLogo, clientLogo]);

  // Helper function to generate logo HTML based on settings
  function generateLogoHTML(
    companyLogoUrl: string,
    clientLogoUrl: string,
    position: string,
    size: string,
    layout: string
  ): string {
    if (!companyLogoUrl && !clientLogoUrl) return '';

    const sizeMap = {
      small: '60px',
      medium: '100px',
      large: '150px'
    };
    const maxHeight = sizeMap[size as keyof typeof sizeMap] || '100px';

    let logoHTML = '';

    if (position === 'next-to-title') {
      // Logos appear inline with title - handled separately in title section
      return '';
    }

    const alignMap = {
      'top-center': 'center',
      'top-left': 'left',
      'top-right': 'right'
    };
    const textAlign = alignMap[position as keyof typeof alignMap] || 'center';

    logoHTML += `<div style="text-align: ${textAlign}; margin-bottom: 2rem;">`;

    if (layout === 'side-by-side' && companyLogoUrl && clientLogoUrl) {
      logoHTML += `<div style="display: flex; align-items: center; justify-content: ${textAlign}; gap: 2rem; flex-wrap: wrap;">`;
      logoHTML += `<img src="${companyLogoUrl}" alt="Company Logo" style="max-height: ${maxHeight}; max-width: 200px;" />`;
      logoHTML += `<img src="${clientLogoUrl}" alt="Client Logo" style="max-height: ${maxHeight}; max-width: 200px;" />`;
      logoHTML += `</div>`;
    } else if (layout === 'opposite-sides' && companyLogoUrl && clientLogoUrl) {
      logoHTML += `<div style="display: flex; align-items: center; justify-content: space-between; gap: 2rem;">`;
      logoHTML += `<img src="${companyLogoUrl}" alt="Company Logo" style="max-height: ${maxHeight}; max-width: 200px;" />`;
      logoHTML += `<img src="${clientLogoUrl}" alt="Client Logo" style="max-height: ${maxHeight}; max-width: 200px;" />`;
      logoHTML += `</div>`;
    } else if (layout === 'stacked') {
      logoHTML += `<div style="display: flex; flex-direction: column; align-items: ${textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center'}; gap: 1rem;">`;
      if (companyLogoUrl) {
        logoHTML += `<img src="${companyLogoUrl}" alt="Company Logo" style="max-height: ${maxHeight}; max-width: 200px;" />`;
      }
      if (clientLogoUrl) {
        logoHTML += `<img src="${clientLogoUrl}" alt="Client Logo" style="max-height: ${maxHeight}; max-width: 200px;" />`;
      }
      logoHTML += `</div>`;
    } else {
      // Single logo or default side-by-side
      if (companyLogoUrl) {
        logoHTML += `<img src="${companyLogoUrl}" alt="Company Logo" style="max-height: ${maxHeight}; max-width: 200px; ${clientLogoUrl ? 'margin-right: 2rem;' : ''}" />`;
      }
      if (clientLogoUrl) {
        logoHTML += `<img src="${clientLogoUrl}" alt="Client Logo" style="max-height: ${maxHeight}; max-width: 200px;" />`;
      }
    }

    logoHTML += `</div>`;
    return logoHTML;
  }

  // Generate HTML from proposal content
  function generateProposalHTML(proposal: any, content: any, logoSettings?: {
    companyLogo?: string;
    clientLogo?: string;
    logoPosition?: string;
    logoSize?: string;
    logoLayout?: string;
  }) {
    const {
      companyLogo: companyLogoUrl = '',
      clientLogo: clientLogoUrl = '',
      logoPosition: position = 'top-center',
      logoSize: size = 'medium',
      logoLayout: layout = 'side-by-side'
    } = logoSettings || {};

    let html = `<div class="proposal-content">`;

    // Header with logos
    html += `<div class="proposal-header" style="text-align: center; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 2px solid #e5e7eb;">`;

    // Add logos at top if not next-to-title
    if (position !== 'next-to-title') {
      html += generateLogoHTML(companyLogoUrl, clientLogoUrl, position, size, layout);
    }

    // Title section
    if (position === 'next-to-title' && (companyLogoUrl || clientLogoUrl)) {
      const sizeMap = { small: '40px', medium: '60px', large: '80px' };
      const maxHeight = sizeMap[size as keyof typeof sizeMap] || '60px';

      html += `<div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1rem;">`;
      if (companyLogoUrl) {
        html += `<img src="${companyLogoUrl}" alt="Company Logo" style="max-height: ${maxHeight}; max-width: 150px;" />`;
      }
      html += `<h1 style="font-size: 2.5rem; font-weight: bold; color: #111827; margin: 0;">${proposal.title}</h1>`;
      if (clientLogoUrl) {
        html += `<img src="${clientLogoUrl}" alt="Client Logo" style="max-height: ${maxHeight}; max-width: 150px;" />`;
      }
      html += `</div>`;
    } else {
      html += `<h1 style="font-size: 2.5rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">${proposal.title}</h1>`;
    }

    html += `<h2 style="font-size: 1.5rem; color: #6b7280; margin-bottom: 1rem;">For ${proposal.client_name}</h2>`;
    if (proposal.client_company) {
      html += `<p style="color: #9ca3af;">${proposal.client_company}</p>`;
    }
    html += `<p style="color: #9ca3af; font-size: 0.875rem; margin-top: 1rem;">${new Date(proposal.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>`;
    html += `</div>`;

    // Executive Summary
    if (content.executive_summary) {
      html += `<div class="section" style="margin-bottom: 3rem;">`;
      html += `<h2 style="font-size: 1.875rem; font-weight: bold; color: #111827; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #3b82f6;">Project Overview</h2>`;
      html += `<div style="line-height: 1.75; color: #374151;">${content.executive_summary}</div>`;
      html += `</div>`;
    }

    // Scope of Work
    if (content.scope_of_work) {
      html += `<div class="section" style="margin-bottom: 3rem;">`;
      html += `<h2 style="font-size: 1.875rem; font-weight: bold; color: #111827; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #3b82f6;">Scope of Work</h2>`;
      html += `<div style="line-height: 1.75; color: #374151;">${content.scope_of_work}</div>`;
      html += `</div>`;
    }

    // Pricing
    if (content.pricing_breakdown) {
      html += `<div class="section" style="margin-bottom: 3rem;">`;
      html += `<h2 style="font-size: 1.875rem; font-weight: bold; color: #111827; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #3b82f6;">Investment Breakdown</h2>`;
      html += `<div style="line-height: 1.75; color: #374151;">${content.pricing_breakdown}</div>`;
      html += `</div>`;
    }

    // Timeline
    if (content.timeline) {
      html += `<div class="section" style="margin-bottom: 3rem;">`;
      html += `<h2 style="font-size: 1.875rem; font-weight: bold; color: #111827; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #3b82f6;">Development Timeline</h2>`;
      html += `<div style="line-height: 1.75; color: #374151;">${content.timeline}</div>`;
      html += `</div>`;
    }

    // Terms & Conditions
    if (content.terms) {
      html += `<div class="section" style="margin-bottom: 3rem;">`;
      html += `<h2 style="font-size: 1.875rem; font-weight: bold; color: #111827; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #3b82f6;">Terms & Conditions</h2>`;
      html += `<div style="line-height: 1.75; color: #374151;">${content.terms}</div>`;
      html += `</div>`;
    }

    // Footer
    html += `<div class="proposal-footer" style="text-align: center; margin-top: 4rem; padding-top: 2rem; border-top: 2px solid #e5e7eb;">`;
    html += `<p style="color: #6b7280; margin-bottom: 1rem;">We look forward to partnering with you on this exciting project.</p>`;
    html += `<p style="color: #9ca3af; font-size: 0.875rem;">Please review this proposal and let us know if you have any questions.</p>`;
    html += `</div>`;

    html += `</div>`;
    return html;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      // Get content from editable div if in edit mode
      const contentToSave = editMode && editableRef.current
        ? editableRef.current.innerHTML
        : content;

      await fetch(`/api/proposals/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: {
            ...proposal.content,
            custom_html: contentToSave
          },
          metadata: {
            ...proposal.metadata,
            primaryColor,
            companyLogo,
            clientLogo,
            logoPosition,
            logoSize,
            logoLayout,
            useCustomFormatting,
            ...(useCustomFormatting && {
              fontFamily,
              fontSize,
              lineHeight,
            }),
            lastEdited: new Date().toISOString()
          }
        }),
      });

      // Update local state
      setContent(contentToSave);
      setEditMode(false);

      toast.success("Proposal saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save proposal");
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = () => {
    setEditMode(true);
    // Set content in ref after render
    setTimeout(() => {
      if (editableRef.current) {
        editableRef.current.innerHTML = content;
        editableRef.current.focus();
      }
    }, 0);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleDeleteSection = (sectionName: string) => {
    if (!confirm(`Are you sure you want to delete the ${sectionName} section? This cannot be undone.`)) {
      return;
    }

    if (!editableRef.current) return;

    // Remove section from editable content
    const parser = new DOMParser();
    const doc = parser.parseFromString(editableRef.current.innerHTML, 'text/html');

    // Find and remove the section
    const sections = doc.querySelectorAll('div[style*="margin"]');
    sections.forEach((section) => {
      const heading = section.querySelector('h2');
      if (heading?.textContent?.toLowerCase().includes(sectionName.toLowerCase())) {
        section.remove();
      }
    });

    const updatedContent = doc.body.innerHTML;
    editableRef.current.innerHTML = updatedContent;
  };

  const handleLogoUpload = (type: 'company' | 'client', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (type === 'company') {
        setCompanyLogo(base64);
      } else {
        setClientLogo(base64);
      }

      // Update content with new logo
      updateLogoInContent(type, base64);
    };
    reader.readAsDataURL(file);
  };

  const updateLogoInContent = (type: 'company' | 'client', logoUrl: string) => {
    const currentContent = editMode && editableRef.current
      ? editableRef.current.innerHTML
      : content;
    const parser = new DOMParser();
    const doc = parser.parseFromString(currentContent, 'text/html');

    // Find and update logo image
    const logoClass = type === 'company' ? 'company-logo' : 'client-logo';
    const logoImg = doc.querySelector(`.${logoClass}`) as HTMLImageElement;

    if (logoImg) {
      logoImg.src = logoUrl;
    } else {
      // Add logo if it doesn't exist
      const header = doc.querySelector('.proposal-header');
      if (header) {
        const img = doc.createElement('img');
        img.src = logoUrl;
        img.className = logoClass;
        img.style.cssText = 'max-width: 150px; max-height: 80px; margin: 0 auto; display: block;';
        header.insertBefore(img, header.firstChild);
      }
    }

    const updatedContent = doc.body.innerHTML;
    if (editMode && editableRef.current) {
      editableRef.current.innerHTML = updatedContent;
    } else {
      setContent(updatedContent);
    }
  };

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);

    // Update all color references in content
    const currentContent = editMode && editableRef.current
      ? editableRef.current.innerHTML
      : content;
    const updatedContent = currentContent
      .replace(/#DC2626/g, color)
      .replace(/#B91C1C/g, adjustColorBrightness(color, -20))
      .replace(/#991B1B/g, adjustColorBrightness(color, -40));

    if (editMode && editableRef.current) {
      editableRef.current.innerHTML = updatedContent;
    } else {
      setContent(updatedContent);
    }
  };

  const adjustColorBrightness = (color: string, amount: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Dynamically import html2pdf
      const html2pdf = (await import('html2pdf.js')).default;

      // Create a clean temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = 'position: absolute; left: -9999px; top: 0; width: 210mm; padding: 20px; background: white;';
      tempContainer.innerHTML = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${content}</div>`;
      document.body.appendChild(tempContainer);

      // PDF options for A4 size with proper margins
      const opt = {
        margin: [15, 15, 15, 15] as [number, number, number, number],
        filename: `${proposal?.title || 'Proposal'}_${proposal?.client_name || 'Client'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const,
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Generate PDF from clean content
      await html2pdf().set(opt).from(tempContainer).save();

      // Clean up temporary container
      document.body.removeChild(tempContainer);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleExportToWord = () => {
    try {
      // Get the content and clean it up for Word export
      const cleanContent = content;

      // Export to Word with metadata
      exportToWordModern(cleanContent, `${proposal?.title || 'Proposal'}_${proposal?.client_name || 'Client'}`, {
        title: proposal?.title || 'Proposal',
        author: 'ProposifyAI',
        subject: `Proposal for ${proposal?.client_name || 'Client'}`
      });

      toast.success("Word document downloaded successfully!");
    } catch (error) {
      console.error("Word export error:", error);
      toast.error("Failed to export to Word. Please try again.");
    }
  };

  const handleSend = () => {
    setShowEmailModal(true);
  };

  const handleSendEmail = async () => {
    // Validate email fields
    if (!emailTo.trim()) {
      toast.error("Please enter recipient email address");
      return;
    }

    if (!emailSubject.trim()) {
      toast.error("Please enter email subject");
      return;
    }

    if (!emailBody.trim()) {
      toast.error("Please enter email message");
      return;
    }

    // TODO: Implement actual email sending API
    // For now, just show success message
    toast.success("Email will be sent when email service is configured", {
      duration: 5000,
    });
    setShowEmailModal(false);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString());
      setSelectionRange(selection.getRangeAt(0));
      setShowAIPrompt(true);
    } else {
      setShowAIPrompt(false);
      setSelectedText("");
      setSelectionRange(null);
    }
  };

  const handleAIModification = async (action: string, customPrompt?: string) => {
    if (!selectedText || !selectionRange) return;

    setAiProcessing(true);
    try {
      let prompt = "";
      switch (action) {
        case "summarize":
          prompt = "Summarize this text concisely while keeping the key points:";
          break;
        case "shorten":
          prompt = "Shorten this text to be more concise without losing important information:";
          break;
        case "professional":
          prompt = "Rewrite this text to be more professional and polished:";
          break;
        case "fix":
          prompt = "Fix any grammar, spelling, or clarity issues in this text:";
          break;
        case "custom":
          prompt = customPrompt || "";
          break;
      }

      const response = await fetch("/api/ai/modify-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText,
          instruction: prompt
        })
      });

      if (response.ok) {
        const data = await response.json();
        const modifiedText = data.data.modifiedText;

        // Replace selected text with modified version
        if (editableRef.current && selectionRange) {
          selectionRange.deleteContents();
          const textNode = document.createTextNode(modifiedText);
          selectionRange.insertNode(textNode);

          // Clear selection
          window.getSelection()?.removeAllRanges();
          setShowAIPrompt(false);
          setSelectedText("");
          setSelectionRange(null);
          setAiPrompt("");
        }
      } else {
        toast.error("Failed to modify text. Please try again.");
      }
    } catch (error) {
      console.error("AI modification error:", error);
      toast.error("Error modifying text. Please try again.");
    } finally {
      setAiProcessing(false);
    }
  };

  const handleInsertSavedContent = async (contentItem: any) => {
    if (!editableRef.current || !editMode) {
      toast.error("Please enable Edit Mode to insert content");
      return;
    }

    try {
      // Insert content at cursor position or at the end
      const selection = window.getSelection();
      let range: Range;

      if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
      } else {
        // If no selection, insert at the end
        range = document.createRange();
        range.selectNodeContents(editableRef.current);
        range.collapse(false);
      }

      // Create content node
      const contentNode = document.createElement('div');
      contentNode.innerHTML = contentItem.content;
      contentNode.style.marginTop = '1rem';
      contentNode.style.marginBottom = '1rem';

      // Insert content
      range.deleteContents();
      range.insertNode(contentNode);

      // Move cursor after inserted content
      range.setStartAfter(contentNode);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);

      // Track usage
      await fetch(`/api/saved-content/${contentItem.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'track_usage' })
      });

      // Refresh saved content to update usage count
      const response = await fetch('/api/saved-content');
      if (response.ok) {
        const data = await response.json();
        setSavedContent(data.data || []);
      }

      toast.success(`Inserted: ${contentItem.title}`);
    } catch (error) {
      console.error("Error inserting saved content:", error);
      toast.error("Failed to insert content. Please try again.");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bank_details':
        return <AccountBalanceIcon sx={{ fontSize: 14 }} />;
      case 'company_info':
        return <BusinessIcon sx={{ fontSize: 14 }} />;
      case 'payment_terms':
        return <PaymentIcon sx={{ fontSize: 14 }} />;
      case 'standard_clause':
        return <GavelIcon sx={{ fontSize: 14 }} />;
      case 'image':
        return <ImageIcon sx={{ fontSize: 14 }} />;
      default:
        return <DescriptionIcon sx={{ fontSize: 14 }} />;
    }
  };

  // AI Tool Handlers
  const handleGenerateContent = async () => {
    if (!generatePrompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setAiToolProcessing(true);
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: generatePrompt,
          proposalContext: {
            title: proposal?.title,
            clientName: proposal?.client_name,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generatedContent = data.data.content;

        // Insert generated content
        if (editMode && editableRef.current) {
          const selection = window.getSelection();
          let range: Range;

          if (selection && selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
          } else {
            range = document.createRange();
            range.selectNodeContents(editableRef.current);
            range.collapse(false);
          }

          const contentNode = document.createElement('div');
          contentNode.innerHTML = generatedContent;
          contentNode.style.marginTop = '1rem';
          contentNode.style.marginBottom = '1rem';

          range.deleteContents();
          range.insertNode(contentNode);

          toast.success("Content generated successfully!");
          setShowGenerateModal(false);
          setGeneratePrompt("");
        } else {
          toast.error("Please enable Edit Mode to insert content");
        }
      } else {
        toast.error("Failed to generate content");
      }
    } catch (error) {
      console.error("Generate error:", error);
      toast.error("Error generating content");
    } finally {
      setAiToolProcessing(false);
    }
  };

  const handleResearchTopic = async () => {
    if (!researchTopic.trim()) {
      toast.error("Please enter a research topic");
      return;
    }

    setAiToolProcessing(true);
    try {
      const response = await fetch("/api/ai/scrape-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: researchTopic,
          type: "research",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const researchContent = data.data.content;

        // Insert research content
        if (editMode && editableRef.current) {
          const selection = window.getSelection();
          let range: Range;

          if (selection && selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
          } else {
            range = document.createRange();
            range.selectNodeContents(editableRef.current);
            range.collapse(false);
          }

          const contentNode = document.createElement('div');
          contentNode.innerHTML = `<div style="background: #f0f9ff; padding: 1rem; border-left: 4px solid #3b82f6; margin: 1rem 0;"><h3 style="color: #1e40af; margin-bottom: 0.5rem;">Research: ${researchTopic}</h3><div>${researchContent}</div></div>`;

          range.deleteContents();
          range.insertNode(contentNode);

          toast.success("Research completed!");
          setShowResearchModal(false);
          setResearchTopic("");
        } else {
          toast.error("Please enable Edit Mode to insert content");
        }
      } else {
        toast.error("Failed to complete research");
      }
    } catch (error) {
      console.error("Research error:", error);
      toast.error("Error performing research");
    } finally {
      setAiToolProcessing(false);
    }
  };

  const handleGeneratePricing = async () => {
    if (!pricingContext.trim()) {
      toast.error("Please describe what you're pricing");
      return;
    }

    setAiToolProcessing(true);
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate a detailed pricing breakdown for: ${pricingContext}. Include itemized costs, subtotals, and a total. Format as an HTML table with professional styling.`,
          proposalContext: {
            title: proposal?.title,
            clientName: proposal?.client_name,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const pricingTable = data.data.content;

        // Insert pricing table
        if (editMode && editableRef.current) {
          const selection = window.getSelection();
          let range: Range;

          if (selection && selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
          } else {
            range = document.createRange();
            range.selectNodeContents(editableRef.current);
            range.collapse(false);
          }

          const contentNode = document.createElement('div');
          contentNode.innerHTML = pricingTable;
          contentNode.style.marginTop = '1.5rem';
          contentNode.style.marginBottom = '1.5rem';

          range.deleteContents();
          range.insertNode(contentNode);

          toast.success("Pricing table generated!");
          setShowPricingModal(false);
          setPricingContext("");
        } else {
          toast.error("Please enable Edit Mode to insert content");
        }
      } else {
        toast.error("Failed to generate pricing");
      }
    } catch (error) {
      console.error("Pricing error:", error);
      toast.error("Error generating pricing");
    } finally {
      setAiToolProcessing(false);
    }
  };

  const handleGenerateChart = async () => {
    if (!chartData.trim()) {
      toast.error("Please enter chart data");
      return;
    }

    setAiToolProcessing(true);
    try {
      // Parse chart data (expecting format like "Item1: 10, Item2: 20, Item3: 30")
      const dataPoints = chartData.split(',').map(item => {
        const [label, value] = item.split(':').map(s => s.trim());
        return { label, value: parseFloat(value) || 0 };
      });

      // Generate simple ASCII/HTML chart
      let chartHTML = `<div style="background: white; padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 8px; margin: 1rem 0;">`;
      chartHTML += `<h3 style="color: #111827; margin-bottom: 1rem; font-size: 1.125rem; font-weight: 600;">Chart: ${chartType.charAt(0).toUpperCase() + chartType.slice(1)}</h3>`;

      if (chartType === 'bar') {
        const maxValue = Math.max(...dataPoints.map(d => d.value));
        chartHTML += `<div style="display: flex; flex-direction: column; gap: 0.75rem;">`;
        dataPoints.forEach(point => {
          const width = (point.value / maxValue) * 100;
          chartHTML += `
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="min-width: 100px; font-size: 0.875rem; color: #6b7280;">${point.label}</div>
              <div style="flex: 1; background: #f3f4f6; border-radius: 4px; height: 28px; position: relative;">
                <div style="background: linear-gradient(90deg, #3b82f6, #2563eb); height: 100%; width: ${width}%; border-radius: 4px; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px;">
                  <span style="color: white; font-weight: 600; font-size: 0.875rem;">${point.value}</span>
                </div>
              </div>
            </div>
          `;
        });
        chartHTML += `</div>`;
      } else if (chartType === 'line') {
        chartHTML += `<div style="display: flex; align-items: flex-end; gap: 1rem; height: 200px; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem;">`;
        const maxValue = Math.max(...dataPoints.map(d => d.value));
        dataPoints.forEach((point, index) => {
          const height = (point.value / maxValue) * 180;
          chartHTML += `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
              <div style="background: linear-gradient(180deg, #3b82f6, #2563eb); width: 100%; height: ${height}px; border-radius: 4px 4px 0 0; position: relative;">
                <span style="position: absolute; top: -24px; left: 50%; transform: translateX(-50%); font-weight: 600; color: #1f2937; font-size: 0.875rem;">${point.value}</span>
              </div>
              <span style="font-size: 0.75rem; color: #6b7280; text-align: center;">${point.label}</span>
            </div>
          `;
        });
        chartHTML += `</div>`;
      } else if (chartType === 'pie') {
        const total = dataPoints.reduce((sum, d) => sum + d.value, 0);
        chartHTML += `<div style="display: flex; gap: 2rem; align-items: center;">`;
        chartHTML += `<div style="width: 200px; height: 200px; border-radius: 50%; background: conic-gradient(`;

        let currentAngle = 0;
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        dataPoints.forEach((point, index) => {
          const percentage = (point.value / total) * 100;
          const angle = (percentage / 100) * 360;
          chartHTML += `${colors[index % colors.length]} ${currentAngle}deg ${currentAngle + angle}deg, `;
          currentAngle += angle;
        });
        chartHTML = chartHTML.slice(0, -2); // Remove last comma
        chartHTML += `); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"></div>`;

        chartHTML += `<div style="flex: 1;">`;
        dataPoints.forEach((point, index) => {
          const percentage = ((point.value / total) * 100).toFixed(1);
          chartHTML += `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <div style="width: 16px; height: 16px; border-radius: 2px; background: ${colors[index % colors.length]};"></div>
              <span style="font-size: 0.875rem; color: #4b5563;">${point.label}: <strong>${point.value}</strong> (${percentage}%)</span>
            </div>
          `;
        });
        chartHTML += `</div></div>`;
      }

      chartHTML += `</div>`;

      // Insert chart
      if (editMode && editableRef.current) {
        const selection = window.getSelection();
        let range: Range;

        if (selection && selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
        } else {
          range = document.createRange();
          range.selectNodeContents(editableRef.current);
          range.collapse(false);
        }

        const contentNode = document.createElement('div');
        contentNode.innerHTML = chartHTML;

        range.deleteContents();
        range.insertNode(contentNode);

        toast.success("Chart generated!");
        setShowChartModal(false);
        setChartData("");
      } else {
        toast.error("Please enable Edit Mode to insert content");
      }
    } catch (error) {
      console.error("Chart error:", error);
      toast.error("Error generating chart. Please check your data format.");
    } finally {
      setAiToolProcessing(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error("Please enter an image description");
      return;
    }

    toast("Image generation feature coming soon! For now, you can upload images via the Customize panel.", {
      duration: 5000,
      icon: "ℹ️",
    });
    setShowImageModal(false);
    setImagePrompt("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Proposal not found</p>
          <Link href="/proposals" className="text-primary-600 hover:text-primary-700">
            Back to Proposals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/proposals" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{proposal.title}</h1>
                <p className="text-xs text-gray-500">
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)} •
                  Last updated {new Date(proposal.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <SaveIcon fontSize="small" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleStartEdit}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <EditIcon fontSize="small" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowCustomization(!showCustomization)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <PaletteIcon fontSize="small" />
                    Customize
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </>
              )}
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50 flex items-center gap-2"
              >
                <DownloadIcon fontSize="small" />
                {downloading ? "Generating..." : "PDF"}
              </button>
              <button
                onClick={handleExportToWord}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                title="Export to Word"
              >
                <ArticleIcon fontSize="small" />
                Word
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <VisibilityIcon fontSize="small" />
                Preview
              </button>
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
              >
                Send to Client
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Editor */}
      <div className="w-full px-4 py-8 bg-gray-100 min-h-screen">
        <div className="flex gap-6 max-w-[1400px] mx-auto">
          {/* Sidebar - AI Tools */}
          {!sidebarCollapsed && (
            <div className="w-56 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-3 border border-gray-100 sticky top-8">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                  <FlashOnIcon className="text-primary-600 mr-1" fontSize="small" />
                  AI Tools
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowGenerateModal(true)}
                    className="w-full px-2 py-1.5 text-xs bg-primary-50 text-primary-700 font-medium rounded hover:bg-primary-100 transition text-left flex items-center gap-1"
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 14 }} /> Generate
                  </button>
                  <button
                    onClick={() => setShowResearchModal(true)}
                    className="w-full px-2 py-1.5 text-xs bg-gray-50 text-gray-700 font-medium rounded hover:bg-gray-100 transition text-left flex items-center gap-1"
                  >
                    <SearchIcon sx={{ fontSize: 14 }} /> Research
                  </button>
                  <button
                    onClick={() => setShowPricingModal(true)}
                    className="w-full px-2 py-1.5 text-xs bg-gray-50 text-gray-700 font-medium rounded hover:bg-gray-100 transition text-left flex items-center gap-1"
                  >
                    <AttachMoneyIcon sx={{ fontSize: 14 }} /> Pricing
                  </button>
                  <button
                    onClick={() => setShowChartModal(true)}
                    className="w-full px-2 py-1.5 text-xs bg-gray-50 text-gray-700 font-medium rounded hover:bg-gray-100 transition text-left flex items-center gap-1"
                  >
                    <BarChartIcon sx={{ fontSize: 14 }} /> Chart
                  </button>
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="w-full px-2 py-1.5 text-xs bg-gray-50 text-gray-700 font-medium rounded hover:bg-gray-100 transition text-left flex items-center gap-1"
                  >
                    <ImageIcon sx={{ fontSize: 14 }} /> Image
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-xs flex items-center gap-1">
                      <BookmarkIcon sx={{ fontSize: 14 }} className="text-primary-600" />
                      Quick Insert
                    </h4>
                    <Link href="/settings?tab=saved-content" className="text-xs text-primary-600 hover:text-primary-700">
                      Manage
                    </Link>
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {loadingSavedContent ? (
                      <div className="text-xs text-gray-500 py-2">Loading...</div>
                    ) : savedContent.length === 0 ? (
                      <div className="text-xs text-gray-500 py-2">
                        <p className="mb-2">No saved content yet.</p>
                        <Link
                          href="/settings?tab=saved-content"
                          className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                          <AddCircleIcon sx={{ fontSize: 14 }} />
                          Add Content
                        </Link>
                      </div>
                    ) : (
                      savedContent
                        .sort((a, b) => (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0))
                        .slice(0, 10)
                        .map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleInsertSavedContent(item)}
                            className="w-full px-2 py-1.5 text-xs bg-gray-50 text-gray-700 rounded hover:bg-primary-50 hover:text-primary-700 transition text-left flex items-center gap-1 group"
                            title={`${item.title} (Used ${item.usage_count || 0} times)`}
                          >
                            {getCategoryIcon(item.category)}
                            <span className="flex-1 truncate">{item.title}</span>
                            {item.is_favorite && <StarIcon sx={{ fontSize: 12 }} className="text-yellow-500" />}
                            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
                              {item.usage_count || 0}
                            </span>
                          </button>
                        ))
                    )}
                  </div>
                  {savedContent.length > 10 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <Link
                        href="/settings?tab=saved-content"
                        className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        View all {savedContent.length} items
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Editor */}
          <div className="flex-1 max-w-[210mm] mx-auto">
            {/* Customization Panel */}
            {showCustomization && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <PaletteIcon className="text-primary-600" />
                    Customize Proposal
                  </h3>
                  <button
                    onClick={() => setShowCustomization(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </div>

                {/* Logo Upload Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon fontSize="small" className="text-primary-600" />
                    Logo Upload
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Logo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Logo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition">
                      {companyLogo ? (
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={companyLogo} alt="Company Logo" className="max-h-20 mx-auto mb-2" />
                          <button
                            onClick={() => setCompanyLogo('')}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <UploadIcon className="mx-auto text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Upload Logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLogoUpload('company', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Client Logo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Logo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition">
                      {clientLogo ? (
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={clientLogo} alt="Client Logo" className="max-h-20 mx-auto mb-2" />
                          <button
                            onClick={() => setClientLogo('')}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <UploadIcon className="mx-auto text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Upload Logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLogoUpload('client', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                </div>

                {/* Logo Customization Options */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon fontSize="small" className="text-primary-600" />
                    Logo Display Settings
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Logo Position */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Logo Position
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="logoPosition"
                            value="top-center"
                            checked={logoPosition === 'top-center'}
                            onChange={(e) => setLogoPosition(e.target.value as any)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-700">Top Center</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="logoPosition"
                            value="top-left"
                            checked={logoPosition === 'top-left'}
                            onChange={(e) => setLogoPosition(e.target.value as any)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-700">Top Left</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="logoPosition"
                            value="top-right"
                            checked={logoPosition === 'top-right'}
                            onChange={(e) => setLogoPosition(e.target.value as any)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-700">Top Right</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="logoPosition"
                            value="next-to-title"
                            checked={logoPosition === 'next-to-title'}
                            onChange={(e) => setLogoPosition(e.target.value as any)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-700">Next to Title</span>
                        </label>
                      </div>
                    </div>

                    {/* Logo Size */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Logo Size
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="logoSize"
                            value="small"
                            checked={logoSize === 'small'}
                            onChange={(e) => setLogoSize(e.target.value as any)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-700">Small (60px)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="logoSize"
                            value="medium"
                            checked={logoSize === 'medium'}
                            onChange={(e) => setLogoSize(e.target.value as any)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-700">Medium (100px)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="logoSize"
                            value="large"
                            checked={logoSize === 'large'}
                            onChange={(e) => setLogoSize(e.target.value as any)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-700">Large (150px)</span>
                        </label>
                      </div>
                    </div>

                    {/* Logo Layout */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Logo Layout
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="logoLayout"
                            value="side-by-side"
                            checked={logoLayout === 'side-by-side'}
                            onChange={(e) => setLogoLayout(e.target.value as any)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-700">Side by Side</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="logoLayout"
                            value="stacked"
                            checked={logoLayout === 'stacked'}
                            onChange={(e) => setLogoLayout(e.target.value as any)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-700">Stacked (Vertical)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="logoLayout"
                            value="opposite-sides"
                            checked={logoLayout === 'opposite-sides'}
                            onChange={(e) => setLogoLayout(e.target.value as any)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-700">Opposite Sides</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Picker Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <PaletteIcon fontSize="small" className="text-primary-600" />
                    Color Theme
                  </h4>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="space-y-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-full h-12 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                        placeholder="#DC2626"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleColorChange('#DC2626')}
                          className="w-8 h-8 rounded bg-red-600 border-2 border-gray-300 hover:border-gray-400"
                          title="Bettroi Red"
                        />
                        <button
                          onClick={() => handleColorChange('#2563EB')}
                          className="w-8 h-8 rounded bg-blue-600 border-2 border-gray-300 hover:border-gray-400"
                          title="Blue"
                        />
                        <button
                          onClick={() => handleColorChange('#059669')}
                          className="w-8 h-8 rounded bg-green-600 border-2 border-gray-300 hover:border-gray-400"
                          title="Green"
                        />
                        <button
                          onClick={() => handleColorChange('#7C3AED')}
                          className="w-8 h-8 rounded bg-purple-600 border-2 border-gray-300 hover:border-gray-400"
                          title="Purple"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formatting Preferences Section */}
                <div className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <DescriptionIcon fontSize="small" className="text-primary-600" />
                      Text Formatting
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useCustomFormatting}
                        onChange={(e) => setUseCustomFormatting(e.target.checked)}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Custom</span>
                    </label>
                  </div>

                  {useCustomFormatting && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      {/* Font Family */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Font Family
                        </label>
                        <select
                          value={fontFamily}
                          onChange={(e) => setFontFamily(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="Arial, Helvetica, sans-serif">Arial</option>
                          <option value="'Times New Roman', Times, serif">Times New Roman</option>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="'Courier New', Courier, monospace">Courier New</option>
                          <option value="Verdana, Geneva, sans-serif">Verdana</option>
                          <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                          <option value="'Palatino Linotype', 'Book Antiqua', Palatino, serif">Palatino</option>
                        </select>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Base Font Size: {fontSize}pt
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="16"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>10pt</span>
                          <span>16pt</span>
                        </div>
                      </div>

                      {/* Line Height */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Line Height: {lineHeight}
                        </label>
                        <input
                          type="range"
                          min="1.2"
                          max="2.5"
                          step="0.1"
                          value={lineHeight}
                          onChange={(e) => setLineHeight(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Tight (1.2)</span>
                          <span>Loose (2.5)</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 italic">
                        These settings will only apply to this proposal
                      </p>
                    </div>
                  )}

                  {!useCustomFormatting && (
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      Using company default formatting. Enable custom formatting to override for this proposal.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Sidebar Toggle & Section Controls */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                {sidebarCollapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
                {sidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
              </button>

              {editMode && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteSection('scope of work')}
                    className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center gap-1"
                  >
                    <DeleteIcon fontSize="small" />
                    Delete Section
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white shadow-xl border border-gray-200 overflow-hidden" style={{ minHeight: '297mm' }}>
              {/* Content Display */}
              <div className="p-12 prose prose-lg max-w-none proposal-content-wrapper">
                {editMode ? (
                  <div className="space-y-3">
                    {/* Edit Mode Instructions */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                            <EditIcon fontSize="small" />
                            Edit Mode Active - AI Assistant Ready
                          </h4>
                          <p className="text-sm text-blue-800 mb-2">
                            You can now edit the document and use AI to enhance your text:
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-700 font-medium">
                              ✏️ Click to edit text
                            </span>
                            <span className="bg-white px-2 py-1 rounded border border-purple-200 text-purple-700 font-medium">
                              🖱️ Select text to see AI options
                            </span>
                            <span className="bg-white px-2 py-1 rounded border border-green-200 text-green-700 font-medium">
                              ✨ AI will appear at bottom
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Editable Content */}
                    <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                      <div
                        ref={editableRef}
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onMouseUp={handleTextSelection}
                        className="bg-white p-6 rounded border border-gray-200 min-h-[500px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700">
              <div className="flex items-center gap-3">
                <VisibilityIcon className="text-white" sx={{ fontSize: 28 }} />
                <h2 className="text-xl font-bold text-white">Proposal Preview</h2>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <div className="bg-white p-8 max-w-4xl mx-auto">
                {/* Proposal Content - Header is already included in content */}
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                This is a preview. Use Download PDF to get the final document.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    handleDownloadPDF();
                  }}
                  className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                >
                  <DownloadIcon fontSize="small" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700">
              <div className="flex items-center gap-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className="text-xl font-bold text-white">Send Proposal to Client</h2>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* To Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
              </div>

              {/* CC Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CC
                </label>
                <input
                  type="email"
                  value={emailCC}
                  onChange={(e) => setEmailCC(e.target.value)}
                  placeholder="cc@example.com (optional, separate multiple with commas)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>

              {/* BCC Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  BCC
                </label>
                <input
                  type="email"
                  value={emailBCC}
                  onChange={(e) => setEmailBCC(e.target.value)}
                  placeholder="bcc@example.com (optional, separate multiple with commas)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Proposal: ..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Enter your cover letter here..."
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y"
                  required
                />
              </div>

              {/* Attachment Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Proposal will be attached as PDF</p>
                    <p className="text-blue-700">The proposal document will be automatically generated and attached to this email.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="text-red-600">*</span> Required fields
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Content Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700">
              <div className="flex items-center gap-3">
                <AutoAwesomeIcon className="text-white" sx={{ fontSize: 28 }} />
                <h2 className="text-xl font-bold text-white">AI Content Generator</h2>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Describe what content you want to generate. Be specific about the topic, tone, and length.
              </p>
              <textarea
                value={generatePrompt}
                onChange={(e) => setGeneratePrompt(e.target.value)}
                placeholder="Example: Write a professional executive summary about implementing a new CRM system for a mid-sized retail company..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y"
              />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-800">
                  💡 <strong>Tip:</strong> Enable Edit Mode before generating to insert content directly into your proposal.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateContent}
                disabled={aiToolProcessing || !generatePrompt.trim()}
                className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {aiToolProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <AutoAwesomeIcon fontSize="small" />
                    Generate Content
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Research Modal */}
      {showResearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center gap-3">
                <SearchIcon className="text-white" sx={{ fontSize: 28 }} />
                <h2 className="text-xl font-bold text-white">AI Research Assistant</h2>
              </div>
              <button
                onClick={() => setShowResearchModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Enter a topic or question to research. AI will gather relevant information and insights.
              </p>
              <input
                type="text"
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                placeholder="Example: Latest trends in cloud computing security"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-800">
                  🔍 <strong>Note:</strong> Research results will be formatted with sources and key findings.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResearchModal(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleResearchTopic}
                disabled={aiToolProcessing || !researchTopic.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {aiToolProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Researching...
                  </>
                ) : (
                  <>
                    <SearchIcon fontSize="small" />
                    Start Research
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700">
              <div className="flex items-center gap-3">
                <AttachMoneyIcon className="text-white" sx={{ fontSize: 28 }} />
                <h2 className="text-xl font-bold text-white">AI Pricing Generator</h2>
              </div>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Describe the service or product you want to price. AI will generate a detailed pricing breakdown.
              </p>
              <textarea
                value={pricingContext}
                onChange={(e) => setPricingContext(e.target.value)}
                placeholder="Example: Website redesign project including UI/UX design, frontend development, backend integration, and 3 months of support"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-y"
              />
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-green-800">
                  💰 <strong>Tip:</strong> Include project scope, timeline, and any specific requirements for better pricing estimates.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowPricingModal(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePricing}
                disabled={aiToolProcessing || !pricingContext.trim()}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {aiToolProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <AttachMoneyIcon fontSize="small" />
                    Generate Pricing
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chart Modal */}
      {showChartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700">
              <div className="flex items-center gap-3">
                <BarChartIcon className="text-white" sx={{ fontSize: 28 }} />
                <h2 className="text-xl font-bold text-white">Chart Generator</h2>
              </div>
              <button
                onClick={() => setShowChartModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Enter your data in the format: <code className="bg-gray-100 px-2 py-1 rounded text-xs">Label1: Value1, Label2: Value2, Label3: Value3</code>
              </p>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chart Type</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="chartType"
                      value="bar"
                      checked={chartType === 'bar'}
                      onChange={(e) => setChartType(e.target.value as any)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Bar Chart</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="chartType"
                      value="line"
                      checked={chartType === 'line'}
                      onChange={(e) => setChartType(e.target.value as any)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Line Chart</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="chartType"
                      value="pie"
                      checked={chartType === 'pie'}
                      onChange={(e) => setChartType(e.target.value as any)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Pie Chart</span>
                  </label>
                </div>
              </div>

              <textarea
                value={chartData}
                onChange={(e) => setChartData(e.target.value)}
                placeholder="Example: Q1: 15000, Q2: 23000, Q3: 31000, Q4: 28000"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-y font-mono text-sm"
              />
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-purple-800">
                  📊 <strong>Tip:</strong> Use descriptive labels and numeric values. Charts will be styled professionally.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowChartModal(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateChart}
                disabled={aiToolProcessing || !chartData.trim()}
                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {aiToolProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <BarChartIcon fontSize="small" />
                    Generate Chart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-pink-600 to-pink-700">
              <div className="flex items-center gap-3">
                <ImageIcon className="text-white" sx={{ fontSize: 28 }} />
                <h2 className="text-xl font-bold text-white">AI Image Generator</h2>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Describe the image you want to generate. Be specific about style, colors, and composition.
              </p>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Example: A modern office workspace with large windows, natural lighting, and collaborative team members working on laptops..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-y"
              />
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-yellow-800">
                  🎨 <strong>Coming Soon:</strong> AI image generation will be available in a future update. For now, you can upload images via the Customize panel.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateImage}
                disabled={aiToolProcessing || !imagePrompt.trim()}
                className="px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {aiToolProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon fontSize="small" />
                    Generate Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Text Modification Popup */}
      {showAIPrompt && editMode && selectedText && (
        <div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-xl shadow-2xl border-2 border-primary-600 p-4 max-w-2xl w-full mx-4 animate-in slide-in-from-bottom-4 duration-300"
          style={{
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AutoAwesomeIcon className="text-primary-600" fontSize="small" />
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <span className="text-xs text-gray-500">({selectedText.length} characters selected)</span>
            </div>
            <button
              onClick={() => {
                setShowAIPrompt(false);
                setSelectedText("");
                setSelectionRange(null);
                setAiPrompt("");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => handleAIModification("summarize")}
              disabled={aiProcessing}
              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition disabled:opacity-50"
            >
              ✨ Summarize
            </button>
            <button
              onClick={() => handleAIModification("shorten")}
              disabled={aiProcessing}
              className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition disabled:opacity-50"
            >
              📝 Shorten
            </button>
            <button
              onClick={() => handleAIModification("professional")}
              disabled={aiProcessing}
              className="px-3 py-1.5 text-sm bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 transition disabled:opacity-50"
            >
              💼 Make Professional
            </button>
            <button
              onClick={() => handleAIModification("fix")}
              disabled={aiProcessing}
              className="px-3 py-1.5 text-sm bg-orange-50 text-orange-700 font-medium rounded-lg hover:bg-orange-100 transition disabled:opacity-50"
            >
              🔧 Fix Grammar
            </button>
          </div>

          {/* Custom Prompt */}
          <div className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Or enter custom instruction (e.g., 'Make this more technical')"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && aiPrompt.trim()) {
                  handleAIModification("custom", aiPrompt);
                }
              }}
            />
            <button
              onClick={() => aiPrompt.trim() && handleAIModification("custom", aiPrompt)}
              disabled={aiProcessing || !aiPrompt.trim()}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {aiProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <AutoAwesomeIcon fontSize="small" />
                  Apply
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
