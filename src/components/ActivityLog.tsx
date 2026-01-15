'use client';

import { Activity, CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'request' | 'cache' | 'retry' | 'error';
  message: string;
  timestamp: number;
}

interface ActivityLogProps {
  items: ActivityItem[];
}

export function ActivityLog({ items }: ActivityLogProps) {
  const typeConfig = {
    request: { icon: CheckCircle, color: 'text-green-400' },
    cache: { icon: Database, color: 'text-cyan-primary' },
    retry: { icon: RefreshCw, color: 'text-yellow-400' },
    error: { icon: XCircle, color: 'text-red-400' },
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    if (diff < 1000) return 'just now';
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    return `${Math.floor(diff / 60000)}m ago`;
  };

  return (
    <div className="bg-dark-surface border border-border-dark rounded-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary" />
        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Activity Log</h3>
      </div>

      <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-text-muted text-xs sm:text-sm">No activity yet</p>
          </div>
        ) : (
          items.map((item) => {
            const { icon: Icon, color } = typeConfig[item.type];
            return (
              <div
                key={item.id}
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-dark-elevated rounded-lg border border-border-dark"
              >
                <Icon className={`w-3 h-3 sm:w-4 sm:h-4 mt-0.5 ${color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-text-primary break-words">{item.message}</p>
                  <p className="text-xs text-text-muted mt-1">{formatTime(item.timestamp)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
