'use client';

import { Server, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface EndpointStatusProps {
  name: string;
  healthy: boolean;
  latency: number;
  requests: number;
  errors: number;
  circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

export function EndpointStatus({
  name,
  healthy,
  latency,
  requests,
  errors,
  circuitState,
}: EndpointStatusProps) {
  const circuitStateColors = {
    CLOSED: 'text-green-400',
    OPEN: 'text-red-400',
    HALF_OPEN: 'text-yellow-400',
  };

  const circuitStateIcons = {
    CLOSED: CheckCircle,
    OPEN: XCircle,
    HALF_OPEN: AlertCircle,
  };

  const CircuitIcon = circuitStateIcons[circuitState];
  const errorRate = requests > 0 ? ((errors / requests) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-dark-elevated border border-border-dark rounded-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-dark-surface flex items-center justify-center border border-border-dark flex-shrink-0">
            <Server className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-semibold text-text-primary truncate">{name}</h4>
              {healthy ? (
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <CircuitIcon className={`w-3 h-3 ${circuitStateColors[circuitState]} flex-shrink-0`} />
              <span className="text-xs text-text-muted">{circuitState}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 sm:flex sm:items-center">
          <div className="text-left sm:text-right">
            <p className="text-xs text-text-muted">Latency</p>
            <p className="text-xs sm:text-sm font-semibold text-text-primary">{latency}ms</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-text-muted">Requests</p>
            <p className="text-xs sm:text-sm font-semibold text-text-primary">{requests.toLocaleString()}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-text-muted">Error Rate</p>
            <p className="text-xs sm:text-sm font-semibold text-red-400">{errorRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
