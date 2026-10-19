'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Megaphone,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Zap,
  Tag,
  Calendar,
  Eye,
  MousePointerClick,
  Sparkles,
} from 'lucide-react';
import {
  PromoBannerItem,
  CreatePromoBannerInput,
} from '../../domain/entities/promo-banner';
import { usePromoBannerStore } from '../../application/stores/use-promo-banner-store';
import { BannerFormModal } from './banner-form-modal';
import { Button } from '@/shared/presentation/ui/button';

export function PromoBannerCms() {
  const {
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    reorderBanners,
    resetToDefault,
  } = usePromoBannerStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromoBannerItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Compute CMS Summary Metrics
  const metrics = useMemo(() => {
    const total = banners.length;
    const active = banners.filter((b) => b.isActive).length;
    const totalViews = banners.reduce((sum, b) => sum + (b.viewCount || 0), 0);
    const totalClicks = banners.reduce((sum, b) => sum + (b.clickCount || 0), 0);

    const savingsList = banners
      .map((b) => b.compressionSavingsPercent)
      .filter((s): s is number => typeof s === 'number');

    const avgSavings =
      savingsList.length > 0
        ? Math.round(savingsList.reduce((a, b) => a + b, 0) / savingsList.length)
        : 92;

    return { total, active, totalViews, totalClicks, avgSavings };
  }, [banners]);

  // Filtered and Sorted Banners
  const filteredBanners = useMemo(() => {
    return banners
      .filter((b) => {
        const matchesQuery =
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (b.promoCode && b.promoCode.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesQuery) return false;

        if (statusFilter === 'active') return b.isActive;
        if (statusFilter === 'inactive') return !b.isActive;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [banners, searchQuery, statusFilter]);

  const handleCreateNew = () => {
    setEditingBanner(null);
    setModalOpen(true);
  };

  const handleEdit = (banner: PromoBannerItem) => {
    setEditingBanner(banner);
    setModalOpen(true);
  };

  const handleSave = (bannerData: CreatePromoBannerInput) => {
    if (editingBanner) {
      updateBanner(editingBanner.id, bannerData);
    } else {
      addBanner(bannerData);
    }
  };

  const handleMoveOrder = (id: string, direction: 'up' | 'down') => {
    const sorted = [...banners].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((b) => b.id === id);

    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sorted.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    reorderBanners(sorted.map((b) => b.id));
  };

  const confirmDelete = (id: string) => {
    deleteBanner(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* CMS Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-950 text-teal-400 border border-teal-800/40">
              <Megaphone className="h-4 w-4" aria-hidden="true" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              CMS Promo Banner
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Kelola banner promosi dan penawaran fitur karusel dashboard dengan kompresi foto wajib otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={resetToDefault}
            className="text-xs text-slate-400 hover:text-white"
            title="Kembalikan data ke seed bawaan"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            <span>Reset Bawaan</span>
          </Button>

          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Tambah Banner Baru</span>
          </button>
        </div>
      </div>

      {/* Overview Analytics Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-4 sm:p-5">
          <span className="text-xs font-medium text-slate-400 block">Total Banner</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white font-mono">{metrics.total}</span>
            <span className="text-[11px] text-teal-400 font-medium">
              ({metrics.active} aktif)
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-4 sm:p-5">
          <span className="text-xs font-medium text-slate-400 block">Rata-rata Kompresi</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-teal-400 font-mono">
              -{metrics.avgSavings}%
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
              <Zap className="h-3 w-3 text-teal-400" aria-hidden="true" />
              <span>WebP 1440px</span>
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-4 sm:p-5">
          <span className="text-xs font-medium text-slate-400 block">Total Tayangan</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white font-mono">
              {metrics.totalViews.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-400">kali dilihat</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-4 sm:p-5">
          <span className="text-xs font-medium text-slate-400 block">Total Klik / Interaksi</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-teal-300 font-mono">
              {metrics.totalClicks.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-400">
              CTR ~
              {metrics.totalViews > 0
                ? ((metrics.totalClicks / metrics.totalViews) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-[#0e1422] p-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Cari banner berdasarkan judul, kode promo, lencana..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#080d18] pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#080d18] p-1 rounded-xl border border-slate-800 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({banners.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-slate-800 text-teal-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aktif ({banners.filter((b) => b.isActive).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              statusFilter === 'inactive'
                ? 'bg-slate-800 text-slate-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Nonaktif ({banners.filter((b) => !b.isActive).length})
          </button>
        </div>
      </div>

      {/* Banner Cards List */}
      <div className="space-y-4">
        {filteredBanners.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#111726] p-12 text-center space-y-3">
            <Megaphone className="h-10 w-10 text-slate-600 mx-auto" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-white">
              Tidak Ada Promo Banner
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ditemukan banner promo yang cocok dengan filter pencarian Anda. Silakan ubah kata kunci atau buat banner baru.
            </p>
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 px-4 py-2 text-xs font-bold text-slate-950 transition-colors cursor-pointer mt-2"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Buat Banner Baru</span>
            </button>
          </div>
        ) : (
          filteredBanners.map((banner, index) => {
            return (
              <div
                key={banner.id}
                className={`relative flex flex-col lg:flex-row lg:items-center justify-between gap-5 rounded-2xl border p-4 sm:p-5 transition-all ${
                  banner.isActive
                    ? 'border-slate-800 bg-[#111726] hover:border-slate-700'
                    : 'border-slate-800/60 bg-[#0a0f1d]/70 opacity-75'
                }`}
              >
                {/* Visual Thumbnail & Order Indicator */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                  {/* Order Controls */}
                  <div className="flex sm:flex-col items-center gap-1 shrink-0 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveOrder(banner.id, 'up')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Geser urutan ke atas"
                      aria-label="Pindahkan urutan banner ke atas"
                    >
                      <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="font-mono text-xs font-bold text-teal-400 px-1.5">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={index === filteredBanners.length - 1}
                      onClick={() => handleMoveOrder(banner.id, 'down')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Geser urutan ke bawah"
                      aria-label="Pindahkan urutan banner ke bawah"
                    >
                      <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Thumbnail Image Container */}
                  <div className="relative w-full sm:w-60 h-28 sm:h-20 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shrink-0">
                    <Image
                      src={banner.imageSrc}
                      alt={banner.alt}
                      fill
                      unoptimized={banner.imageSrc.startsWith('data:')}
                      className="object-cover object-left sm:object-center"
                    />
                    {banner.compressionSavingsPercent && (
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-bold text-teal-300 border border-teal-800/50 backdrop-blur-md">
                        <Sparkles className="h-2.5 w-2.5 text-teal-400" aria-hidden="true" />
                        <span>Hemat {banner.compressionSavingsPercent}%</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata and Details */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-teal-950/80 px-2 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-800/40">
                        {banner.badge}
                      </span>

                      {banner.promoCode && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          <Tag className="h-2.5 w-2.5 text-teal-400" aria-hidden="true" />
                          <span>{banner.promoCode}</span>
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                        <Calendar className="h-3 w-3 text-slate-500" aria-hidden="true" />
                        <span>{banner.period}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white truncate">
                      {banner.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {banner.headline}
                    </p>

                    {/* Technical Compression & Performance Metrics */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-slate-500" aria-hidden="true" />
                        <span>{banner.viewCount.toLocaleString('id-ID')} views</span>
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="h-3 w-3 text-slate-500" aria-hidden="true" />
                        <span>{banner.clickCount.toLocaleString('id-ID')} klik</span>
                      </span>
                      {banner.compressedImageSizeFormatted && (
                        <>
                          <span>&bull;</span>
                          <span className="text-teal-400/90 font-mono font-medium">
                            {banner.compressedImageSizeFormatted}
                            {banner.originalImageSizeFormatted && (
                              <span className="text-slate-500 line-through ml-1 text-[10px]">
                                {banner.originalImageSizeFormatted}
                              </span>
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Control Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 shrink-0">
                  {/* Status Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleBannerStatus(banner.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        banner.isActive ? 'bg-teal-500' : 'bg-slate-700'
                      }`}
                      role="switch"
                      aria-checked={banner.isActive}
                      title={banner.isActive ? 'Klik untuk menonaktifkan' : 'Klik untuk mengaktifkan'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                          banner.isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-xs font-medium text-slate-300">
                      {banner.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(banner)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Ubah rincian banner"
                      aria-label="Ubah rincian banner"
                    >
                      <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(banner.id)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 hover:border-rose-900/50 transition-colors cursor-pointer"
                      title="Hapus banner"
                      aria-label="Hapus banner"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Inline Delete Confirmation */}
                {deleteConfirmId === banner.id && (
                  <div className="absolute inset-0 z-10 flex items-center justify-between p-4 rounded-2xl bg-[#0e1422] border border-rose-800/80 shadow-2xl animate-in fade-in duration-150">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-rose-300">
                        Yakin ingin menghapus banner &ldquo;{banner.title}&rdquo;?
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-xs text-slate-300"
                      >
                        Batal
                      </Button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(banner.id)}
                        className="rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
                      >
                        Hapus Sekarang
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Banner Create & Edit Form Modal */}
      <BannerFormModal
        isOpen={modalOpen}
        banner={editingBanner}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
