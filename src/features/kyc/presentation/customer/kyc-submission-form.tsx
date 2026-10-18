'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSubmitKycMutation } from '../../application/mutations/use-kyc-mutations';
import { validateIdCardFile, validateNik } from '../../domain/rules/kyc-rules';
import { Button } from '@/shared/presentation/ui/button';
import { Input } from '@/shared/presentation/ui/input';
import { Camera, CheckCircle2, UploadCloud, X } from 'lucide-react';

export function KycSubmissionForm() {
  const [nik, setNik] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitKycMutation = useSubmitKycMutation();
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateIdCardFile({ size: file.size, type: file.type });
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Format berkas tidak valid.');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Check minimum dimensions (sharpness heuristic: at least 600px wide)
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      if (img.width < 600 || img.height < 400) {
        setErrorMessage('Resolusi foto terlalu rendah. Harap unggah foto KTP yang jelas dan terbaca tajam.');
        URL.revokeObjectURL(objectUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(objectUrl);
    };
    img.src = objectUrl;
  }

  function handleClearFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const nikValidation = validateNik(nik);
    if (!nikValidation.valid) {
      setErrorMessage(nikValidation.error || 'Nomor NIK tidak valid.');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Harap unggah foto e-KTP asli Anda.');
      return;
    }

    try {
      await submitKycMutation.mutateAsync({
        nik: nik.trim(),
        photoFile: selectedFile,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/wallet');
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Gagal mengirimkan berkas verifikasi. Silakan coba kembali.');
      }
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-teal-800 bg-teal-950/40 p-8 text-center space-y-3">
        <CheckCircle2 className="mx-auto h-12 w-12 text-teal-400" aria-hidden="true" />
        <h3 className="text-lg font-bold text-white">
          Berkas Verifikasi Terkirim
        </h3>
        <p className="text-xs text-teal-200 max-w-md mx-auto leading-relaxed">
          Foto KTP Anda sedang dalam proses peninjauan kepatuhan perbankan. Anda akan dialihkan kembali ke ringkasan dompet...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-rose-900 bg-rose-950/60 p-4 text-xs font-medium text-rose-300"
        >
          {errorMessage}
        </div>
      )}

      {/* NIK Input */}
      <div>
        <Input
          label="Nomor Induk Kependudukan (NIK 16 Digit)"
          id="kyc-nik"
          value={nik}
          onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
          placeholder="3171xxxxxxxxxxxx"
          helperText="Nomor NIK Anda dienkripsi penuh di level database dan tidak pernah dibagikan ke pihak ketiga."
          inputMode="numeric"
          className="border-slate-800 bg-[#0c121e] text-white focus:border-teal-500 font-mono tracking-wider"
          required
        />
      </div>

      {/* ID Card Photo Uploader */}
      <div className="space-y-2">
        <label
          htmlFor="kyc-photo"
          className="block text-xs font-semibold text-slate-300"
        >
          Foto e-KTP Asli
        </label>
        <p className="text-[11px] text-slate-400">
          Ambil foto KTP dengan pencahayaan terang dan seluruh sudut terbaca jelas. Format JPG atau PNG, maksimal 5 MB.
        </p>

        {previewUrl ? (
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0c121e] p-2.5">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800">
              <Image
                src={previewUrl}
                alt="Pratinjau foto KTP"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between px-1">
              <span className="text-xs font-medium text-slate-300 truncate max-w-xs font-mono">
                {selectedFile?.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearFile}
                className="text-rose-400 hover:text-rose-300 gap-1 text-xs"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Hapus Foto</span>
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-[#0c121e]/80 p-8 text-center transition-colors cursor-pointer hover:border-teal-500 hover:bg-[#0c121e]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-950 text-teal-400 border border-teal-800/40 mb-3">
              <Camera className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="text-xs font-bold text-white">
              Klik atau ketuk untuk memilih foto e-KTP
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Mendukung format JPG atau PNG hingga ukuran 5 MB
            </p>
            <input
              ref={fileInputRef}
              id="kyc-photo"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold border-teal-500"
        isLoading={submitKycMutation.isPending}
      >
        <UploadCloud className="h-4 w-4" aria-hidden="true" />
        <span>Kirim Berkas Verifikasi</span>
      </Button>
    </form>
  );
}
