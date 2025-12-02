/**
 * FISK DIMENSION - THIRD EYE DOME
 * Payout Configuration
 * 
 * SECURITY PROTOCOLS: OTC AE 256 | QUANTUM GENIE 15 | SOPHIA KEY
 * 
 * ⚠️ IMPORTANT: This file contains NO sensitive account details.
 * All actual bank/wallet information must be configured in:
 * - Stripe Dashboard (for fiat payouts)
 * - Your secure wallet (for crypto payouts)
 * - Environment variables (for account IDs only, never secrets)
 * 
 * CLASSIFICATION: PRIVATE | SECURED
 */

import { PAYMENT_RAILS, PaymentRail, SECURITY_PROTOCOLS } from './secure-config';

/**
 * Payout Destination Types
 */
export const PAYOUT_DESTINATION_TYPES = {
  STRIPE_BANK: 'STRIPE_BANK',
  STRIPE_DEBIT: 'STRIPE_DEBIT',
  LIGHTNING_WALLET: 'LIGHTNING_WALLET',
  ETH_WALLET: 'ETH_WALLET',
  FISK_WALLET: 'FISK_WALLET',
} as const;

export type PayoutDestinationType = typeof PAYOUT_DESTINATION_TYPES[keyof typeof PAYOUT_DESTINATION_TYPES];

/**
 * Payout Schedule Options
 */
export const PAYOUT_SCHEDULES = {
  INSTANT: 'INSTANT',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  MANUAL: 'MANUAL',
} as const;

export type PayoutSchedule = typeof PAYOUT_SCHEDULES[keyof typeof PAYOUT_SCHEDULES];

/**
 * Secure payout configuration
 * Account details are NEVER stored here - only references
 */
export const payoutConfig = {
  /**
   * Primary payout destination (configured via environment variable)
   * This is just an identifier, not the actual account details
   */
  get primaryDestinationId(): string | undefined {
    return process.env.PRIMARY_PAYOUT_DESTINATION_ID;
  },

  /**
   * Stripe Connect Account ID for receiving payouts
   * Configure your actual bank in Stripe Dashboard
   */
  get stripeAccountId(): string | undefined {
    return process.env.STRIPE_CONNECT_ACCOUNT_ID;
  },

  /**
   * Default payout schedule
   */
  get defaultSchedule(): PayoutSchedule {
    const schedule = process.env.PAYOUT_SCHEDULE as PayoutSchedule;
    return schedule && Object.values(PAYOUT_SCHEDULES).includes(schedule) 
      ? schedule 
      : PAYOUT_SCHEDULES.DAILY;
  },

  /**
   * Minimum payout threshold (in cents for fiat, satoshis for BTC)
   */
  get minimumPayoutThreshold(): number {
    const threshold = process.env.MINIMUM_PAYOUT_THRESHOLD;
    return threshold ? parseInt(threshold, 10) : 1000; // Default $10.00 or 1000 sats
  },

  /**
   * Default currency for payouts
   */
  get defaultCurrency(): string {
    return process.env.DEFAULT_PAYOUT_CURRENCY || 'USD';
  },
};

/**
 * Payout routing configuration
 * Determines which rail to use based on currency/amount
 */
export const payoutRouting = {
  /**
   * Get recommended rail for a payout
   */
  getRecommendedRail(currency: string, amount: number): PaymentRail {
    // Crypto currencies route to appropriate blockchain
    if (['BTC', 'SATS'].includes(currency.toUpperCase())) {
      return 'LIGHTNING' as PaymentRail;
    }
    if (['ETH', 'USDC', 'USDT', 'DAI'].includes(currency.toUpperCase())) {
      return 'ETHEREUM' as PaymentRail;
    }
    if (currency.toUpperCase() === 'FISK') {
      return 'FISK_TOKEN' as PaymentRail;
    }
    // Fiat currencies route to Stripe
    return 'STRIPE' as PaymentRail;
  },

  /**
   * Check if instant payout is available
   */
  isInstantPayoutAvailable(rail: PaymentRail): boolean {
    // Stripe supports instant payouts to debit cards
    // Lightning is always instant
    // Blockchain depends on network conditions
    return rail === 'LIGHTNING' || rail === 'STRIPE';
  },
};

/**
 * Payout request interface (for creating new payouts)
 */
export interface PayoutRequest {
  amount: number;
  currency: string;
  destinationType: PayoutDestinationType;
  schedule: PayoutSchedule;
  description?: string;
  metadata?: Record<string, string>;
}

/**
 * Payout record interface (stored records)
 */
export interface PayoutRecord {
  id: string;
  amount: number;
  currency: string;
  rail: PaymentRail;
  destinationType: PayoutDestinationType;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: number;
  completedAt?: number;
  stripePayoutId?: string;
  txHash?: string;
  securityProtocol: string;
}

/**
 * Payout utilities
 */
export const payoutUtils = {
  /**
   * Generate a unique payout ID
   */
  generatePayoutId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `PO_${timestamp}_${random}`.toUpperCase();
  },

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string): string {
    if (['BTC', 'SATS', 'ETH', 'FISK'].includes(currency.toUpperCase())) {
      return `${amount} ${currency.toUpperCase()}`;
    }
    // Fiat currencies - amount is in cents
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  },

  /**
   * Validate payout request
   */
  validatePayoutRequest(request: PayoutRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.amount || request.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }
    if (request.amount < payoutConfig.minimumPayoutThreshold) {
      errors.push(`Amount must be at least ${payoutConfig.minimumPayoutThreshold}`);
    }
    if (!request.currency) {
      errors.push('Currency is required');
    }
    if (!request.destinationType) {
      errors.push('Destination type is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Get security headers for payout API calls
   */
  getPayoutSecurityHeaders(): Record<string, string> {
    return {
      'X-Security-Protocol': SECURITY_PROTOCOLS.OTC_AE_256,
      'X-Quantum-Layer': SECURITY_PROTOCOLS.QUANTUM_GENIE_15,
      'X-Auth-Protocol': SECURITY_PROTOCOLS.SOPHIA_KEY,
      'X-Payout-Auth': 'SECURED',
    };
  },
};

/**
 * Instructions for setting up payouts
 */
export const PAYOUT_SETUP_INSTRUCTIONS = `
╔══════════════════════════════════════════════════════════════════╗
║         FISK DIMENSION - SECURE PAYOUT CONFIGURATION             ║
║         Protected by OTC AE 256 | QUANTUM GENIE 15 | SOPHIA KEY  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ⚠️  NEVER share account details in code or chat!                ║
║                                                                  ║
║  FOR STRIPE PAYOUTS:                                             ║
║  1. Go to https://dashboard.stripe.com                           ║
║  2. Settings → Business settings → Bank accounts                 ║
║  3. Add your bank account securely in Stripe                     ║
║  4. Copy your Connect Account ID to .env.local:                  ║
║     STRIPE_CONNECT_ACCOUNT_ID=acct_xxxxx                         ║
║                                                                  ║
║  FOR CRYPTO PAYOUTS:                                             ║
║  1. Use a secure hardware wallet                                 ║
║  2. Never store private keys in environment variables            ║
║  3. Only store public wallet addresses in config                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`;

export default {
  PAYOUT_DESTINATION_TYPES,
  PAYOUT_SCHEDULES,
  payoutConfig,
  payoutRouting,
  payoutUtils,
  PAYOUT_SETUP_INSTRUCTIONS,
};
