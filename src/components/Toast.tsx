'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, Zap } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'cache' | 'retry';
  message: string;
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-cyan-primary" />,
    cache: <Zap className="w-5 h-5 text-cyan-primary" />,
    retry: <AlertCircle className="w-5 h-5 text-yellow-400" />,
  };

  const bgColors = {
    success: 'bg-green-500/10 border-green-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    info: 'bg-cyan-500/10 border-cyan-500/20',
    cache: 'bg-cyan-500/10 border-cyan-500/20',
    retry: 'bg-yellow-500/10 border-yellow-500/20',
  };

  return (
    <div
      className={`${bgColors[type]} border backdrop-blur-sm rounded-xl p-4 shadow-lg animate-in slide-in-from-right duration-300 flex items-start gap-3 min-w-[320px] max-w-md`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <p className="flex-1 text-sm text-text-primary">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-3">{children}</div>
    </div>
  );
}
