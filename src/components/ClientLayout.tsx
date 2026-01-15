'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppShell, Sidebar, SidebarItem, Topbar, IconButton } from '@runic-rpc/ui';
import { Home, Activity, Settings, Bell, BellOff, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useNotifications } from '@/contexts/NotificationContext';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { notificationsEnabled, toggleNotifications } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <AppShell
      mobileMenuOpen={mobileMenuOpen}
      onMobileMenuToggle={toggleMobileMenu}
      sidebar={
        <Sidebar
          mobileOpen={mobileMenuOpen}
          logo={
            <div className="flex items-center gap-3">
              <Image
                src="/icon.png"
                alt="RunicRPC Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-text-primary font-semibold text-sm sm:text-base">RunicRPC Demo</span>
            </div>
          }
          footer={
            <a
              href="https://runicrpc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
            >
              <span>Powered by</span>
              <span className="text-cyan-primary font-semibold">runicRPC</span>
            </a>
          }
        >
          <div className="space-y-1">
            <Link href="/" className="block" onClick={closeMobileMenu}>
              <SidebarItem icon={<Home className="w-5 h-5" />} label="Dashboard" active={pathname === '/'} />
            </Link>
            <Link href="/activity" className="block" onClick={closeMobileMenu}>
              <SidebarItem icon={<Activity className="w-5 h-5" />} label="Activity" active={pathname === '/activity'} />
            </Link>
            <Link href="/settings" className="block" onClick={closeMobileMenu}>
              <SidebarItem icon={<Settings className="w-5 h-5" />} label="Settings" active={pathname === '/settings'} />
            </Link>
          </div>
        </Sidebar>
      }
      topbar={
        <Topbar
          mobileMenuButton={
            <IconButton variant="circle" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </IconButton>
          }
          rightContent={
            <IconButton
              variant="circle"
              onClick={toggleNotifications}
              className={notificationsEnabled ? '' : 'opacity-50'}
            >
              {notificationsEnabled ? (
                <Bell className="w-5 h-5" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
            </IconButton>
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}
