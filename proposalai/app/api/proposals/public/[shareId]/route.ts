// Get Public Proposal by Share ID
// GET /api/proposals/public/[shareId]

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use service role for public access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { shareId: string } }
) {
  try {
    const { shareId } = params;
    const url = new URL(request.url);
    const password = url.searchParams.get('password');

    // Get proposal by share_id
    const { data: proposal, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('share_id', shareId)
      .single();

    if (error || !proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    // Check if proposal is public
    if (!proposal.is_public) {
      return NextResponse.json(
        { error: 'This proposal is not publicly accessible' },
        { status: 403 }
      );
    }

    // Check expiration
    if (proposal.expires_at) {
      const expirationDate = new Date(proposal.expires_at);
      if (expirationDate < new Date()) {
        return NextResponse.json(
          { error: 'This proposal has expired' },
          { status: 410 }
        );
      }
    }

    // Check password if required
    if (proposal.share_password) {
      if (!password || password !== proposal.share_password) {
        return NextResponse.json(
          { error: 'Invalid password', requiresPassword: true },
          { status: 401 }
        );
      }
    }

    // Increment view count (don't await to not block response)
    supabase.rpc('increment_proposal_view_count', {
      p_proposal_id: proposal.id,
    });

    // Track view analytics
    trackProposalView(request, proposal.id);

    // Return proposal (without sensitive fields)
    const publicProposal = {
      id: proposal.id,
      title: proposal.title,
      client_name: proposal.client_name,
      client_company: proposal.client_company,
      content: proposal.content,
      pricing: proposal.pricing,
      status: proposal.status,
      created_at: proposal.created_at,
      expires_at: proposal.expires_at,
      accepted_at: proposal.accepted_at,
      rejected_at: proposal.rejected_at,
    };

    return NextResponse.json(publicProposal);
  } catch (error) {
    console.error('Error fetching public proposal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

// Track proposal view
async function trackProposalView(request: Request, proposalId: string) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    await supabase.from('proposal_views').insert({
      proposal_id: proposalId,
      viewer_ip: ip,
      viewer_user_agent: userAgent,
      viewer_device: {
        type: detectDeviceType(userAgent),
        browser: detectBrowser(userAgent),
      },
    });
  } catch (error) {
    console.error('Error tracking proposal view:', error);
  }
}

function detectDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

function detectBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) return 'Chrome';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/edg/i.test(userAgent)) return 'Edge';
  return 'Other';
}
