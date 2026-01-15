'use client';

import React, { useState } from 'react';
import { Wallet, Copy, ExternalLink, TrendingUp } from 'lucide-react';
import { shortenAddress, formatSOL } from '@/lib/wallets';

interface WalletCardProps {
  address: string;
  name: string;
  description: string;
  balance: number | null;
  loading: boolean;
  onClick?: () => void;
}

export function WalletCard({ address, name, description, balance, loading, onClick }: WalletCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExplorer = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://solscan.io/account/${address}`, '_blank');
  };

  return (
    <div
      onClick={onClick}
      className={`bg-dark-surface border border-border-dark rounded-lg p-4 sm:p-6 transition-all group ${
        onClick ? 'cursor-pointer hover:border-border-light' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-dark-elevated flex items-center justify-center border border-border-dark flex-shrink-0">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-text-primary truncate">{name}</h3>
            <p className="text-xs sm:text-sm text-text-muted truncate">{description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <div className="flex items-center gap-1 sm:gap-2 text-text-secondary text-xs sm:text-sm font-mono min-w-0">
          <span>{shortenAddress(address, 6)}</span>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-dark-elevated rounded transition-colors flex-shrink-0"
            title="Copy address"
          >
            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={handleExplorer}
            className="p-1 hover:bg-dark-elevated rounded transition-colors flex-shrink-0"
            title="View on explorer"
          >
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
        {copied && <span className="text-xs text-cyan-primary flex-shrink-0">Copied!</span>}
      </div>

      <div className="pt-3 sm:pt-4 border-t border-border-dark">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm text-text-secondary flex-shrink-0">Balance</span>
          {loading ? (
            <div className="h-5 sm:h-6 w-20 sm:w-24 bg-dark-elevated animate-pulse rounded" />
          ) : balance !== null ? (
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
              <span className="text-sm sm:text-lg font-semibold text-text-primary truncate">
                {formatSOL(balance)} SOL
              </span>
            </div>
          ) : (
            <span className="text-xs sm:text-sm text-text-muted flex-shrink-0">Failed to load</span>
          )}
        </div>
      </div>
    </div>
  );
}
