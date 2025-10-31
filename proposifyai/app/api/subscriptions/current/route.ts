// Get Current Subscription API Route
// GET /api/subscriptions/current

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SUBSCRIPTION_TIERS } from '@/lib/stripe';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    // If no subscription found, return free tier
    if (error || !subscription) {
      return NextResponse.json({
        tier: 'free',
        status: 'active',
        limits: SUBSCRIPTION_TIERS.free.limits,
        features: SUBSCRIPTION_TIERS.free.features,
      });
    }

    // Get tier configuration
    const tierConfig = SUBSCRIPTION_TIERS[subscription.tier as keyof typeof SUBSCRIPTION_TIERS];

    return NextResponse.json({
      ...subscription,
      limits: tierConfig.limits,
      features: tierConfig.features,
      price: tierConfig.price,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}
