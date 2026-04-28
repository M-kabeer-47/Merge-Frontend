export type PlanTier =
  // Legacy tiers (existing users may still be on these)
  | 'free' | 'basic' | 'pro' | 'max'
  // Student tiers
  | 'student_free' | 'student_plus'
  // Instructor tiers
  | 'instructor_starter' | 'instructor_educator' | 'instructor_pro';

export type PlanRole = 'student' | 'instructor' | 'all';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing';

export interface SubscriptionPlan {
  id: string;
  name: PlanTier;
  displayName: string;
  priceMonthly: number;
  currency: string;
  lsVariantId: string | null;
  features: string[];
  targetRole: PlanRole;
  roomLimit: number;
  noteLimit: number;
  studentsPerRoom: number;
  hasLectureSummary: boolean;
  hasFocusTracker: boolean;
  hasAiAssistant: boolean;
  hasQaBot: boolean;
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
