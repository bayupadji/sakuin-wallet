import React from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft } from 'lucide-react';

export default function AdminMonitoringPage() {
  return (
    <div className="space-y-6 font-sans text-slate-100">
      <div className="border-b border-slate-800 pb-5">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Kembali ke Ringkasan Admin</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-950 text-teal-400 border border-teal-800/40">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold text-white">Monitoring &amp; Audit Rekonsiliasi</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Integritas buku besar double-entry, throughput transaksi, dan latensi webhook bank.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-5 space-y-1">
          <span className="text-xs text-slate-400">Status Buku Besar</span>
          <p className="text-lg font-bold text-teal-400 font-mono">100% Balanced</p>
          <span className="text-[11px] text-slate-500 font-mono">Zero rounding drift</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-5 space-y-1">
          <span className="text-xs text-slate-400">Webhook Success Rate</span>
          <p className="text-lg font-bold text-white font-mono">99.98%</p>
          <span className="text-[11px] text-slate-500 font-mono">BCA &amp; QRIS Gateways</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-5 space-y-1">
          <span className="text-xs text-slate-400">P95 Verification Latency</span>
          <p className="text-lg font-bold text-teal-400 font-mono">180ms</p>
          <span className="text-[11px] text-slate-500 font-mono">Edge compliance pipeline</span>
        </div>
      </div>
    </div>
  );
}
