import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Monitoring & Rekonsiliasi',
};

export default function AdminMonitoringPage() {
  return (
    <div className="space-y-6 font-sans text-zinc-100">
      <div className="border-b border-white/8 pb-5">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Kembali ke Ringkasan Admin</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-950/60 text-[#22D3EE] border border-sky-800/40">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold text-white">Monitoring &amp; Audit Rekonsiliasi</h1>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Integritas buku besar double-entry, throughput transaksi, dan latensi webhook bank.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/8 bg-[#050507] p-5 space-y-1">
          <span className="text-xs text-zinc-400">Status Buku Besar</span>
          <p className="text-lg font-bold text-[#7CE8C8] font-mono">100% Balanced</p>
          <span className="text-[11px] text-zinc-500 font-mono">Zero rounding drift</span>
        </div>
        <div className="rounded-2xl border border-white/8 bg-[#050507] p-5 space-y-1">
          <span className="text-xs text-zinc-400">Webhook Success Rate</span>
          <p className="text-lg font-bold text-white font-mono">99.98%</p>
          <span className="text-[11px] text-zinc-500 font-mono">BCA &amp; QRIS Gateways</span>
        </div>
        <div className="rounded-2xl border border-white/8 bg-[#050507] p-5 space-y-1">
          <span className="text-xs text-zinc-400">P95 Verification Latency</span>
          <p className="text-lg font-bold text-[#22D3EE] font-mono">180ms</p>
          <span className="text-[11px] text-zinc-500 font-mono">Edge compliance pipeline</span>
        </div>
      </div>
    </div>
  );
}
