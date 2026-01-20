'use client';

import { useState } from 'react';
import { Rocket, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [starting, setStarting] = useState(false);

  const handleStart = () => {
    setStarting(true);
    setTimeout(() => {
      onStart();
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-4xl w-full space-y-6 sm:space-y-8 animate-in fade-in duration-500">
        {/* Hero Section */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-primary to-cyan-light mb-3 sm:mb-4">
            <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-dark-bg" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary px-4">
            Welcome to runicRPC Demo
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto px-4">
            Experience intelligent Solana RPC load balancing in real-time
          </p>
        </div>

        {/* What You'll See */}
        <div className="bg-dark-surface border border-border-dark rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">What You'll See</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-dark-elevated flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">Live Wallet Tracking</h3>
                <p className="text-xs sm:text-sm text-text-secondary">
                  Monitor 4 famous Solana wallets including Jupiter, Bonk DAO, USDC Mint, and Binance
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-dark-elevated flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">Smart Load Balancing</h3>
                <p className="text-xs sm:text-sm text-text-secondary">
                  Watch requests route to the fastest RPC endpoint automatically
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-dark-elevated flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">Built-in Reliability</h3>
                <p className="text-xs sm:text-sm text-text-secondary">
                  See circuit breakers, retry logic, and automatic failover in action
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-dark-elevated flex items-center justify-center">
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">Real-time Analytics</h3>
                <p className="text-xs sm:text-sm text-text-secondary">
                  Track latency, cache hit rates, and endpoint health metrics live
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Wallets Preview */}
        <div className="bg-dark-surface border border-border-dark rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">Featured Wallets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {[
              { name: 'Jupiter Aggregator', desc: 'DeFi protocol', color: 'from-green-500/10 to-emerald-500/10' },
              { name: 'Bonk DAO Treasury', desc: 'Community treasury', color: 'from-orange-500/10 to-amber-500/10' },
              { name: 'USDC Token Mint', desc: 'Circle mint authority', color: 'from-blue-500/10 to-cyan-500/10' },
              { name: 'Binance Hot Wallet', desc: 'Exchange wallet', color: 'from-yellow-500/10 to-orange-500/10' },
            ].map((wallet, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${wallet.color} border border-border-dark rounded-xl p-3 sm:p-4 space-y-1`}
              >
                <h3 className="text-sm sm:text-base font-semibold text-text-primary">{wallet.name}</h3>
                <p className="text-xs sm:text-sm text-text-muted">{wallet.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 sm:space-y-4 px-4">
          <button
            onClick={handleStart}
            disabled={starting}
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-cyan-primary hover:bg-cyan-light text-dark-bg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
          >
            {starting ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
                <span>Starting Demo...</span>
              </>
            ) : (
              <>
                <span>Start Demo</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
          <p className="text-xs sm:text-sm text-text-muted">
            Uses free public Solana RPC endpoints • No API keys required
          </p>
        </div>
      </div>
    </div>
  );
}
