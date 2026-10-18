import React from 'react';
import Link from 'next/link';
import { KycSubmissionForm } from '@/features/kyc';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Verifikasi Identitas (KYC) | Sakuin USD Wallet',
  description: 'Upload foto KTP asli Anda untuk memverifikasi akun dan membuka fitur kartu virtual.',
};

export default function KycSubmitPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6 text-slate-100">
      <div>
        <Link
          href="/wallet"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Kembali ke Ringkasan Dompet</span>
        </Link>
        <div className="mt-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-950 text-teal-400 border border-teal-800/40">
            <Shield className="h-4 w-4" aria-hidden="true" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Verifikasi Identitas KTP (KYC)
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          Unggah foto e-KTP asli Anda. Data NIK dienkripsi secara ketat dan foto KTP disimpan secara privat dengan otorisasi RLS.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 sm:p-7 shadow-xl">
        <KycSubmissionForm />
      </div>
    </div>
  );
}
