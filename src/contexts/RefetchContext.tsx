'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface RefetchContextType {
  registerRefetch: (refetchFn: () => Promise<void>) => void;
  unregisterRefetch: () => void;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}

const RefetchContext = createContext<RefetchContextType | undefined>(undefined);

export function RefetchProvider({ children }: { children: ReactNode }) {
  const [refetchFn, setRefetchFn] = useState<(() => Promise<void>) | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);

  const registerRefetch = useCallback((fn: () => Promise<void>) => {
    setRefetchFn(() => fn);
  }, []);

  const unregisterRefetch = useCallback(() => {
    setRefetchFn(null);
  }, []);

  const refetch = useCallback(async () => {
    if (refetchFn && !isRefetching) {
      setIsRefetching(true);
      try {
        await refetchFn();
      } finally {
        setIsRefetching(false);
      }
    }
  }, [refetchFn, isRefetching]);

  return (
    <RefetchContext.Provider value={{ registerRefetch, unregisterRefetch, refetch, isRefetching }}>
      {children}
    </RefetchContext.Provider>
  );
}

export function useRefetch() {
  const context = useContext(RefetchContext);
  if (context === undefined) {
    throw new Error('useRefetch must be used within a RefetchProvider');
  }
  return context;
}
