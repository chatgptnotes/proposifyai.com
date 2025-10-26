import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { proposalId, eventType, eventData, sessionId } = await request.json();

    if (!proposalId || !eventType || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (eventType === 'page_view') {
      const { data: existingView } = await supabase
        .from('proposal_views')
        .select('id')
        .eq('proposal_id', proposalId)
        .eq('session_id', sessionId)
        .single();

      if (!existingView) {
        await supabase.from('proposal_views').insert({
          proposal_id: proposalId,
          session_id: sessionId,
          viewer_ip: ip,
          user_agent: userAgent,
          time_spent: 0,
        });

        const { data: proposal } = await supabase
          .from('proposals')
          .select('status, workspace_id')
          .eq('id', proposalId)
          .single();

        if (proposal && proposal.status === 'sent') {
          await supabase
            .from('proposals')
            .update({ status: 'viewed' })
            .eq('id', proposalId);
        }
      }
    }

    if (eventType === 'time_spent') {
      await supabase
        .from('proposal_views')
        .update({
          time_spent: supabase.rpc('increment_time_spent', {
            row_id: proposalId,
            increment_by: eventData.timeSpent || 0,
          }),
          last_viewed_at: new Date().toISOString(),
        })
        .eq('proposal_id', proposalId)
        .eq('session_id', sessionId);
    }

    await supabase.from('proposal_tracking').insert({
      proposal_id: proposalId,
      session_id: sessionId,
      event_type: eventType,
      event_data: eventData,
      user_agent: userAgent,
      ip_address: ip,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
