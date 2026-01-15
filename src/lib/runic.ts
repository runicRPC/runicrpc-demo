import { RunicRPC } from '@runic-rpc/sdk';

let runicInstance: RunicRPC | null = null;

export function getRunicRPC(): RunicRPC {
  if (runicInstance) {
    return runicInstance;
  }

  const providers: Record<string, { apiKey: string }> = {};

  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_HELIUS_API_KEY) {
    providers.helius = { apiKey: process.env.NEXT_PUBLIC_HELIUS_API_KEY };
  }

  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
    providers.alchemy = { apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY };
  }

  const strategy = ((typeof process !== 'undefined' && process.env.NEXT_PUBLIC_RUNIC_STRATEGY) || 'latency-based') as
    'round-robin' | 'latency-based' | 'weighted' | 'random';

  const logLevel = ((typeof process !== 'undefined' && process.env.NEXT_PUBLIC_RUNIC_LOG_LEVEL) || 'info') as
    'debug' | 'info' | 'warn' | 'error';

  runicInstance = new RunicRPC({
    providers: Object.keys(providers).length > 0 ? providers : undefined,
    strategy,
    cache: {
      enabled: true,
      ttl: 2000,
      maxSize: 500,
    },
    retry: {
      maxAttempts: 3,
      initialDelay: 100,
      maxDelay: 2000,
      backoffMultiplier: 2,
    },
    circuitBreaker: {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 30000,
    },
    healthCheck: {
      enabled: true,
      interval: 30000,
      timeout: 5000,
      unhealthyThreshold: 3,
      healthyThreshold: 2,
    },
    rateLimit: 100,
    logLevel,
    useFallback: true,
  });

  return runicInstance;
}
