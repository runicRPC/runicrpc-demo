'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export function StatsCard({ icon: Icon, label, value, subValue, trend, loading }: StatsCardProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-text-secondary',
  };

  return (
    <div className="bg-dark-surface border border-border-dark rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-dark-elevated flex items-center justify-center border border-border-dark">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary" />
        </div>
        {trend && (
          <div className={`text-xs sm:text-sm font-medium ${trendColors[trend]}`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trend === 'neutral' && '—'}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs sm:text-sm font-medium text-text-secondary mb-1">{label}</p>
        {loading ? (
          <div className="h-6 sm:h-8 w-24 sm:w-32 bg-dark-elevated animate-pulse rounded" />
        ) : (
          <>
            <p className="text-xl sm:text-2xl font-semibold text-text-primary truncate">{value}</p>
            {subValue && <p className="text-xs text-text-muted mt-1">{subValue}</p>}
          </>
        )}
      </div>
    </div>
  );
}
