'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Calendar,
  Tag,
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/shared/presentation/ui/button';
import { usePromoBannerStore } from '../../application/stores/use-promo-banner-store';
import type { PromoActionType } from '../../domain/entities/promo-banner';

export interface PromoDetail {
  id: string;
  badge: string;
  title: string;
  headline: string;
  summary: string;
  period: string;
  promoCode?: string;
  imageSrc: string;
  alt: string;
  benefits?: {
    title: string;
    description: string;
  }[];
  steps: string[];
  terms: string[];
  ctaText: string;
  ctaHref?: string;
  actionType?: PromoActionType;
}

export const PROMO_DETAILS: Record<string, PromoDetail> = {
  'banner-visa-platinum': {
    id: 'banner-visa-platinum',
    badge: 'KARTU DEBIT • VISA PLATINUM',
    title: 'Kartu Debit Virtual VISA Platinum',
    headline: 'Belanja Internasional Bebas Biaya Konversi Ganda',
    summary:
      'Dapatkan kartu debit virtual resmi VISA Platinum internasional langsung dari saldo digital dollar Anda. Belanja di jutaan merchant dunia seperti Amazon, Netflix, Steam, OpenAI, dan berbagai layanan digital global tanpa biaya konversi valuta berulang.',
    period: 'Berlaku hingga 31 Desember 2026',
    promoCode: 'SAKUINVISA',
    imageSrc: '/banners/promo-visa-card.jpg',
    alt: 'Promo Kartu Debit Virtual VISA Platinum Sakuin Dompet Digital Dollar untuk Transaksi Global',
    benefits: [
      {
        title: 'Diterima di Jutaan Merchant',
        description: 'Bisa digunakan di seluruh platform online dunia yang menerima logo VISA.',
      },
      {
        title: 'Saldo Terpotong Langsung dalam USD',
        description: 'Tanpa selisih kurs merugikan karena transaksi langsung mendebit saldo dollar Anda.',
      },
      {
        title: 'Keamanan 3D Secure & Freeze Instan',
        description: 'Verifikasi OTP otomatis serta fitur pembekuan kartu instan dari aplikasi kapan saja.',
      },
      {
        title: 'Kompatibel Dompet Digital Global',
        description: 'Dapat dihubungkan ke Apple Pay dan Google Wallet untuk kenyamanan pembayaran.',
      },
    ],
    steps: [
      'Pastikan akun Sakuin Anda telah menyelesaikan verifikasi identitas (KYC).',
      'Buka menu Kartu di aplikasi Sakuin dan tekan tombol Ajukan Kartu Virtual.',
      'Tentukan limit transaksi opsional sesuai kebutuhan belanja Anda lalu konfirmasi.',
      'Kartu virtual langsung aktif seketika dan siap dipakai untuk transaksi internasional.',
    ],
    terms: [
      'Pengguna wajib memiliki status akun terverifikasi (KYC telah disetujui admin).',
      'Setiap akun berhak menerbitkan 1 kartu debit virtual aktif secara gratis.',
      'Biaya pemeliharaan bulanan dan biaya penerbitan awal adalah $0.00 (Bebas Biaya).',
      'Transaksi langsung didebit dari saldo USD pada buku besar akun Sakuin Anda.',
    ],
    ctaText: 'Ajukan Kartu Sekarang',
    ctaHref: '/card',
    actionType: 'card',
  },
  'banner-topup-fx': {
    id: 'banner-topup-fx',
    badge: 'GARANSI KURS • 0% MARKUP VALAS',
    title: 'Top Up Rupiah ke USD Kurs Real-Time',
    headline: 'Deposit Rupiah Instan Otomatis Jadi Saldo Dollar',
    summary:
      'Konversi dana Rupiah Anda ke saldo USD dengan acuan kurs pasar tengah transparan (Wise dan Bank Indonesia) tanpa markup kurs tersembunyi. Nilai tukar dikunci selama 15 menit penuh saat Anda melakukan pembayaran.',
    period: 'Berlaku Setiap Hari (24/7)',
    promoCode: 'BEBASMARKUP',
    imageSrc: '/banners/promo-topup-fx.jpg',
    alt: 'Promo Top Up Rupiah ke USD Instan via Virtual Account BCA dan QRIS Bebas Margin Valas',
    benefits: [
      {
        title: 'Garansi Kurs Valas 15 Menit',
        description: 'Nilai konversi tidak akan berubah mendadak selama batas waktu pembayaran berlangsung.',
      },
      {
        title: 'Dukungan QRIS & Semua Bank',
        description: 'Bisa dibayar instan via QRIS BCA, Mandiri, BRI, BNI, serta e-wallet lokal lainnya.',
      },
      {
        title: 'Saldo Otomatis Masuk Seketika',
        description: 'Sistem webhook memproses kredit saldo ke dompet dollar segera setelah transfer diverifikasi.',
      },
      {
        title: 'Bisa Dibayar Siapa Saja',
        description: 'Pengirim dana tidak harus pemilik akun, memudahkan pengisian saldo dari berbagai sumber.',
      },
    ],
    steps: [
      'Buka menu Top Up pada aplikasi atau klik tombol aksi di bawah.',
      'Masukkan nominal isi saldo dalam Rupiah atau USD sesuai kebutuhan Anda.',
      'Pilih metode pembayaran (QRIS Instan atau Virtual Account bank pilihan Anda).',
      'Selesaikan transfer sebelum batas waktu garansi kurs 15 menit berakhir.',
    ],
    terms: [
      'Kurs acuan menggunakan kurs referensi Wise tanpa penambahan margin keuntungan.',
      'Batas waktu penyelesaian pembayaran adalah 15 menit sejak order deposit dibuat.',
      'Pembayaran yang melewati batas waktu kedaluwarsa akan disesuaikan dengan kurs terbaru.',
      'Tidak ada batasan frekuensi pengisian saldo harian.',
    ],
    ctaText: 'Mulai Top Up Saldo',
    actionType: 'topup',
  },
  'banner-receive-pay': {
    id: 'banner-receive-pay',
    badge: 'TAGIHAN GLOBAL • CAIR OTOMATIS',
    title: 'Terima Pembayaran Global ke Saldo USD',
    headline: 'Solusi Tagihan Freelancer & Bisnis Lintas Negara',
    summary:
      'Kirim tautan tagihan pembayaran profesional kepada klien, agensi, atau mitra internasional Anda. Dana yang dibayarkan klien langsung dikonversi dan masuk utuh ke saldo USD dompet digital Sakuin Anda tanpa potongan perantara.',
    period: 'Berlaku Selamanya',
    promoCode: 'GLOBALINVOICE',
    imageSrc: '/banners/promo-receive-pay.jpg',
    alt: 'Promo Terima Pembayaran Global dan Tagihan Freelancer Otomatis Jadi Saldo USD',
    benefits: [
      {
        title: 'Tautan Tagihan Pembayaran Mudah',
        description: 'Cukup buat tautan satu kali dan bagikan via email atau aplikasi pesan instan.',
      },
      {
        title: 'Tercatat Rapi di Buku Besar',
        description: 'Setiap penerimaan dana memiliki tanda terima kriptografis yang transparan.',
      },
      {
        title: 'Bebas Potongan Koresponden Asing',
        description: 'Tanpa potongan transfer antar bank internasional yang mahal dan tidak pasti.',
      },
      {
        title: 'Dapat Dipakai Belanja Seketika',
        description: 'Dana yang masuk dapat langsung digunakan untuk transaksi via kartu VISA Platinum.',
      },
    ],
    steps: [
      'Masuk ke menu Terima Dana pada dashboard dompet digital Anda.',
      'Isi rincian penagihan, nominal dalam USD, serta catatan tagihan.',
      'Salin tautan pembayaran resmi yang dibuat oleh sistem.',
      'Kirimkan ke klien Anda; saldo otomatis bertambah setelah klien menyelesaikan transaksi.',
    ],
    terms: [
      'Fitur tersedia untuk seluruh pengguna dengan akun Sakuin terverifikasi.',
      'Penerima dana wajib memastikan kesesuaian rincian invoice sebelum dibagikan.',
      'Dana tercatat dalam format buku besar append-only berstandar waktu lokal Jakarta (WIB).',
      'Tanda terima pembayaran otomatis tersedia dan dapat diunduh setiap saat.',
    ],
    ctaText: 'Terima Pembayaran Sekarang',
    actionType: 'receive',
  },
};

export interface PromoDetailModalProps {
  promoId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onActionClick?: (actionType?: PromoActionType) => void;
}

export function PromoDetailModal({
  promoId,
  isOpen,
  onClose,
  onActionClick,
}: PromoDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const storeBanner = usePromoBannerStore((state) =>
    promoId ? state.banners.find((b) => b.id === promoId) : null
  );

  const promo = storeBanner || (promoId ? PROMO_DETAILS[promoId] : null);

  const handleClose = useCallback(() => {
    setCopied(false);
    onClose();
  }, [onClose]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !promo) return null;

  const handleCopyCode = () => {
    if (promo.promoCode) {
      navigator.clipboard.writeText(promo.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCtaClick = () => {
    onClose();
    if (onActionClick) {
      onActionClick(promo.actionType);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md transition-opacity duration-200"
      onClick={handleClose}
    >
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1424] shadow-2xl text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Preview Header with Floating Close Button */}
        <div className="relative w-full h-36 sm:h-44 shrink-0 overflow-hidden bg-slate-950 border-b border-slate-800">
          <Image
            src={promo.imageSrc}
            alt={promo.alt}
            fill
            priority
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-cover object-left sm:object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0d1424] via-transparent to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Floating Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-950/80 text-slate-300 hover:text-white backdrop-blur-md border border-slate-700/60 shadow-lg hover:bg-slate-900 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 z-10"
            aria-label="Tutup detail promo"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-6">
          {/* Header Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-950/60 px-3 py-1 text-[11px] font-semibold text-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                {promo.badge}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                <Calendar className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
                <span>{promo.period}</span>
              </span>
            </div>

            <h2
              id="promo-detail-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-white"
            >
              {promo.title}
            </h2>
            <p className="text-sm font-medium text-teal-300 mt-1">
              {promo.headline}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              {promo.summary}
            </p>
          </div>

          {/* Promo Code Card (if available) */}
          {promo.promoCode && (
            <div className="flex items-center justify-between rounded-xl border border-teal-800/40 bg-teal-950/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-900/50 text-teal-300 border border-teal-700/40">
                  <Tag className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Kode Promo Khusus
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-teal-300 tracking-wider">
                    {promo.promoCode}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-900/60 px-3 py-1.5 text-xs font-semibold text-teal-200 hover:bg-teal-800 hover:text-white transition-colors cursor-pointer"
                aria-label={copied ? 'Kode berhasil disalin' : 'Salin kode promo'}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          )}


          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Cara Menggunakan
            </h3>
            <div className="rounded-xl border border-slate-800 bg-[#0f1728] p-4 space-y-3">
              {promo.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-teal-300 font-bold text-[10px] border border-slate-700">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed mt-0.5">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>Syarat &amp; Ketentuan</span>
            </h3>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
              <ul className="space-y-2 text-xs text-slate-400 list-disc list-inside">
                {promo.terms.map((term, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-slate-300">{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-800 bg-[#0a0f1c] px-5 sm:px-7 py-3.5 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            className="text-xs text-slate-400 hover:text-white"
          >
            Tutup
          </Button>

          {promo.ctaHref ? (
            <Link
              href={promo.ctaHref}
              onClick={handleClose}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              <span>{promo.ctaText}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              <span>{promo.ctaText}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
