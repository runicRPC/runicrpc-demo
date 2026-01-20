import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import React from 'react';
import '@runic-rpc/ui/styles';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { RefetchProvider } from '@/contexts/RefetchContext';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'runicRPC Demo - Solana Wallet Tracker',
  description: 'Real-time Solana wallet tracking powered by runicRPC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} ${spaceGrotesk.variable}`} suppressHydrationWarning>
        <NotificationProvider>
          <RefetchProvider>
            <ClientLayout>{children}</ClientLayout>
          </RefetchProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
