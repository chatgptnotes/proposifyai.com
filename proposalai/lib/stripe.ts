// Stripe Configuration and Utilities
// ProposifyAI Subscription Management

import Stripe from 'stripe';

// Initialize Stripe with secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Subscription tier configuration
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: process.env.STRIPE_PRICE_ID_FREE || 'price_free',
    limits: {
      proposalsPerMonth: 3,
      aiGenerationsPerMonth: 10,
      emailsPerMonth: 5,
      teamMembers: 1,
    },
    features: [
      '3 AI-generated proposals/month',
      'Basic templates',
      'Manual proposal creation',
      'Email tracking',
      'PDF export',
    ],
  },
  professional: {
    name: 'Professional',
    price: 49,
    priceMonthly: 49,
    priceYearly: 470,
    priceId: process.env.STRIPE_PRICE_ID_PROFESSIONAL,
    limits: {
      proposalsPerMonth: null, // Unlimited
      aiGenerationsPerMonth: 100,
      emailsPerMonth: 50,
      teamMembers: 5,
    },
    features: [
      'Unlimited proposals',
      'AI content generation',
      'All templates',
      'CRM integration (1 platform)',
      'Analytics dashboard',
      'Team collaboration (5 users)',
      'Email & click tracking',
      'Custom branding',
    ],
  },
  business: {
    name: 'Business',
    price: 149,
    priceMonthly: 149,
    priceYearly: 1430,
    priceId: process.env.STRIPE_PRICE_ID_BUSINESS,
    limits: {
      proposalsPerMonth: null, // Unlimited
      aiGenerationsPerMonth: 500,
      emailsPerMonth: 200,
      teamMembers: 20,
    },
    features: [
      'Everything in Professional',
      'AI research agent',
      'Smart pricing optimization',
      'CRM integration (3 platforms)',
      'Approval workflows',
      'Advanced analytics',
      'Team collaboration (20 users)',
      'Priority support',
      'API access',
      'Workflow automation',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: null, // Custom pricing
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE,
    limits: {
      proposalsPerMonth: null,
      aiGenerationsPerMonth: null,
      emailsPerMonth: null,
      teamMembers: null,
    },
    features: [
      'Everything in Business',
      'Agentic AI workflows',
      'Custom AI training',
      'White-label option',
      'Dedicated account manager',
      'SLA guarantees',
      'Advanced security (SSO, SAML)',
      'Unlimited team members',
      'Unlimited everything',
    ],
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// Helper function to get tier from price ID
export function getTierFromPriceId(priceId: string): SubscriptionTier {
  for (const [tier, config] of Object.entries(SUBSCRIPTION_TIERS)) {
    if (config.priceId === priceId) {
      return tier as SubscriptionTier;
    }
  }
  return 'free';
}

// Helper function to check if user can perform action based on usage
export interface UsageLimits {
  proposalsThisMonth: number;
  aiGenerationsThisMonth: number;
  emailsThisMonth: number;
  tier: SubscriptionTier;
}

export function canPerformAction(
  usage: UsageLimits,
  actionType: 'proposal' | 'ai_generation' | 'email'
): { allowed: boolean; reason?: string } {
  const tierConfig = SUBSCRIPTION_TIERS[usage.tier];
  const limits = tierConfig.limits;

  switch (actionType) {
    case 'proposal':
      if (limits.proposalsPerMonth === null) {
        return { allowed: true };
      }
      if (usage.proposalsThisMonth >= limits.proposalsPerMonth) {
        return {
          allowed: false,
          reason: `You've reached your limit of ${limits.proposalsPerMonth} proposals this month. Upgrade to create more.`,
        };
      }
      return { allowed: true };

    case 'ai_generation':
      if (limits.aiGenerationsPerMonth === null) {
        return { allowed: true };
      }
      if (usage.aiGenerationsThisMonth >= limits.aiGenerationsPerMonth) {
        return {
          allowed: false,
          reason: `You've reached your limit of ${limits.aiGenerationsPerMonth} AI generations this month. Upgrade for more.`,
        };
      }
      return { allowed: true };

    case 'email':
      if (limits.emailsPerMonth === null) {
        return { allowed: true };
      }
      if (usage.emailsThisMonth >= limits.emailsPerMonth) {
        return {
          allowed: false,
          reason: `You've reached your limit of ${limits.emailsPerMonth} emails this month. Upgrade to send more.`,
        };
      }
      return { allowed: true };

    default:
      return { allowed: false, reason: 'Unknown action type' };
  }
}

// Stripe customer management
export async function createStripeCustomer(params: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata,
  });
}

export async function getStripeCustomer(
  customerId: string
): Promise<Stripe.Customer | null> {
  try {
    return await stripe.customers.retrieve(customerId) as Stripe.Customer;
  } catch (error) {
    console.error('Error retrieving Stripe customer:', error);
    return null;
  }
}

// Subscription management
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
}): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: params.customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true,
  };

  if (params.trialDays && params.trialDays > 0) {
    sessionParams.subscription_data = {
      trial_period_days: params.trialDays,
    };
  }

  return await stripe.checkout.sessions.create(sessionParams);
}

export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  return await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}

export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<Stripe.Subscription> {
  if (cancelAtPeriodEnd) {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } else {
    return await stripe.subscriptions.cancel(subscriptionId);
  }
}

export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return null;
  }
}

// Invoice management
export async function getInvoices(customerId: string, limit: number = 10) {
  return await stripe.invoices.list({
    customer: customerId,
    limit,
  });
}

// Payment intent for one-time payments
export async function createPaymentIntent(params: {
  amount: number; // in cents
  currency: string;
  customerId?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency,
    customer: params.customerId,
    metadata: params.metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}
