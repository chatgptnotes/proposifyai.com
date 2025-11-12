import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

interface ClientData {
  name: string;
  email: string;
  website: string;
}

interface ProjectData {
  title: string;
  investment: string;
  duration: string;
  sections?: Array<{
    title: string;
    content: string;
  }>;
}

interface GenerateProposalRequest {
  templateId: string;
  clientData: ClientData;
  projectData: ProjectData;
  reference?: string;
  erpReference?: string;
  date?: string;
}

/**
 * POST /api/proposals/generate-from-template
 * Generate a new proposal from a template
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: GenerateProposalRequest = await request.json();
    const { templateId, clientData, projectData, reference, erpReference, date } = body;

    // Validate required fields
    if (!templateId || !clientData || !projectData) {
      return NextResponse.json(
        { error: 'Missing required fields: templateId, clientData, projectData' },
        { status: 400 }
      );
    }

    // Load template files
    const templateDir = path.join(process.cwd(), 'templates', templateId);

    let templateHtml: string;
    let config: any;

    try {
      templateHtml = await fs.readFile(
        path.join(templateDir, 'template.html'),
        'utf-8'
      );
      const configFile = await fs.readFile(
        path.join(templateDir, 'config.json'),
        'utf-8'
      );
      config = JSON.parse(configFile);
    } catch (error) {
      return NextResponse.json(
        { error: `Template '${templateId}' not found` },
        { status: 404 }
      );
    }

    // Generate dynamic values
    const today = new Date();
    const proposalDate = date || today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const headerDate = today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const shortDate = today.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-');

    // Generate reference numbers if not provided
    const proposalReference = reference || `${config.header.reference_prefix} K${Math.floor(Math.random() * 100)}`;
    const proposalErpRef = erpReference || `${config.variables.erp_prefix}-${today.getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

    // Generate table of contents
    const tableOfContents = projectData.sections
      ?.map((section, index) => `<p>${index + 1}. ${section.title}</p>`)
      .join('\n') || '';

    // Generate content pages
    const contentPages = projectData.sections
      ?.map((section, index) => {
        const pageNumber = index + 3; // Starting from page 3
        return `
<!-- Page ${pageNumber} -->
<div class="page">
<div class="header">
<div class="logo-box"><img src="logo.jpg" class="logo"><div class="name">${config.company}</div></div>
<div class="ref"><b>Reference:</b> ${proposalReference}<br><b>Date:</b> ${headerDate}<br><b>Website:</b> ${config.header.website}</div>
</div>
<div class="content">
<h2>${section.title}</h2>
${section.content}
</div>
<div class="footer"><b>${config.footer.left_text}</b><span>${shortDate} / ${proposalErpRef}</span><b>${pageNumber} | Page</b></div>
</div>
`;
      })
      .join('\n') || '';

    // Replace all template variables
    let proposalHtml = templateHtml
      .replace(/\{\{CLIENT_NAME\}\}/g, clientData.name)
      .replace(/\{\{CLIENT_EMAIL\}\}/g, clientData.email)
      .replace(/\{\{CLIENT_WEBSITE\}\}/g, clientData.website)
      .replace(/\{\{PROPOSAL_TITLE\}\}/g, projectData.title)
      .replace(/\{\{PROPOSAL_DATE\}\}/g, proposalDate)
      .replace(/\{\{REFERENCE\}\}/g, proposalReference)
      .replace(/\{\{ERP_REFERENCE\}\}/g, proposalErpRef)
      .replace(/\{\{DATE\}\}/g, headerDate)
      .replace(/\{\{DATE_SHORT\}\}/g, shortDate)
      .replace(/\{\{TOTAL_INVESTMENT\}\}/g, projectData.investment)
      .replace(/\{\{PROJECT_DURATION\}\}/g, projectData.duration)
      .replace(/\{\{TABLE_OF_CONTENTS\}\}/g, tableOfContents)
      .replace(/\{\{CONTENT_PAGES\}\}/g, contentPages);

    // Save proposal to database
    const { data: proposal, error: dbError } = await supabase
      .from('proposals')
      .insert({
        user_id: session.user.id,
        client_name: clientData.name,
        title: projectData.title,
        content: proposalHtml,
        template_id: templateId,
        status: 'draft',
        metadata: {
          client_data: clientData,
          project_data: projectData,
          reference: proposalReference,
          erp_reference: proposalErpRef,
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save proposal to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      proposal: {
        id: proposal.id,
        title: proposal.title,
        client_name: proposal.client_name,
        reference: proposalReference,
        erp_reference: proposalErpRef,
        html: proposalHtml,
      },
    });
  } catch (error) {
    console.error('Error generating proposal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/proposals/generate-from-template
 * List available templates
 */
export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'templates');
    const templates = await fs.readdir(templatesDir);

    const templateList = await Promise.all(
      templates.map(async (templateId) => {
        try {
          const configPath = path.join(templatesDir, templateId, 'config.json');
          const configFile = await fs.readFile(configPath, 'utf-8');
          const config = JSON.parse(configFile);
          return {
            id: templateId,
            name: config.name,
            version: config.version,
            company: config.company,
          };
        } catch (error) {
          return null;
        }
      })
    );

    return NextResponse.json({
      templates: templateList.filter(Boolean),
    });
  } catch (error) {
    console.error('Error listing templates:', error);
    return NextResponse.json(
      { error: 'Failed to list templates' },
      { status: 500 }
    );
  }
}
