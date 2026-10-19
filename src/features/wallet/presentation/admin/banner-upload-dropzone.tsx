'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  compressBannerImage,
  CompressionResult,
} from '../../application/services/image-compressor';

export interface BannerUploadDropzoneProps {
  currentImageUrl?: string;
  onCompressed: (result: CompressionResult) => void;
  error?: string;
}

export function BannerUploadDropzone({
  currentImageUrl,
  onCompressed,
  error,
}: BannerUploadDropzoneProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeImage = compressionResult?.dataUrl || currentImageUrl;

  const handleFile = async (file: File) => {
    setLocalError(null);

    // Validasi tipe berkas
    if (!file.type.startsWith('image/')) {
      setLocalError('Berkas harus berupa gambar (PNG, JPG, JPEG, atau WebP).');
      return;
    }

    try {
      setIsCompressing(true);

      // Wajib kompresi gambar client-side
      const result = await compressBannerImage(file, {
        maxWidth: 1440,
        maxHeight: 280,
        quality: 0.82,
        format: 'image/webp',
      });

      setCompressionResult(result);
      onCompressed(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengompresi gambar banner.';
      setLocalError(msg);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <span>Foto Banner Panorama</span>
          <span className="text-rose-400">*</span>
          <span className="inline-flex items-center gap-1 rounded bg-teal-950/80 px-2 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-800/60">
            <Zap className="h-3 w-3 text-teal-400" aria-hidden="true" />
            <span>Wajib Kompresi Otomatis</span>
          </span>
        </label>
        <span className="text-[11px] text-slate-400">Rekomendasi: 1440 × 280 px (~5:1)</span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Upload Dropzone Container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClickUpload}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 sm:p-6 transition-all cursor-pointer ${
          isDragging
            ? 'border-teal-400 bg-teal-950/20'
            : error || localError
            ? 'border-rose-700/60 bg-rose-950/10 hover:border-rose-600'
            : activeImage
            ? 'border-slate-700 bg-slate-900/60 hover:border-teal-500/60'
            : 'border-slate-800 bg-[#090e18] hover:border-slate-700 hover:bg-slate-900/40'
        }`}
      >
        {isCompressing ? (
          <div className="flex flex-col items-center py-6 space-y-2">
            <RefreshCw className="h-8 w-8 text-teal-400 animate-spin" aria-hidden="true" />
            <p className="text-xs font-semibold text-slate-200">
              Sedang Mengompresi Foto Banner...
            </p>
            <p className="text-[11px] text-slate-400">
              Mengoptimalkan resolusi dan ukuran berkas ke format WebP 1440px
            </p>
          </div>
        ) : activeImage ? (
          <div className="w-full space-y-3">
            {/* Aspect Ratio Preview Container */}
            <div className="relative w-full h-28 sm:h-36 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
              <Image
                src={activeImage}
                alt="Pratinjau Banner Terkompresi"
                fill
                unoptimized={activeImage.startsWith('data:')}
                className="object-cover object-left sm:object-center"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-teal-300 border border-slate-700 backdrop-blur-md">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
                <span>Terkompresi</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400">Klik atau geser foto baru untuk mengganti</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickUpload();
                }}
                className="text-teal-400 hover:text-teal-300 font-semibold cursor-pointer underline"
              >
                Unggah Ulang
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-5 space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-950/70 text-teal-400 border border-teal-800/40">
              <UploadCloud className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Pilih atau Geser Foto Banner ke Sini
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mendukung format PNG, JPG, atau WebP (Foto akan dikompresi otomatis)
              </p>
            </div>
            <span className="rounded-lg bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-300">
              Jelajahi Berkas
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {(error || localError) && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-800/40 p-2.5 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error || localError}</span>
        </div>
      )}

      {/* Compression Result Report Widget (Wajib Tampil Ketika Berhasil Dikompresi) */}
      {compressionResult && (
        <div className="rounded-xl border border-teal-800/50 bg-teal-950/30 p-3.5 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-teal-400" aria-hidden="true" />
              <span className="text-xs font-bold text-teal-300">
                Laporan Hasil Kompresi Wajib
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-500/30">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span>Hemat {compressionResult.savingsPercent}%</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
            <div className="rounded-lg bg-[#0c1422] p-2 border border-slate-800">
              <span className="text-slate-500 block">Ukuran Awal</span>
              <span className="font-mono font-semibold text-slate-300">
                {compressionResult.originalSizeFormatted}
              </span>
            </div>
            <div className="rounded-lg bg-[#0c1422] p-2 border border-slate-800">
              <span className="text-slate-500 block">Ukuran Kompresi</span>
              <span className="font-mono font-bold text-teal-400">
                {compressionResult.compressedSizeFormatted}
              </span>
            </div>
            <div className="rounded-lg bg-[#0c1422] p-2 border border-slate-800">
              <span className="text-slate-500 block">Dimensi Output</span>
              <span className="font-mono font-semibold text-slate-300">
                {compressionResult.width} × {compressionResult.height} px
              </span>
            </div>
            <div className="rounded-lg bg-[#0c1422] p-2 border border-slate-800">
              <span className="text-slate-500 block">Format Berkas</span>
              <span className="font-mono font-semibold text-slate-300">
                {compressionResult.format}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
