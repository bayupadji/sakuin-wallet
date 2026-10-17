'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils/cn';
import { messages } from '@/shared/messages/en';
import { FxRateWidget } from '@/shared/presentation/ui/fx-rate-widget';
import { useAuthUser } from '@/features/auth';
import {
  Bell,
  CreditCard,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';

export interface CustomerLayoutProps {
  children: React.ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const { data: user } = useAuthUser();

  const navItems = [
    { label: 'Overview', href: '/wallet', icon: LayoutDashboard },
    { label: 'Top Up', href: '/top-up', icon: PlusCircle },
    { label: 'Virtual Card', href: '/card', icon: CreditCard },
    { label: 'Activity', href: '/transactions', icon: History },
  ];

  const notifications = [
    {
      id: 'notif-1',
      title: 'Top Up Successful',
      desc: '+$500.00 USD deposited via BCA Virtual Account.',
      time: '14:20 WIB',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Exchange Rate Guaranteed',
      desc: 'FX rate locked at Rp 16.250 / USD for 15 minutes.',
      time: '12:05 WIB',
      read: true,
    },
    {
      id: 'notif-3',
      title: 'KTP ID Verification',
      desc: 'Your identity document has been received for compliance review.',
      time: 'Yesterday',
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const userDisplayName = user?.fullName || 'Budi Santoso';
  const userInitials = userDisplayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090D14] dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#090D14]/90 transition-colors">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Left: Brand */}
          <div className="flex items-center gap-8">
            <Link
              href="/wallet"
              className="flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-950 dark:text-white group"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white font-mono text-sm font-bold shadow-xs transition-transform group-hover:scale-105">
                $
              </span>
              <span className="tracking-tight">{messages.common.appName}</span>
            </Link>

            {/* Desktop Navigation Pill Tabs (Linear / Apple style) */}
            <nav
              className="hidden md:flex items-center space-x-1 rounded-lg bg-slate-100/70 p-1 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60"
              aria-label="Customer Main Navigation"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all duration-150 min-h-[34px]',
                      isActive
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-800 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: FX Rate ticker, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:block">
              <FxRateWidget compact />
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-850 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer min-h-[36px]"
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-expanded={notificationsOpen}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white shadow-2xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 text-xs">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Notifications
                    </span>
                    <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                      Mark all as read
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          'p-3 rounded-xl transition-colors',
                          !n.read ? 'bg-teal-50/50 dark:bg-teal-950/20' : ''
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white p-1 pr-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-850 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer min-h-[44px]"
                aria-expanded={userMenuOpen}
                aria-label="User account menu"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-semibold text-[11px] dark:bg-teal-950 dark:text-teal-300">
                  {userInitials}
                </div>
                <span className="hidden sm:inline font-medium text-xs max-w-[120px] truncate">
                  {userDisplayName}
                </span>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 text-xs"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {userDisplayName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>

                  <Link
                    href="/kyc/submit"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <ShieldCheck className="h-4 w-4 text-teal-600" aria-hidden="true" />
                    <span>Identity Verification (KYC)</span>
                  </Link>

                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span>Admin Console</span>
                  </Link>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <Link
                    href="/signin"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <FxRateWidget compact className="w-full justify-center" />
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium min-h-[44px]',
                      isActive
                        ? 'bg-slate-100 text-teal-800 dark:bg-slate-800 dark:text-teal-400 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-850'
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Modern Minimal Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 dark:border-slate-800/80 dark:bg-[#090D14]">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">
              {messages.common.appName}
            </span>
            <span>&bull;</span>
            <span>Bank-grade USD Wallet for Indonesian Professionals</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <span>&copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
