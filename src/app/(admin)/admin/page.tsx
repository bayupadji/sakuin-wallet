import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/presentation/ui/button';
import {
  Activity,
  ArrowRight,
  Clock,
  FileCheck,
  RotateCcw,
  Shield,
  ShieldAlert,
  Users,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const complianceStats = [
    {
      label: 'Pending KYC Review',
      value: '2',
      change: '+1 in the last hour',
      icon: Clock,
      color: 'text-amber-400',
    },
    {
      label: 'Verified Customers',
      value: '1,428',
      change: '98.4% approval rate',
      icon: Users,
      color: 'text-teal-400',
    },
    {
      label: 'Re-uploads Requested',
      value: '14',
      change: 'Blurry / glare issues',
      icon: RotateCcw,
      color: 'text-rose-400',
    },
    {
      label: 'Avg Review Latency',
      value: '3.2 min',
      change: 'Target: < 15 min',
      icon: Activity,
      color: 'text-slate-300',
    },
  ];

  const recentAudits = [
    {
      id: 'aud-1',
      action: 'KYC_APPROVED',
      actor: 'compliance_officer_1',
      target: 'NIK 3171••••••••0002',
      time: '12 mins ago',
    },
    {
      id: 'aud-2',
      action: 'REUPLOAD_REQUESTED',
      actor: 'compliance_officer_2',
      target: 'NIK 3201••••••••0005',
      time: '34 mins ago',
    },
    {
      id: 'aud-3',
      action: 'LEDGER_RECONCILED',
      actor: 'system_daemon',
      target: 'Daily Reconciliation Batch',
      time: '2 hours ago',
    },
  ];

  return (
    <div className="space-y-8 font-sans antialiased text-slate-100">
      {/* 1. Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-950 text-teal-400 border border-teal-800">
              <Shield className="h-4 w-4" aria-hidden="true" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Compliance & Risk Console
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Strict Indonesian KYC compliance (KTP verification), audit logs, and ledger reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/kyc">
            <Button variant="primary" size="md" className="gap-2 shadow-xs font-semibold">
              <FileCheck className="h-4 w-4" aria-hidden="true" />
              <span>Review KYC Queue (2)</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>{stat.label}</span>
                <Icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
              </div>
              <p className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
                {stat.value}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* 3. Main Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Pending Submissions Teaser Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-400" aria-hidden="true" />
              <span>Pending Customer Queue</span>
            </h2>
            <Link
              href="/admin/kyc"
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              <span>Full Queue</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 divide-y divide-slate-800/80 overflow-hidden shadow-xs text-xs">
            <div className="p-4 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
              <div>
                <span className="font-mono font-bold text-white">3171••••••••0008</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Budi Santoso &bull; Attempt #1 &bull; 14 mins ago
                </p>
              </div>
              <Link href="/admin/kyc">
                <Button variant="outline" size="sm" className="text-xs">
                  Inspect ID
                </Button>
              </Link>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
              <div>
                <span className="font-mono font-bold text-white">3275••••••••0012</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dewi Lestari &bull; Attempt #2 &bull; 48 mins ago
                </p>
              </div>
              <Link href="/admin/kyc">
                <Button variant="outline" size="sm" className="text-xs">
                  Inspect ID
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Security & Immutable Audit Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-teal-400" aria-hidden="true" />
              <span>Immutable Audit Trail</span>
            </h2>
            <span className="text-[11px] text-slate-500">Live UTC</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 divide-y divide-slate-800/80 p-1 text-xs shadow-xs">
            {recentAudits.map((item) => (
              <div key={item.id} className="p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-teal-400 text-[11px]">
                    {item.action}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                </div>
                <p className="text-slate-300 font-medium">{item.target}</p>
                <p className="text-[10px] text-slate-500 font-mono">Actor: {item.actor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
