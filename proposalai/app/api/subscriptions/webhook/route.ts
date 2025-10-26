// Stripe Webhook Handler
// POST /api/subscriptions/webhook
// Handles all Stripe events (subscription updates, payments, etc.)

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe, getTierFromPriceId } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Use service role key for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle subscription created or updated
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;
  const tier = getTierFromPriceId(priceId);

  // Get user ID from customer metadata
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  const userId = customer.metadata?.user_id;

  if (!userId) {
    console.error('No user_id in customer metadata');
    return;
  }

  // Update subscription in database
  await supabaseAdmin.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    tier,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
  });

  // Update user profile tier
  await supabaseAdmin
    .from('profiles')
    .update({ subscription_tier: tier })
    .eq('id', userId);

  console.log(`Subscription updated for user ${userId}: ${tier} - ${subscription.status}`);
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Get user ID
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  const userId = customer.metadata?.user_id;

  if (!userId) return;

  // Update to free tier
  await supabaseAdmin.from('subscriptions').update({
    tier: 'free',
    status: 'canceled',
    canceled_at: new Date().toISOString(),
  }).eq('user_id', userId);

  await supabaseAdmin
    .from('profiles')
    .update({ subscription_tier: 'free' })
    .eq('id', userId);

  console.log(`Subscription canceled for user ${userId}`);
}

// Handle successful payment
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  // Get user ID
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  const userId = customer.metadata?.user_id;

  if (!userId) return;

  // Get subscription
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .single();

  // Record payment in history
  await supabaseAdmin.from('payment_history').insert({
    user_id: userId,
    subscription_id: subscription?.id,
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: invoice.payment_intent as string,
    amount: invoice.amount_paid / 100, // Convert cents to dollars
    currency: invoice.currency.toUpperCase(),
    status: 'succeeded',
    description: invoice.description || 'Subscription payment',
    invoice_url: invoice.hosted_invoice_url,
    invoice_pdf: invoice.invoice_pdf,
    paid_at: new Date(invoice.status_transitions.paid_at! * 1000).toISOString(),
  });

  console.log(`Payment recorded for user ${userId}: $${invoice.amount_paid / 100}`);
}

// Handle payment failure
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Get user ID
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  const userId = customer.metadata?.user_id;

  if (!userId) return;

  // Update subscription status
  await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('user_id', userId);

  // TODO: Send email notification to user about payment failure

  console.log(`Payment failed for user ${userId}`);
}

// Handle checkout completed
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // The subscription will be handled by subscription.created event
  console.log(`Checkout completed for session ${session.id}`);
}
