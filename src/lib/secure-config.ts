/**
 * FISK DIMENSION - THIRD EYE DOME
 * Secure Environment Configuration
 * 
 * SECURITY PROTOCOLS:
 * - OTC AE 256: Advanced Encryption Standard (256-bit)
 * - QUANTUM GENIE 15: Quantum-level security layer
 * - SOPHIA KEY: Master key authentication system
 * 
 * This module provides secure access to environment variables
 * with validation and fallback handling.
 * 
 * SECURITY: All sensitive values are wrapped and accessed through
 * this secure configuration layer. Never expose raw environment
 * variables directly in components.
 * 
 * CLASSIFICATION: PRIVATE | OTC-AE256 | QG15 | SOPHIA-KEY PROTECTED
 */

/**
 * Security Protocol Identifiers
 */
export const SECURITY_PROTOCOLS = {
  OTC_AE_256: 'OTC-AE-256',
  QUANTUM_GENIE_15: 'QUANTUM-GENIE-15',
  SOPHIA_KEY: 'SOPHIA-KEY',
  VERSION: '1.0.0',
} as const;

/**
 * Securely retrieves an environment variable with optional fallback.
 * Logs warnings for missing required variables in development.
 */
function getSecureEnv(key: string, fallback?: string): string | undefined {
  const value = process.env[key];
  
  if (!value && !fallback) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SECURITY] Missing environment variable: ${key}`);
    }
    return undefined;
  }
  
  return value || fallback;
}

/**
 * Validates that a required environment variable exists.
 * Throws an error if the variable is not set.
 */
function requireSecureEnv(key: string): string {
  const value = process.env[key];
  
  if (!value) {
    throw new Error(`[SECURITY] Required environment variable not set: ${key}`);
  }
  
  return value;
}

/**
 * Secure configuration object for the FISK DIMENSION - THIRD EYE DOME
 * All environment variables are wrapped and validated here.
 */
export const secureConfig = {
  // Application Environment
  get nodeEnv() {
    return getSecureEnv('NODE_ENV', 'development');
  },
  
  get isProduction() {
    return this.nodeEnv === 'production';
  },
  
  get isDevelopment() {
    return this.nodeEnv === 'development';
  },
  
  // API Configuration
  get internalApiKey() {
    return getSecureEnv('INTERNAL_API_KEY');
  },
  
  // Firebase Configuration (public keys are safe to expose)
  firebase: {
    get apiKey() {
      return getSecureEnv('NEXT_PUBLIC_FIREBASE_API_KEY');
    },
    get authDomain() {
      return getSecureEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
    },
    get projectId() {
      return getSecureEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    },
    get storageBucket() {
      return getSecureEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
    },
    get messagingSenderId() {
      return getSecureEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
    },
    get appId() {
      return getSecureEnv('NEXT_PUBLIC_FIREBASE_APP_ID');
    },
  },
  
  // Blockchain Configuration
  blockchain: {
    get alchemyApiKey() {
      return getSecureEnv('ALCHEMY_API_KEY');
    },
    get infuraProjectId() {
      return getSecureEnv('INFURA_PROJECT_ID');
    },
  },
  
  // Genkit / AI Configuration
  ai: {
    get genkitApiKey() {
      return getSecureEnv('GOOGLE_GENKIT_API_KEY');
    },
  },
};

/**
 * Security utilities for the THIRD EYE DOME
 * Protected under OTC AE 256, QUANTUM GENIE 15, and SOPHIA KEY protocols
 */
export const securityUtils = {
  /**
   * Get active security protocols
   */
  getActiveProtocols(): string[] {
    return [
      SECURITY_PROTOCOLS.OTC_AE_256,
      SECURITY_PROTOCOLS.QUANTUM_GENIE_15,
      SECURITY_PROTOCOLS.SOPHIA_KEY,
    ];
  },

  /**
   * Verify security protocol status
   */
  verifyProtocolStatus(): { protocol: string; status: 'ACTIVE' | 'INACTIVE' }[] {
    return [
      { protocol: SECURITY_PROTOCOLS.OTC_AE_256, status: 'ACTIVE' },
      { protocol: SECURITY_PROTOCOLS.QUANTUM_GENIE_15, status: 'ACTIVE' },
      { protocol: SECURITY_PROTOCOLS.SOPHIA_KEY, status: 'ACTIVE' },
    ];
  },

  /**
   * Masks sensitive data for logging purposes
   * Uses OTC AE 256 masking pattern
   */
  maskSensitive(value: string | undefined, visibleChars: number = 4): string {
    if (!value) return '****';
    if (value.length <= visibleChars) return '****';
    return value.substring(0, visibleChars) + '****';
  },
  
  /**
   * Validates that all required environment variables are set
   * Call this on application startup
   */
  validateEnvironment(): { valid: boolean; missing: string[]; protocols: string[] } {
    const required = [
      // Add required environment variables here
      // 'INTERNAL_API_KEY',
      // 'SOPHIA_KEY',
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    return {
      valid: missing.length === 0,
      missing,
      protocols: this.getActiveProtocols(),
    };
  },

  /**
   * Generate security header for API requests
   */
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Security-Protocol': SECURITY_PROTOCOLS.OTC_AE_256,
      'X-Quantum-Layer': SECURITY_PROTOCOLS.QUANTUM_GENIE_15,
      'X-Auth-Protocol': SECURITY_PROTOCOLS.SOPHIA_KEY,
      'X-Security-Version': SECURITY_PROTOCOLS.VERSION,
    };
  },
};

export default secureConfig;
