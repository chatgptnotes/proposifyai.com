// Send Proposal Email
// POST /api/proposals/[id]/send

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { recipientEmail, recipientName, customMessage } = body;

    if (!recipientEmail || !recipientName) {
      return NextResponse.json(
        { error: 'Recipient email and name are required' },
        { status: 400 }
      );
    }

    // Get proposal
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*, profiles!inner(*)')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (fetchError || !proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    // Generate or get share ID
    let shareId = proposal.share_id;
    if (!shareId) {
      // Generate share ID and update proposal
      const { data: updatedProposal, error: updateError } = await supabase
        .rpc('generate_share_id')
        .single();

      if (updateError) {
        console.error('Error generating share ID:', updateError);
        return NextResponse.json(
          { error: 'Failed to generate share link' },
          { status: 500 }
        );
      }

      shareId = updatedProposal;

      // Update proposal with share ID and mark as public
      const { error: setShareError } = await supabase
        .from('proposals')
        .update({
          share_id: shareId,
          is_public: true,
          status: 'sent',
        })
        .eq('id', id);

      if (setShareError) {
        console.error('Error updating proposal:', setShareError);
        return NextResponse.json(
          { error: 'Failed to update proposal' },
          { status: 500 }
        );
      }
    } else {
      // Just update status to sent if not already
      if (proposal.status === 'draft') {
        await supabase
          .from('proposals')
          .update({ status: 'sent' })
          .eq('id', id);
      }
    }

    // Construct proposal URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const proposalUrl = `${baseUrl}/p/${shareId}`;

    // Send email
    const emailData = emailTemplates.proposalSent({
      recipientName,
      proposalTitle: proposal.title,
      proposalUrl,
      senderName: proposal.profiles.full_name || 'A Proposify AI user',
      customMessage,
      expiresAt: proposal.expires_at,
    });

    const result = await sendEmail({
      to: recipientEmail,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      replyTo: session.user.email,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Log email sent
    await supabase.from('proposal_actions').insert({
      proposal_id: id,
      action_type: 'shared',
      actor_name: session.user.email,
      actor_email: session.user.email,
      action_data: {
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        custom_message: customMessage,
      },
    });

    // Check usage and increment
    const { data: canSend } = await supabase.rpc('check_usage_limit', {
      p_user_id: session.user.id,
      p_usage_type: 'emails_sent',
    });

    if (canSend) {
      await supabase.rpc('increment_usage', {
        p_user_id: session.user.id,
        p_usage_type: 'emails_sent',
        p_increment: 1,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Proposal sent successfully',
      shareUrl: proposalUrl,
    });
  } catch (error) {
    console.error('Error sending proposal:', error);
    return NextResponse.json(
      { error: 'Failed to send proposal' },
      { status: 500 }
    );
  }
}
