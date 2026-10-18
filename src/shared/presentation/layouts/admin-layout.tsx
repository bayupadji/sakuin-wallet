'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils/cn';
import { Activity, AlertTriangle, FileCheck, Shield, Users } from 'lucide-react';

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const adminNav = [
    { label: 'Ringkasan Konsol', href: '/admin', icon: Shield },
    { label: 'KYC Review Queue', href: '/admin/kyc', icon: FileCheck },
    { label: 'Customer Management', href: '/admin/customers', icon: Users },
    { label: 'Disputes & Chargebacks', href: '/admin/disputes', icon: AlertTriangle },
    { label: 'Monitoring & Traffic', href: '/admin/monitoring', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 p-4 sm:p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
            <Shield className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-white">Admin Console</h1>
            <span className="text-xs text-slate-400">Dompet Digital Dollar</span>
          </div>
        </div>

        <nav className="space-y-1 flex-1" aria-label="Admin Navigation">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]',
                  isActive
                    ? 'bg-slate-800 text-teal-400 font-semibold'
                    : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-850 mt-auto">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Role: Super Admin</span>
            <span className="rounded bg-teal-950 px-1.5 py-0.5 text-teal-400 border border-teal-800">
              2FA Active
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
