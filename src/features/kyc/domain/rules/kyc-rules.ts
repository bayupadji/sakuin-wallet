import { KycStatus } from '../entities/kyc-submission';

export const KYC_LIMITS = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  MAX_ATTEMPTS: 3,
  NIK_LENGTH: 16,
} as const;

export function validateIdCardFile(file: { size: number; type: string }): { valid: boolean; error?: string } {
  if (!KYC_LIMITS.ALLOWED_MIME_TYPES.includes(file.type as (typeof KYC_LIMITS.ALLOWED_MIME_TYPES)[number])) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a clear photo in JPG or PNG format.',
    };
  }

  if (file.size > KYC_LIMITS.MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File size exceeds 5 MB. Please upload a smaller photo.',
    };
  }

  return { valid: true };
}

export function validateNik(nik: string): { valid: boolean; error?: string } {
  const cleanNik = nik.trim();
  const is16Digits = /^\d{16}$/.test(cleanNik);

  if (!is16Digits) {
    return {
      valid: false,
      error: 'ID number (NIK) must be exactly 16 numeric digits.',
    };
  }

  return { valid: true };
}

export function maskNik(nik: string): string {
  const clean = nik.trim();
  if (clean.length !== 16) {
    return '****************';
  }
  return `${clean.slice(0, 6)}******${clean.slice(12)}`;
}

/**
 * Customers who are not approved can view the wallet but cannot top up,
 * request a card, or receive payments (AGENTS.md Section 7).
 */
export function canTransact(status: KycStatus): boolean {
  return status === 'approved';
}

/**
 * Max 3 attempts allowed for submission.
 */
export function canSubmitKyc(status: KycStatus, attemptCount: number): boolean {
  if (attemptCount >= KYC_LIMITS.MAX_ATTEMPTS) {
    return false;
  }
  return status === 'not_verified' || status === 'rejected' || status === 'reupload_required';
}
