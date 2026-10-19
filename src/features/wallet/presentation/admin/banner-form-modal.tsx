'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Save,
} from 'lucide-react';
import {
  PromoBannerItem,
  CreatePromoBannerInput,
  PromoActionType,
} from '../../domain/entities/promo-banner';
import { BannerUploadDropzone } from './banner-upload-dropzone';
import { CompressionResult } from '../../application/services/image-compressor';
import { Button } from '@/shared/presentation/ui/button';

export interface BannerFormModalProps {
  isOpen: boolean;
  banner?: PromoBannerItem | null;
  onClose: () => void;
  onSave: (bannerData: CreatePromoBannerInput) => void;
}

export function BannerFormModal({
  isOpen,
  banner,
  onClose,
  onSave,
}: BannerFormModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="banner-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <BannerFormContent
        key={banner ? banner.id : 'new-banner'}
        banner={banner}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
}

function BannerFormContent({
  banner,
  onClose,
  onSave,
}: {
  banner?: PromoBannerItem | null;
  onClose: () => void;
  onSave: (bannerData: CreatePromoBannerInput) => void;
}) {
  const isEditing = Boolean(banner);

  const [title, setTitle] = useState(banner?.title || '');
  const [badge, setBadge] = useState(banner?.badge || 'PROMO SPESIAL');
  const [headline, setHeadline] = useState(banner?.headline || '');
  const [summary, setSummary] = useState(banner?.summary || '');
  const [period, setPeriod] = useState(banner?.period || 'Berlaku hingga 31 Desember 2026');
  const [promoCode, setPromoCode] = useState(banner?.promoCode || '');
  const [actionType, setActionType] = useState<PromoActionType>(banner?.actionType || 'card');
  const [ctaText, setCtaText] = useState(banner?.ctaText || 'Ajukan Sekarang');
  const [ctaHref, setCtaHref] = useState(banner?.ctaHref || '/card');
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);

  // Compression metrics
  const [imageSrc, setImageSrc] = useState(banner?.imageSrc || '');
  const [originalImageSize, setOriginalImageSize] = useState<string | undefined>(
    banner?.originalImageSizeFormatted
  );
  const [compressedImageSize, setCompressedImageSize] = useState<string | undefined>(
    banner?.compressedImageSizeFormatted
  );
  const [compressionSavings, setCompressionSavings] = useState<number | undefined>(
    banner?.compressionSavingsPercent
  );

  // Dynamic Lists: Steps & Terms
  const [steps, setSteps] = useState<string[]>(
    banner && banner.steps.length > 0
      ? [...banner.steps]
      : [
          'Pastikan akun Anda telah terverifikasi identitas.',
          'Buka menu fitur pada aplikasi Sakuin.',
        ]
  );
  const [terms, setTerms] = useState<string[]>(
    banner && banner.terms.length > 0
      ? [...banner.terms]
      : [
          'Berlaku untuk seluruh akun pengguna Sakuin aktif.',
          'Promo tidak dapat digabungkan dengan program lain.',
        ]
  );

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCompressed = (result: CompressionResult) => {
    setImageSrc(result.dataUrl);
    setOriginalImageSize(result.originalSizeFormatted);
    setCompressedImageSize(result.compressedSizeFormatted);
    setCompressionSavings(result.savingsPercent);

    if (errors.image) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
    }
  };

  const handleActionTypeChange = (type: PromoActionType) => {
    setActionType(type);
    if (type === 'card') {
      setCtaHref('/card');
      setCtaText('Ajukan Kartu Sekarang');
    } else if (type === 'topup') {
      setCtaHref('');
      setCtaText('Mulai Top Up Saldo');
    } else if (type === 'receive') {
      setCtaHref('');
      setCtaText('Terima Pembayaran Sekarang');
    } else if (type === 'custom') {
      setCtaHref('/');
      setCtaText('Klaim Promo');
    }
  };

  const handleAddStep = () => {
    setSteps((prev) => [...prev, '']);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, val: string) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleAddTerm = () => {
    setTerms((prev) => [...prev, '']);
  };

  const handleRemoveTerm = (index: number) => {
    if (terms.length <= 1) return;
    setTerms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTermChange = (index: number, val: string) => {
    setTerms((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Judul banner wajib diisi.';
    if (!badge.trim()) newErrors.badge = 'Lencana kategori wajib diisi.';
    if (!headline.trim()) newErrors.headline = 'Subjudul / headline wajib diisi.';
    if (!summary.trim()) newErrors.summary = 'Ringkasan promo wajib diisi.';
    if (!period.trim()) newErrors.period = 'Periode promo wajib diisi.';
    if (!imageSrc) {
      newErrors.image = 'Wajib mengunggah dan mengompres foto banner terlebih dahulu.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const filteredSteps = steps.map((s) => s.trim()).filter(Boolean);
    const filteredTerms = terms.map((t) => t.trim()).filter(Boolean);

    onSave({
      title: title.trim(),
      badge: badge.trim(),
      headline: headline.trim(),
      summary: summary.trim(),
      period: period.trim(),
      promoCode: promoCode.trim() ? promoCode.trim().toUpperCase() : undefined,
      actionType,
      ctaText: ctaText.trim() || 'Lihat Promo',
      ctaHref: actionType === 'card' ? '/card' : actionType === 'custom' ? ctaHref.trim() : undefined,
      imageSrc,
      alt: `Promo ${title.trim()} Sakuin Dompet Digital Dollar`,
      steps: filteredSteps.length > 0 ? filteredSteps : ['Selesaikan transaksi melalui aplikasi.'],
      terms: filteredTerms.length > 0 ? filteredTerms : ['Syarat dan ketentuan umum berlaku.'],
      isActive,
      originalImageSizeFormatted: originalImageSize,
      compressedImageSizeFormatted: compressedImageSize,
      compressionSavingsPercent: compressionSavings,
    });

    onClose();
  };

  return (
    <div
      className="relative flex flex-col w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1424] shadow-2xl text-slate-100"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#090e1a] px-6 py-4 shrink-0">
        <div>
          <h2 id="banner-form-title" className="text-base font-bold text-white">
            {isEditing ? 'Ubah Promo Banner' : 'Tambah Promo Banner Baru'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Isi parameter banner dan unggah foto dengan kompresi wajib otomatis.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Tutup formulir"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Form Body (Scrollable) */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Upload Dropzone (Wajib Kompresi) */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a101d] p-4 sm:p-5">
          <BannerUploadDropzone
            currentImageUrl={imageSrc}
            onCompressed={handleCompressed}
            error={errors.image}
          />
        </div>

        {/* Basic Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Judul Promo <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kartu Virtual VISA Platinum"
              className="w-full rounded-xl border border-slate-800 bg-[#080d18] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            {errors.title && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Lencana / Badge Kategori <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Contoh: KARTU DEBIT • VISA PLATINUM"
              className="w-full rounded-xl border border-slate-800 bg-[#080d18] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            {errors.badge && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.badge}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Subjudul / Headline Nilai Manfaat <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Contoh: Belanja Internasional Bebas Biaya Konversi Ganda"
              className="w-full rounded-xl border border-slate-800 bg-[#080d18] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            {errors.headline && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.headline}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Ringkasan Penjelasan <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Jelaskan secara ringkas manfaat promo ini bagi pelanggan..."
              className="w-full rounded-xl border border-slate-800 bg-[#080d18] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
            />
            {errors.summary && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.summary}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Periode Masa Berlaku <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Contoh: Berlaku hingga 31 Desember 2026"
              className="w-full rounded-xl border border-slate-800 bg-[#080d18] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            {errors.period && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.period}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Kode Promo Voucher (Opsional)</span>
              <span className="text-[10px] text-slate-500">Huruf kapital</span>
            </label>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Contoh: SAKUINVISA"
              className="w-full rounded-xl border border-slate-800 bg-[#080d18] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 uppercase font-mono focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Action Destination Config */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a101d] p-4 sm:p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Tindakan Aksi Tombol (CTA)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { type: 'card', label: 'Kartu VISA (/card)' },
              { type: 'topup', label: 'Buka Modal Top Up' },
              { type: 'receive', label: 'Buka Modal Terima Dana' },
              { type: 'custom', label: 'Tautan Kustom' },
            ].map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleActionTypeChange(opt.type as PromoActionType)}
                className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                  actionType === opt.type
                    ? 'border-teal-500 bg-teal-950/60 text-teal-300 shadow-sm'
                    : 'border-slate-800 bg-[#080d18] text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Label Teks Tombol CTA
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Contoh: Ajukan Kartu Sekarang"
                className="w-full rounded-xl border border-slate-800 bg-[#080d18] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {actionType === 'custom' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  URL Tautan Tujuan Kustom
                </label>
                <input
                  type="text"
                  value={ctaHref}
                  onChange={(e) => setCtaHref(e.target.value)}
                  placeholder="https://... atau /path"
                  className="w-full rounded-xl border border-slate-800 bg-[#080d18] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Steps */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Panduan Cara Menggunakan (Langkah)
            </label>
            <button
              type="button"
              onClick={handleAddStep}
              className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tambah Langkah</span>
            </button>
          </div>

          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-teal-300">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  placeholder={`Langkah ${idx + 1}...`}
                  className="flex-1 rounded-xl border border-slate-800 bg-[#080d18] px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    aria-label={`Hapus langkah ${idx + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Terms */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Syarat &amp; Ketentuan Promo (S&amp;K)
            </label>
            <button
              type="button"
              onClick={handleAddTerm}
              className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tambah Ketentuan</span>
            </button>
          </div>

          <div className="space-y-2">
            {terms.map((term, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0 ml-2 mr-1" />
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleTermChange(idx, e.target.value)}
                  placeholder={`Ketentuan ${idx + 1}...`}
                  className="flex-1 rounded-xl border border-slate-800 bg-[#080d18] px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                {terms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTerm(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    aria-label={`Hapus ketentuan ${idx + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0a101d] p-3.5">
          <div>
            <span className="text-xs font-semibold text-white block">
              Status Publikasi Banner
            </span>
            <span className="text-[11px] text-slate-400">
              {isActive
                ? 'Banner akan langsung tampil di karusel dashboard pelanggan.'
                : 'Banner disimpan sebagai draf dan disembunyikan dari dashboard pelanggan.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isActive ? 'bg-teal-500' : 'bg-slate-700'
            }`}
            role="switch"
            aria-checked={isActive}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-[#090e1a] px-6 py-4 shrink-0">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white"
        >
          Batal
        </Button>

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          <span>{isEditing ? 'Simpan Perubahan' : 'Buat Banner Promo'}</span>
        </button>
      </div>
    </div>
  );
}
