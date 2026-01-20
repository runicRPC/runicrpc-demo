'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppShell, Sidebar, SidebarItem, Topbar, IconButton } from '@runic-rpc/ui';
import { Home, Activity, Settings, Bell, BellOff, Menu, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useNotifications } from '@/contexts/NotificationContext';
import { useRefetch } from '@/contexts/RefetchContext';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { notificationsEnabled, toggleNotifications } = useNotifications();
  const { refetch, isRefetching } = useRefetch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on window resize if it becomes desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint matches UI package
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AppShell
      mobileMenuOpen={mobileMenuOpen}
      onMobileMenuToggle={toggleMobileMenu}
      sidebar={
        <Sidebar
          mobileOpen={mobileMenuOpen}
          logo={
            <div className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/icon.png"
                alt="runicRPC Logo"
                width={32}
                height={32}
                className="rounded-lg flex-shrink-0"
              />
              <span className="text-text-primary font-semibold text-sm sm:text-base whitespace-nowrap">
                runicRPC Demo
              </span>
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
          <nav className="space-y-1">
            <Link href="/" onClick={closeMobileMenu} className="block">
              <SidebarItem 
                icon={<Home className="w-5 h-5" />} 
                label="Dashboard" 
                active={pathname === '/'} 
              />
            </Link>
            <Link href="/activity" onClick={closeMobileMenu} className="block">
              <SidebarItem 
                icon={<Activity className="w-5 h-5" />} 
                label="Activity" 
                active={pathname === '/activity'} 
              />
            </Link>
            <Link href="/settings" onClick={closeMobileMenu} className="block">
              <SidebarItem 
                icon={<Settings className="w-5 h-5" />} 
                label="Settings" 
                active={pathname === '/settings'} 
              />
            </Link>
          </nav>
        </Sidebar>
      }
      topbar={
        <Topbar
          mobileMenuButton={
            <IconButton 
              variant="circle" 
              onClick={toggleMobileMenu}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </IconButton>
          }
          rightContent={
            <div className="flex items-center gap-2">
              {pathname === '/' && (
                <IconButton
                  variant="circle"
                  onClick={refetch}
                  disabled={isRefetching}
                  className={isRefetching ? 'opacity-50' : ''}
                  aria-label="Refresh wallet data"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefetching ? 'animate-spin' : ''}`} />
                </IconButton>
              )}
              <IconButton
                variant="circle"
                onClick={toggleNotifications}
                className={notificationsEnabled ? '' : 'opacity-50'}
                aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
              >
                {notificationsEnabled ? (
                  <Bell className="w-5 h-5" />
                ) : (
                  <BellOff className="w-5 h-5" />
                )}
              </IconButton>
            </div>
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}
