// Email Tracking Pixel
// GET /p/[shareId]/track

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1x1 transparent GIF
const TRACKING_PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(
  request: Request,
  { params }: { params: { shareId: string } }
) {
  try {
    const { shareId } = params;

    // Get proposal by share_id
    const { data: proposal } = await supabase
      .from('proposals')
      .select('id')
      .eq('share_id', shareId)
      .single();

    if (proposal) {
      // Track email open
      const userAgent = request.headers.get('user-agent') || '';
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                 request.headers.get('x-real-ip') ||
                 'unknown';

      await supabase.from('proposal_views').insert({
        proposal_id: proposal.id,
        viewer_ip: ip,
        viewer_user_agent: userAgent,
        viewer_device: {
          type: detectDeviceType(userAgent),
          browser: detectBrowser(userAgent),
        },
      });

      // Increment view count
      await supabase.rpc('increment_proposal_view_count', {
        p_proposal_id: proposal.id,
      });
    }

    // Return 1x1 transparent GIF
    return new NextResponse(TRACKING_PIXEL, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error tracking email open:', error);
    // Still return pixel even on error
    return new NextResponse(TRACKING_PIXEL, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
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
