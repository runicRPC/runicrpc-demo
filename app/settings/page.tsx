'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Zap, Shield, RefreshCw, Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

export default function SettingsPage() {
  const { notificationsEnabled, toggleNotifications } = useNotifications();
  const [strategy, setStrategy] = useState('latency-based');
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [cacheTTL, setCacheTTL] = useState(2000);
  const [maxRetries, setMaxRetries] = useState(3);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-primary" />
          <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary">Settings</h1>
        </div>
        <p className="text-sm sm:text-base text-text-secondary">
          Configure runicRPC behavior and preferences
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-dark-surface border border-border-dark rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary" />
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">Notifications</h2>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium text-text-primary">Toast Notifications</p>
            <p className="text-xs sm:text-sm text-text-secondary">
              Enable real-time notifications for cache hits, retries, and errors
            </p>
          </div>
          <button
            onClick={toggleNotifications}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
              notificationsEnabled ? 'bg-cyan-primary' : 'bg-dark-elevated border border-border-dark'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Routing Strategy */}
      <div className="bg-dark-surface border border-border-dark rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary" />
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">Routing Strategy</h2>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm text-text-secondary">
            Choose how requests are distributed across RPC endpoints
          </p>
          {[
            { value: 'latency-based', label: 'Latency-Based', desc: 'Route to fastest endpoint (Recommended)' },
            { value: 'round-robin', label: 'Round Robin', desc: 'Distribute evenly across all endpoints' },
            { value: 'weighted', label: 'Weighted', desc: 'Route based on endpoint weights' },
            { value: 'random', label: 'Random', desc: 'Randomly select endpoints' },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                strategy === option.value
                  ? 'border-cyan-primary bg-cyan-primary/5'
                  : 'border-border-dark hover:border-cyan-primary/50'
              }`}
            >
              <input
                type="radio"
                name="strategy"
                value={option.value}
                checked={strategy === option.value}
                onChange={(e) => setStrategy(e.target.value)}
                className="mt-1 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-text-primary">{option.label}</p>
                <p className="text-xs sm:text-sm text-text-secondary">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Cache Settings */}
      <div className="bg-dark-surface border border-border-dark rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary" />
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">Cache Settings</h2>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-medium text-text-primary">Enable Caching</p>
              <p className="text-xs sm:text-sm text-text-secondary">
                Cache responses to reduce redundant requests
              </p>
            </div>
            <button
              onClick={() => setCacheEnabled(!cacheEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                cacheEnabled ? 'bg-cyan-primary' : 'bg-dark-elevated border border-border-dark'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  cacheEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {cacheEnabled && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2">
                Cache TTL: {cacheTTL}ms
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={cacheTTL}
                onChange={(e) => setCacheTTL(Number(e.target.value))}
                className="w-full h-2 bg-dark-elevated rounded-lg appearance-none cursor-pointer accent-cyan-primary"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>500ms</span>
                <span>10s</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Retry Settings */}
      <div className="bg-dark-surface border border-border-dark rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-primary" />
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">Retry Settings</h2>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2">
            Max Retry Attempts: {maxRetries}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={maxRetries}
            onChange={(e) => setMaxRetries(Number(e.target.value))}
            className="w-full h-2 bg-dark-elevated rounded-lg appearance-none cursor-pointer accent-cyan-primary"
          />
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>0 (disabled)</span>
            <span>5</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-text-secondary">
          <span className="font-semibold text-blue-400">Note:</span> These settings are for demonstration purposes.
          In a production app, you would reinitialize runicRPC with the new configuration.
        </p>
      </div>
    </div>
  );
}
