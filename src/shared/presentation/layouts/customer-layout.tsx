'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/shared/utils/cn';
import { FxRateWidget } from '@/shared/presentation/ui/fx-rate-widget';
import { useAuthUser, useSignOutMutation } from '@/features/auth';
import {
  Bell,
  CreditCard,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
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
  const router = useRouter();
  const { data: user } = useAuthUser();
  const signOutMutation = useSignOutMutation();

  function handleSignOut() {
    signOutMutation.mutate(undefined, {
      onSettled: () => {
        router.push('/signin');
      },
    });
  }

  const navItems = [
    { label: 'Ringkasan', href: '/wallet', icon: LayoutDashboard },
    { label: 'Kartu Virtual', href: '/card', icon: CreditCard },
    { label: 'Riwayat Transaksi', href: '/transactions', icon: History },
  ];

  const notifications = [
    {
      id: 'notif-1',
      title: 'Top Up Berhasil',
      desc: '+$500.00 USD berhasil ditambahkan via BCA Virtual Account.',
      time: '14:20 WIB',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Garansi Kurs Aktif',
      desc: 'Nilai tukar dikunci pada Rp 16.250 / USD selama 15 menit.',
      time: '12:05 WIB',
      read: true,
    },
    {
      id: 'notif-3',
      title: 'Verifikasi KTP',
      desc: 'Foto KTP Anda telah diterima untuk peninjauan kepatuhan perbankan.',
      time: 'Kemarin',
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
    <div className="min-h-screen bg-[#090D14] text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500/20 selection:text-teal-400">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090D14]/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Left: Brand */}
          <div className="flex items-center gap-8">
            <Link
              href="/wallet"
              className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white group"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-bold text-base shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                S
              </span>
              <span className="tracking-tight text-white font-bold">Sakuin</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 px-2 py-0.5 text-[10px] font-semibold text-teal-300 ml-1">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                USD Wallet
              </span>
            </Link>

            {/* Desktop Navigation Pill Tabs (Linear / Apple style) */}
            <nav
              className="hidden md:flex items-center space-x-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800"
              aria-label="Navigasi Utama Pelanggan"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-150 min-h-[34px]',
                      isActive
                        ? 'bg-slate-800 text-teal-300 font-semibold shadow-xs border border-teal-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-850'
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
              <FxRateWidget compact className="border-slate-800 bg-[#111726] text-slate-300" />
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-[#111726] text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer min-h-[36px]"
                aria-label={`Notifikasi, ${unreadCount} belum dibaca`}
                aria-expanded={notificationsOpen}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-slate-950 shadow-2xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl border border-slate-800 bg-[#111726] p-2 shadow-2xl z-50 text-xs">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 mb-1">
                    <span className="font-bold text-white">
                      Pemberitahuan
                    </span>
                    <button
                      type="button"
                      className="text-[11px] text-teal-400 font-medium hover:underline cursor-pointer"
                    >
                      Tandai sudah dibaca
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          'p-3 rounded-xl transition-colors',
                          !n.read ? 'bg-teal-950/30 border border-teal-500/10' : ''
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
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
                className="flex items-center gap-2.5 rounded-full border border-slate-800 bg-[#111726] p-1 pr-3 text-xs font-medium text-slate-200 shadow-2xs hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer min-h-[44px]"
                aria-expanded={userMenuOpen}
                aria-label="Menu akun pengguna"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-950 text-teal-300 font-semibold text-[11px] border border-teal-800/40">
                  {userInitials}
                </div>
                <span className="hidden sm:inline font-medium text-xs max-w-[120px] truncate text-slate-200">
                  {userDisplayName}
                </span>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-[#111726] p-1.5 shadow-2xl z-50 text-xs"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="font-semibold text-white truncate">
                      {userDisplayName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate font-mono">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>

                  <Link
                    href="/kyc/submit"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4 text-teal-400" aria-hidden="true" />
                    <span>Verifikasi KTP (KYC)</span>
                  </Link>

                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <span>Konsol Kepatuhan</span>
                  </Link>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2 rounded-lg px-3 py-2 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>Keluar (Sign Out)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-11 w-11 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Buka menu navigasi mobile"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-[#111726] px-4 py-3 space-y-3">
            <FxRateWidget compact className="w-full justify-center border-slate-800 bg-slate-900 text-slate-300" />
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
                        ? 'bg-slate-800 text-teal-300 font-semibold border border-teal-500/20'
                        : 'text-slate-300 hover:bg-slate-850 hover:text-white'
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
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* Modern Minimalist Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090D14] py-8">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              Sakuin
            </span>
            <span>&bull;</span>
            <span>Dompet Digital USD untuk Profesional & Bisnis Indonesia</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Halaman Depan
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              Kepatuhan
            </Link>
            <span>&copy; 2026 Sakuin Wallet</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
