import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import '@runic-rpc/ui/styles';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';
import { NotificationProvider } from '@/contexts/NotificationContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RunicRPC Demo - Solana Wallet Tracker',
  description: 'Real-time Solana wallet tracking powered by RunicRPC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <NotificationProvider>
          <ClientLayout>{children}</ClientLayout>
        </NotificationProvider>
      </body>
    </html>
  );
}
