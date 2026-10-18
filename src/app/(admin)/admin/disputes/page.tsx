import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/presentation/ui/button';

export default function AdminDisputesPage() {
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
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold text-white">Sengketa &amp; Chargebacks (Disputes)</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Investigasi chargeback kartu virtual dan klaim merchant jaringan VISA.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#111726] p-8 text-center space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-950/60 text-teal-400 border border-teal-800/40 mx-auto">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-base font-bold text-white">Tidak Ada Sengketa Aktif</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Semua transaksi kartu virtual berstatus aman. Tidak ada permintaan chargeback dari mitra perbankan.
        </p>
        <div className="pt-2">
          <Link href="/admin">
            <Button variant="secondary" size="sm">
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
