'use client';

import { CheckCircle2, Loader2 } from 'lucide-react';

interface LoadingWalletsProps {
  wallets: Array<{
    name: string;
    loaded: boolean;
    loading: boolean;
  }>;
}

export function LoadingWallets({ wallets }: LoadingWalletsProps) {
  const loadedCount = wallets.filter(w => w.loaded).length;
  const progress = (loadedCount / wallets.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-2xl w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-primary to-cyan-light animate-pulse">
            <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-dark-bg animate-spin" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary px-4">
            Fetching Wallet Balances
          </h2>
          <p className="text-sm sm:text-base text-text-secondary px-4">
            RunicRPC is querying Solana blockchain...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-text-muted">Loading wallets</span>
            <span className="text-text-primary font-semibold">
              {loadedCount} / {wallets.length}
            </span>
          </div>
          <div className="h-2 bg-dark-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-primary to-cyan-light transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Wallet List */}
        <div className="bg-dark-surface border border-border-dark rounded-2xl p-4 sm:p-6 space-y-2 sm:space-y-3">
          {wallets.map((wallet, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 sm:p-4 bg-dark-elevated rounded-xl transition-all duration-300"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  wallet.loaded
                    ? 'bg-green-500'
                    : wallet.loading
                      ? 'bg-cyan-primary animate-pulse'
                      : 'bg-text-muted'
                }`} />
                <span className={`text-sm sm:text-base font-medium truncate ${
                  wallet.loaded ? 'text-text-primary' : 'text-text-muted'
                }`}>
                  {wallet.name}
                </span>
              </div>
              {wallet.loaded ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
              ) : wallet.loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary animate-spin flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-text-muted px-4">
            Routing through optimal RPC endpoints • Caching enabled
          </p>
        </div>
      </div>
    </div>
  );
}
