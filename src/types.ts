export type Role = 'admin' | 'moderator' | 'user';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export type ListingStatus = 'active' | 'pending_review' | 'promoted' | 'vip' | 'rejected' | 'expired';

export interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  negotiable: boolean;
  category: string;
  location: string;
  region: string;
  images: string[];
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  userVerified: boolean;
  status: ListingStatus;
  views: number;
  createdAt: string;
  expiresAt: string;
  featuredUntil?: string;
  highlighted: boolean;
  vip: boolean;
}

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  currency: 'PLN' | 'EUR' | 'USD';
  testMode: boolean;
  standardPrice: number;
  promotedPrice: number;
  vipPrice: number;
}

export interface StripeTransaction {
  id: string;
  stripePaymentIntentId: string;
  listingId: string;
  listingTitle: string;
  userEmail: string;
  userName: string;
  amount: number;
  currency: string;
  tier: 'promoted' | 'vip';
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
  cardLast4: string;
  receiptUrl?: string;
}

export interface EmailNotification {
  id: string;
  to: string;
  subject: string;
  type: 'listing_activated' | 'payment_success' | 'new_message' | 'security_alert' | 'listing_expiring' | 'password_reset' | 'welcome_user' | 'password_changed';
  contentHtml: string;
  sentAt: string;
  read: boolean;
  token?: string;
  actionUrl?: string;
}

export interface SecuritySettings {
  rateLimitingEnabled: boolean;
  maxRequestsPerMinute: number;
  honeypotSpamFilter: boolean;
  xssSanitization: boolean;
  phishingKeywordFilter: boolean;
  require2FAForAdmin: boolean;
  sessionTimeoutMinutes: number;
  watermarkUploadedImages: boolean;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  ip: string;
  userAgent: string;
  severity: 'info' | 'warning' | 'danger';
  details: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: Role;
  phone: string;
  twoFactorEnabled: boolean;
  verified: boolean;
  createdAt: string;
  listingsCount: number;
}
