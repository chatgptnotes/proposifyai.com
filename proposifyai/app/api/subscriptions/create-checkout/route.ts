// Create Stripe Checkout Session API Route
// POST /api/subscriptions/create-checkout

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createCheckoutSession, createStripeCustomer, SUBSCRIPTION_TIERS } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier, billingPeriod = 'monthly' } = await request.json();

    // Validate tier
    if (!tier || !SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS]) {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name, company_name')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if user already has a Stripe customer
    let { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', session.user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await createStripeCustomer({
        email: profile.email,
        name: profile.full_name || profile.company_name,
        metadata: {
          user_id: session.user.id,
        },
      });

      customerId = customer.id;

      // Save customer ID to database
      await supabase.from('subscriptions').upsert({
        user_id: session.user.id,
        stripe_customer_id: customerId,
        tier: 'free',
        status: 'active',
      });
    }

    // Get price ID based on tier and billing period
    const tierConfig = SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS];
    let priceId = tierConfig.priceId;

    // For professional and business, use yearly price ID if selected
    if (billingPeriod === 'yearly' && (tier === 'professional' || tier === 'business')) {
      // You'll need to create separate price IDs in Stripe for yearly billing
      priceId = `${priceId}_yearly`;
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID not configured' }, { status: 500 });
    }

    // Create checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const checkoutSession = await createCheckoutSession({
      customerId,
      priceId,
      successUrl: `${appUrl}/dashboard?subscription=success`,
      cancelUrl: `${appUrl}/dashboard?subscription=canceled`,
      trialDays: 14, // 14-day free trial
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
