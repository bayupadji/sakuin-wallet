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
      setErrorMessage(validation.error || 'Invalid file.');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Check minimum dimensions (sharpness heuristic: at least 600px wide)
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      if (img.width < 600 || img.height < 400) {
        setErrorMessage('The image resolution is too low. Please upload a clear, sharp photo.');
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
      setErrorMessage(nikValidation.error || 'Invalid NIK.');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Please upload a clear photo of your Indonesian National ID (KTP).');
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
        setErrorMessage('Failed to submit verification. Please try again.');
      }
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-8 text-center dark:border-teal-900 dark:bg-teal-950/60">
        <CheckCircle2 className="mx-auto h-12 w-12 text-teal-600 dark:text-teal-400" aria-hidden="true" />
        <h3 className="mt-4 text-lg font-bold text-teal-950 dark:text-white">
          Verification Submitted
        </h3>
        <p className="mt-2 text-sm text-teal-800 dark:text-teal-300">
          Your ID card photo is currently in review by our compliance team. You will be redirected to your wallet overview...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
        >
          {errorMessage}
        </div>
      )}

      {/* NIK Input */}
      <Input
        label="National ID Number (NIK)"
        id="kyc-nik"
        value={nik}
        onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
        placeholder="16-digit Indonesian ID number"
        helperText="Your NIK is encrypted at rest and never shown in plain text."
        inputMode="numeric"
        required
      />

      {/* ID Card Photo Uploader */}
      <div className="space-y-2">
        <label
          htmlFor="kyc-photo"
          className="block text-sm font-medium text-slate-800 dark:text-slate-200"
        >
          KTP Photo (ID Card)
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload a clear, well-lit photo of your original KTP. JPG or PNG, max 5 MB.
        </p>

        {previewUrl ? (
          <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-800">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={previewUrl}
                alt="Uploaded ID card preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="mt-2 flex items-center justify-between px-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-xs">
                {selectedFile?.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearFile}
                className="text-rose-600 hover:text-rose-700 gap-1 text-xs"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Remove</span>
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-colors cursor-pointer hover:border-teal-500 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-teal-400"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 mb-3">
              <Camera className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Click or tap to upload photo
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports JPG or PNG up to 5 MB
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
        className="w-full gap-2"
        isLoading={submitKycMutation.isPending}
      >
        <UploadCloud className="h-5 w-5" aria-hidden="true" />
        <span>Submit Verification</span>
      </Button>
    </form>
  );
}
