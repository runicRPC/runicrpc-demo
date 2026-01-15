'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastContainer, ToastProps } from '@/components/Toast';

interface NotificationContextType {
  addNotification: (type: ToastProps['type'], message: string) => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const addNotification = useCallback((type: ToastProps['type'], message: string) => {
    if (!notificationsEnabled) return;

    const id = `${Date.now()}-${Math.random()}`;
    const newToast: ToastProps = {
      id,
      type,
      message,
      onClose: (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
      },
    };
    setToasts(prev => [...prev, newToast]);
  }, [notificationsEnabled]);

  const toggleNotifications = useCallback(() => {
    setNotificationsEnabled(prev => !prev);
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, notificationsEnabled, toggleNotifications }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </ToastContainer>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
