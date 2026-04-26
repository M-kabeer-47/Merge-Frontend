export type PlanTier = 'free' | 'basic' | 'pro' | 'max';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing';

export interface SubscriptionPlan {
  id: string;
  name: PlanTier;
  displayName: string;
  priceMonthly: number;
  currency: string;
  lsVariantId: string | null;
  features: string[];
  roomLimit: number;
  noteLimit: number;
  hasLectureSummary: boolean;
  hasFocusTracker: boolean;
}

export interface UserSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  appliedDiscountPercentage: number;
}

export interface PaymentRecord {
  id: string;
  amountPkr: number;
  status: 'paid' | 'failed' | 'refunded';
  invoiceUrl: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
}
