// Reject Public Proposal
// POST /api/proposals/public/[shareId]/reject

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request,
  { params }: { params: { shareId: string } }
) {
  try {
    const { shareId } = params;
    const { name, email, reason } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Get proposal with owner info
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('id, is_public, status, title, user_id, share_id, profiles!inner(full_name, email)')
      .eq('share_id', shareId)
      .single();

    if (fetchError || !proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    if (!proposal.is_public) {
      return NextResponse.json(
        { error: 'Proposal is not publicly accessible' },
        { status: 403 }
      );
    }

    // Check if already accepted or rejected
    if (proposal.status === 'accepted') {
      return NextResponse.json(
        { error: 'Proposal has already been accepted' },
        { status: 409 }
      );
    }

    if (proposal.status === 'rejected') {
      return NextResponse.json(
        { error: 'Proposal has already been rejected' },
        { status: 409 }
      );
    }

    // Reject proposal
    const { error: rejectError } = await supabase.rpc('reject_proposal', {
      p_proposal_id: proposal.id,
      p_rejected_by_name: name,
      p_rejected_by_email: email,
      p_reason: reason || null,
    });

    if (rejectError) {
      console.error('Error rejecting proposal:', rejectError);
      return NextResponse.json(
        { error: 'Failed to reject proposal' },
        { status: 500 }
      );
    }

    // Send notification email to proposal owner
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const proposalUrl = `${baseUrl}/proposals/${proposal.id}`;

    const emailData = emailTemplates.proposalRejected({
      ownerName: (proposal.profiles as any).full_name || 'User',
      proposalTitle: proposal.title,
      clientName: name,
      clientEmail: email,
      reason: reason,
      proposalUrl,
    });

    await sendEmail({
      to: (proposal.profiles as any).email,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    return NextResponse.json({
      success: true,
      message: 'Proposal rejected',
    });
  } catch (error) {
    console.error('Error rejecting proposal:', error);
    return NextResponse.json(
      { error: 'Failed to reject proposal' },
      { status: 500 }
    );
  }
}
