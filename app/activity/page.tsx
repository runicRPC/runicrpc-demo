'use client';

import { useEffect, useState, useCallback } from 'react';
import { getRunicRPC } from '@/lib/runic';
import { ActivityLog, ActivityItem } from '@/components/ActivityLog';
import { Activity as ActivityIcon } from 'lucide-react';

export default function ActivityPage() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const addActivity = useCallback((type: ActivityItem['type'], message: string) => {
    const item: ActivityItem = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: Date.now(),
    };
    setActivity(prev => [item, ...prev].slice(0, 100));
  }, []);

  useEffect(() => {
    const rpc = getRunicRPC();

    const handleRequest = (event: unknown) => {
      const e = event as { type: 'request:start'; method: string; params?: unknown[] };
      addActivity('request', `Request: ${e.method || 'Unknown method'}`);
    };

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

    rpc.on('request:start', handleRequest);
    rpc.on('cache:hit', handleCacheHit);
    rpc.on('request:retry', handleRetry);
    rpc.on('request:error', handleError);

    return () => {
      rpc.off('request:start', handleRequest);
      rpc.off('cache:hit', handleCacheHit);
      rpc.off('request:retry', handleRetry);
      rpc.off('request:error', handleError);
    };
  }, [addActivity]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <ActivityIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-primary" />
          <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary">Activity Log</h1>
        </div>
        <p className="text-sm sm:text-base text-text-secondary">
          Real-time tracking of all RPC requests, cache hits, retries, and errors
        </p>
      </div>

      {activity.length === 0 ? (
        <div className="bg-dark-surface border border-border-dark rounded-xl p-8 sm:p-12 text-center">
          <ActivityIcon className="w-12 h-12 sm:w-16 sm:h-16 text-text-muted mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">No Activity Yet</h3>
          <p className="text-sm sm:text-base text-text-secondary">
            Activity will appear here when RPC requests are made
          </p>
        </div>
      ) : (
        <ActivityLog items={activity} />
      )}
    </div>
  );
}
