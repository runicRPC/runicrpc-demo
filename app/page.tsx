'use client';

import { useEffect, useState, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { getRunicRPC } from '@/lib/runic';
import { DEMO_WALLETS } from '@/lib/wallets';
import { WalletCard } from '@/components/WalletCard';
import { StatsCard } from '@/components/StatsCard';
import { EndpointStatus } from '@/components/EndpointStatus';
import { ActivityLog, ActivityItem } from '@/components/ActivityLog';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { LoadingWallets } from '@/components/LoadingWallets';
import { useNotifications } from '@/contexts/NotificationContext';
import { useRefetch } from '@/contexts/RefetchContext';
import { Server, Zap, TrendingUp, Database } from 'lucide-react';

interface WalletBalance {
  address: string;
  balance: number | null;
  loading: boolean;
}

type AppState = 'welcome' | 'loading' | 'dashboard';

export default function HomePage() {
  const { addNotification } = useNotifications();
  const { registerRefetch, unregisterRefetch } = useRefetch();
  const [appState, setAppState] = useState<AppState>('welcome');
  const [walletBalances, setWalletBalances] = useState<WalletBalance[]>(
    DEMO_WALLETS.map(w => ({ address: w.address, balance: null, loading: false }))
  );
  const [stats, setStats] = useState<{
    totalRequests?: number;
    totalErrors?: number;
    cacheHitRate?: number;
    endpoints?: Array<{
      name: string;
      requests?: number;
      errors?: number;
      latency?: { min: number; max: number; avg: number; p50: number; p95: number; p99: number };
      circuitState?: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    }>;
  } | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const addActivity = useCallback((type: ActivityItem['type'], message: string) => {
    const item: ActivityItem = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: Date.now(),
    };
    setActivity(prev => [item, ...prev].slice(0, 50));

    // Also show as toast notification - map 'request' to 'info'
    const toastType = type === 'request' ? 'info' : type;
    addNotification(toastType, message);
  }, [addNotification]);

  const fetchBalance = useCallback(async (address: string) => {
    try {
      // Mark as loading
      setWalletBalances(prev =>
        prev.map(w =>
          w.address === address
            ? { ...w, loading: true }
            : w
        )
      );

      const rpc = getRunicRPC();
      const pubkey = new PublicKey(address);

      addActivity('request', `Fetching balance for ${address.slice(0, 8)}...`);

      const response = await rpc.request('getBalance', [pubkey]) as { value?: number } | number;

      // Solana RPC returns { context: {...}, value: number }
      const balanceValue: number = typeof response === 'object' && response !== null && 'value' in response && typeof response.value === 'number'
        ? response.value
        : typeof response === 'number'
          ? response
          : 0;

      setWalletBalances(prev =>
        prev.map(w =>
          w.address === address
            ? { ...w, balance: balanceValue, loading: false }
            : w
        )
      );

      addActivity('request', `Balance updated: ${(balanceValue / 1e9).toFixed(4)} SOL`);
    } catch (error) {
      // Only log non-403 errors to reduce console noise
      const is403Error = error instanceof Error && error.message.includes('403');
      if (!is403Error) {
        console.error('Failed to fetch balance:', error);
      }
      setWalletBalances(prev =>
        prev.map(w =>
          w.address === address
            ? { ...w, balance: null, loading: false }
            : w
        )
      );
      const errorMessage = is403Error 
        ? `Rate limited - please configure API keys for better reliability`
        : `Failed to fetch balance for ${address.slice(0, 8)}`;
      addActivity('error', errorMessage);
    }
  }, [addActivity]);

  const fetchAllBalances = useCallback(async () => {
    setAppState('loading');
    for (const wallet of DEMO_WALLETS) {
      await fetchBalance(wallet.address);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    // Transition to dashboard after all wallets loaded
    setTimeout(() => {
      setAppState('dashboard');
    }, 500);
  }, [fetchBalance]);

  // Refetch function that doesn't change app state
  const refetchBalances = useCallback(async () => {
    if (appState !== 'dashboard') return;
    for (const wallet of DEMO_WALLETS) {
      await fetchBalance(wallet.address);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }, [fetchBalance, appState]);

  // Register refetch function when on dashboard
  useEffect(() => {
    if (appState === 'dashboard') {
      registerRefetch(refetchBalances);
      return () => {
        unregisterRefetch();
      };
    }
  }, [appState, registerRefetch, unregisterRefetch, refetchBalances]);

  const updateStats = useCallback(() => {
    try {
      const rpc = getRunicRPC();
      const currentStats = rpc.getStats();
      setStats(currentStats);
    } catch (error) {
      console.error('Failed to get stats:', error);
    }
  }, []);

  useEffect(() => {
    if (appState !== 'dashboard') return;

    const statsInterval = setInterval(updateStats, 2000);

    const rpc = getRunicRPC();

    const handleCacheHit = () => {
      addActivity('cache', 'Cache hit - response served from cache');
    };

    const handleRetry = (event: unknown) => {
      const e = event as { type: 'request:retry'; method: string; attempt: number };
      addActivity('retry', `Retrying request (attempt ${e.attempt})`);
    };

    const handleError = (event: unknown) => {
      const e = event as { type: 'request:error'; method: string; error: Error };
      addActivity('error', `Request failed: ${e.error?.message || 'Unknown error'}`);
    };

    rpc.on('cache:hit', handleCacheHit);
    rpc.on('request:retry', handleRetry);
    rpc.on('request:error', handleError);

    return () => {
      clearInterval(statsInterval);
      rpc.off('cache:hit', handleCacheHit);
      rpc.off('request:retry', handleRetry);
      rpc.off('request:error', handleError);
    };
  }, [appState, updateStats, addActivity]);

  // Show welcome screen
  if (appState === 'welcome') {
    return <WelcomeScreen onStart={fetchAllBalances} />;
  }

  // Show loading screen
  if (appState === 'loading') {
    const loadingWallets = DEMO_WALLETS.map((wallet) => {
      const balance = walletBalances.find(w => w.address === wallet.address);
      return {
        name: wallet.name,
        loaded: balance?.balance !== null,
        loading: balance?.loading || false,
      };
    });
    return <LoadingWallets wallets={loadingWallets} />;
  }

  // Dashboard view
  const totalBalance = walletBalances.reduce((sum, w) => sum + (w.balance || 0), 0);
  const loadingCount = walletBalances.filter(w => w.loading).length;
  const avgLatency = stats?.endpoints && stats.endpoints.length > 0
    ? stats.endpoints.reduce((sum, e) => sum + (e.latency?.avg || 0), 0) / stats.endpoints.length
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-2">Wallet Tracker</h1>
        <p className="text-sm sm:text-base text-text-secondary">
          Monitor Solana wallets in real-time using runicRPC load balancer
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          icon={TrendingUp}
          label="Total Balance"
          value={`${(totalBalance / 1e9).toFixed(2)} SOL`}
          subValue={`Across ${DEMO_WALLETS.length} wallets`}
          loading={loadingCount > 0}
        />
        <StatsCard
          icon={Server}
          label="Requests"
          value={stats?.totalRequests?.toLocaleString() || '0'}
          subValue={`${stats?.totalErrors || 0} errors`}
          trend={(stats?.totalErrors || 0) > 0 ? 'down' : 'up'}
        />
        <StatsCard
          icon={Zap}
          label="Avg Latency"
          value={`${Math.round(avgLatency)}ms`}
          subValue="Across all endpoints"
          trend={avgLatency < 200 ? 'up' : avgLatency < 500 ? 'neutral' : 'down'}
        />
        <StatsCard
          icon={Database}
          label="Cache Hit Rate"
          value={`${((stats?.cacheHitRate || 0) * 100).toFixed(1)}%`}
          subValue="Requests served from cache"
          trend={(stats?.cacheHitRate || 0) > 0.5 ? 'up' : 'neutral'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">Demo Wallets</h2>
          <div className="space-y-4">
            {DEMO_WALLETS.map((wallet) => {
              const balance = walletBalances.find(w => w.address === wallet.address);
              return (
                <WalletCard
                  key={wallet.address}
                  address={wallet.address}
                  name={wallet.name}
                  description={wallet.description}
                  balance={balance?.balance || null}
                  loading={balance?.loading || false}
                />
              );
            })}
          </div>
        </div>

        <ActivityLog items={activity} />
      </div>

      {stats && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">Endpoint Status</h2>
          <div className="space-y-2 sm:space-y-3">
            {stats.endpoints?.map((endpoint) => (
              <EndpointStatus
                key={endpoint.name}
                name={endpoint.name}
                healthy={endpoint.circuitState !== 'OPEN'}
                latency={Math.round(endpoint.latency?.avg || 0)}
                requests={endpoint.requests || 0}
                errors={endpoint.errors || 0}
                circuitState={endpoint.circuitState || 'CLOSED'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
