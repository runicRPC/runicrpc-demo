import { RunicRPC } from '@runic-rpc/sdk';
import runicConfig from '../../runic.config.json';

let runicInstance: RunicRPC | null = null;

export function getRunicRPC(): RunicRPC {
  if (runicInstance) {
    return runicInstance;
  }

  const providers: Record<string, { apiKey: string }> = {};

  // Check environment variables first
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_HELIUS_API_KEY) {
    providers.helius = { apiKey: process.env.NEXT_PUBLIC_HELIUS_API_KEY };
  } else if (runicConfig.providers?.helius?.apiKey) {
    // Fall back to config file
    providers.helius = { apiKey: runicConfig.providers.helius.apiKey };
  }

  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
    providers.alchemy = { apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY };
  } else if (runicConfig.providers?.alchemy?.apiKey) {
    // Fall back to config file
    providers.alchemy = { apiKey: runicConfig.providers.alchemy.apiKey };
  }

  const strategy = ((typeof process !== 'undefined' && process.env.NEXT_PUBLIC_RUNIC_STRATEGY) || runicConfig.strategy || 'latency-based') as
    'round-robin' | 'latency-based' | 'weighted' | 'random';

  const logLevel = ((typeof process !== 'undefined' && process.env.NEXT_PUBLIC_RUNIC_LOG_LEVEL) || runicConfig.logLevel || 'info') as
    'debug' | 'info' | 'warn' | 'error';

  const hasProviders = Object.keys(providers).length > 0;

  runicInstance = new RunicRPC({
    providers: hasProviders ? providers : undefined,
    strategy,
    cache: {
      enabled: runicConfig.cache?.enabled ?? true,
      ttl: runicConfig.cache?.ttl ?? 2000,
      maxSize: runicConfig.cache?.maxSize ?? 500,
    },
    retry: {
      maxAttempts: runicConfig.retry?.maxAttempts ?? 3,
      initialDelay: runicConfig.retry?.initialDelay ?? 100,
      maxDelay: runicConfig.retry?.maxDelay ?? 2000,
      backoffMultiplier: 2,
    },
    circuitBreaker: {
      failureThreshold: runicConfig.circuitBreaker?.failureThreshold ?? 5,
      successThreshold: 2,
      timeout: runicConfig.circuitBreaker?.timeout ?? 30000,
    },
    healthCheck: {
      enabled: runicConfig.healthCheck?.enabled ?? true,
      interval: runicConfig.healthCheck?.interval ?? 30000,
      timeout: runicConfig.healthCheck?.timeout ?? 5000,
      unhealthyThreshold: 3,
      healthyThreshold: 2,
    },
    rateLimit: runicConfig.rateLimit ?? 100,
    logLevel,
    // Only use fallback if we have providers configured (fallback will try public endpoints if providers fail)
    // If no providers, don't use fallback to avoid 403 errors from public endpoints
    useFallback: hasProviders,
  });

  return runicInstance;
}
