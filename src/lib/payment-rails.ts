/**
 * FISK DIMENSION - THIRD EYE DOME
 * Secure Payment Rails Configuration
 * 
 * SECURITY PROTOCOLS:
 * - OTC AE 256: Advanced Encryption Standard (256-bit)
 * - QUANTUM GENIE 15: Quantum-level security layer
 * - SOPHIA KEY: Master key authentication system
 * 
 * PAYMENT RAILS SUPPORTED:
 * - Stripe (Primary fiat processor)
 * - Lightning Network (Bitcoin micropayments)
 * - Ethereum/EVM chains (Token transfers)
 * - Custom FISK token rails
 * 
 * CLASSIFICATION: PRIVATE | OTC-AE256 | QG15 | SOPHIA-KEY PROTECTED
 */

import { SECURITY_PROTOCOLS } from './secure-config';

/**
 * Payment Rail Types
 */
export const PAYMENT_RAILS = {
  STRIPE: 'STRIPE',
  LIGHTNING: 'LIGHTNING',
  ETHEREUM: 'ETHEREUM',
  FISK_TOKEN: 'FISK_TOKEN',
  BITCOIN: 'BITCOIN',
} as const;

export type PaymentRail = typeof PAYMENT_RAILS[keyof typeof PAYMENT_RAILS];

/**
 * Payout Status Types
 */
export const PAYOUT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CORRECTED: 'CORRECTED',
  REFUNDED: 'REFUNDED',
} as const;

export type PayoutStatus = typeof PAYOUT_STATUS[keyof typeof PAYOUT_STATUS];

/**
 * Payout Correction Types
 */
export const CORRECTION_TYPES = {
  AMOUNT_ADJUSTMENT: 'AMOUNT_ADJUSTMENT',
  RECIPIENT_CORRECTION: 'RECIPIENT_CORRECTION',
  FEE_REFUND: 'FEE_REFUND',
  DUPLICATE_REVERSAL: 'DUPLICATE_REVERSAL',
  CURRENCY_CORRECTION: 'CURRENCY_CORRECTION',
  RAIL_SWITCH: 'RAIL_SWITCH',
} as const;

export type CorrectionType = typeof CORRECTION_TYPES[keyof typeof CORRECTION_TYPES];

/**
 * Secure environment variable retrieval for payment configuration
 */
function getPaymentEnv(key: string): string | undefined {
  const value = process.env[key];
  if (!value && process.env.NODE_ENV === 'development') {
    console.warn(`[PAYMENT-SECURITY] Missing payment environment variable: ${key}`);
  }
  return value;
}

/**
 * Stripe Configuration
 * All keys must be stored in environment variables, never in code
 */
export const stripeConfig = {
  /**
   * Stripe Publishable Key (safe for client-side)
   */
  get publishableKey(): string | undefined {
    return getPaymentEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  },

  /**
   * Stripe Secret Key (server-side only, NEVER expose to client)
   */
  get secretKey(): string | undefined {
    return getPaymentEnv('STRIPE_SECRET_KEY');
  },

  /**
   * Stripe Webhook Secret for validating webhook signatures
   */
  get webhookSecret(): string | undefined {
    return getPaymentEnv('STRIPE_WEBHOOK_SECRET');
  },

  /**
   * Stripe Connect Account ID (for platform payouts)
   */
  get connectAccountId(): string | undefined {
    return getPaymentEnv('STRIPE_CONNECT_ACCOUNT_ID');
  },

  /**
   * Check if Stripe is properly configured
   */
  get isConfigured(): boolean {
    return !!(this.publishableKey && this.secretKey);
  },

  /**
   * Get API version
   */
  apiVersion: '2023-10-16' as const,
};

/**
 * Lightning Network Configuration
 */
export const lightningConfig = {
  /**
   * Lightning Node Connection URL
   */
  get nodeUrl(): string | undefined {
    return getPaymentEnv('LIGHTNING_NODE_URL');
  },

  /**
   * Lightning Node Macaroon (authentication)
   */
  get macaroon(): string | undefined {
    return getPaymentEnv('LIGHTNING_MACAROON');
  },

  /**
   * Lightning TLS Certificate
   */
  get tlsCert(): string | undefined {
    return getPaymentEnv('LIGHTNING_TLS_CERT');
  },

  /**
   * Check if Lightning is properly configured
   */
  get isConfigured(): boolean {
    return !!(this.nodeUrl && this.macaroon);
  },
};

/**
 * Blockchain/Token Rails Configuration
 */
export const blockchainRailsConfig = {
  /**
   * Ethereum RPC URL
   */
  get ethereumRpcUrl(): string | undefined {
    return getPaymentEnv('ETHEREUM_RPC_URL');
  },

  /**
   * FISK Token Contract Address
   */
  get fiskTokenAddress(): string | undefined {
    return getPaymentEnv('FISK_TOKEN_CONTRACT_ADDRESS');
  },

  /**
   * Treasury Wallet Address (for payouts)
   */
  get treasuryAddress(): string | undefined {
    return getPaymentEnv('TREASURY_WALLET_ADDRESS');
  },

  /**
   * Personal payout wallet addresses
   * These are YOUR wallets where payouts will be sent
   */
  payoutWallets: {
    /**
     * Ethereum/ERC-20 payout wallet
     */
    get ethereum(): string | undefined {
      return getPaymentEnv('PAYOUT_ETH_WALLET_ADDRESS');
    },

    /**
     * Bitcoin payout wallet
     */
    get bitcoin(): string | undefined {
      return getPaymentEnv('PAYOUT_BTC_WALLET_ADDRESS');
    },

    /**
     * Lightning Network address
     */
    get lightning(): string | undefined {
      return getPaymentEnv('PAYOUT_LIGHTNING_ADDRESS');
    },

    /**
     * Check if payout wallets are configured
     */
    get isConfigured(): boolean {
      return !!(this.ethereum || this.bitcoin || this.lightning);
    },
  },

  /**
   * Supported Networks
   */
  networks: {
    ETHEREUM_MAINNET: 1,
    ETHEREUM_SEPOLIA: 11155111,
    POLYGON: 137,
    ARBITRUM: 42161,
    OPTIMISM: 10,
    BASE: 8453,
  } as const,
};

/**
 * Payout Correction Interface
 */
export interface PayoutCorrection {
  id: string;
  originalPayoutId: string;
  correctionType: CorrectionType;
  rail: PaymentRail;
  originalAmount: number;
  correctedAmount: number;
  currency: string;
  reason: string;
  timestamp: number;
  status: PayoutStatus;
  securityProtocol: string;
  approvedBy?: string;
}

/**
 * Payment Security Utilities
 */
export const paymentSecurityUtils = {
  /**
   * Get security headers for payment API requests
   */
  getSecurePaymentHeaders(): Record<string, string> {
    return {
      'X-Security-Protocol': SECURITY_PROTOCOLS.OTC_AE_256,
      'X-Quantum-Layer': SECURITY_PROTOCOLS.QUANTUM_GENIE_15,
      'X-Auth-Protocol': SECURITY_PROTOCOLS.SOPHIA_KEY,
      'X-Payment-Security-Version': SECURITY_PROTOCOLS.VERSION,
      'X-Payment-Rail-Auth': 'SECURED',
    };
  },

  /**
   * Validate payout correction request
   */
  validateCorrectionRequest(correction: Partial<PayoutCorrection>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!correction.originalPayoutId) {
      errors.push('Original payout ID is required');
    }
    if (!correction.correctionType) {
      errors.push('Correction type is required');
    }
    if (!correction.rail) {
      errors.push('Payment rail is required');
    }
    if (correction.correctedAmount === undefined || correction.correctedAmount < 0) {
      errors.push('Valid corrected amount is required');
    }
    if (!correction.reason || correction.reason.length < 10) {
      errors.push('Detailed reason is required (minimum 10 characters)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Generate unique correction ID
   */
  generateCorrectionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `CORR_${timestamp}_${random}`.toUpperCase();
  },

  /**
   * Check if all payment rails are properly configured
   */
  validatePaymentRailsConfiguration(): { 
    stripe: boolean; 
    lightning: boolean; 
    blockchain: boolean;
    allConfigured: boolean;
  } {
    const stripe = stripeConfig.isConfigured;
    const lightning = lightningConfig.isConfigured;
    const blockchain = !!(blockchainRailsConfig.ethereumRpcUrl);

    return {
      stripe,
      lightning,
      blockchain,
      allConfigured: stripe && lightning && blockchain,
    };
  },

  /**
   * Get supported currencies for each rail
   */
  getSupportedCurrencies(rail: PaymentRail): string[] {
    switch (rail) {
      case PAYMENT_RAILS.STRIPE:
        return ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
      case PAYMENT_RAILS.LIGHTNING:
        return ['BTC', 'SATS'];
      case PAYMENT_RAILS.ETHEREUM:
        return ['ETH', 'USDC', 'USDT', 'DAI'];
      case PAYMENT_RAILS.FISK_TOKEN:
        return ['FISK'];
      case PAYMENT_RAILS.BITCOIN:
        return ['BTC'];
      default:
        return [];
    }
  },
};

/**
 * Audit log for payment corrections
 */
export interface PaymentAuditEntry {
  id: string;
  action: 'CORRECTION_INITIATED' | 'CORRECTION_APPROVED' | 'CORRECTION_COMPLETED' | 'CORRECTION_FAILED';
  payoutId: string;
  correctionId?: string;
  rail: PaymentRail;
  amount: number;
  currency: string;
  timestamp: number;
  userId?: string;
  ipAddress?: string;
  securityProtocols: string[];
}

export default {
  PAYMENT_RAILS,
  PAYOUT_STATUS,
  CORRECTION_TYPES,
  stripeConfig,
  lightningConfig,
  blockchainRailsConfig,
  paymentSecurityUtils,
};
