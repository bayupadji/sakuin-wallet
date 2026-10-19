import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PromoBannerCms } from '@/features/wallet/presentation/admin/promo-banner-cms';

export const metadata = {
  title: 'CMS Promo Banner | Admin Console Sakuin',
  description: 'Pengelolaan konten promo banner karusel dengan sistem kompresi gambar wajib otomatis.',
};

export default function AdminBannersPage() {
  return (
    <div className="space-y-6 font-sans text-slate-100">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Kembali ke Konsol Admin</span>
        </Link>
        <PromoBannerCms />
      </div>
    </div>
  );
}
