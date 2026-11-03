import { createClient } from '@/shared/infrastructure/supabase/client';
import { config } from '@/shared/config';
import { KycSubmission, KycStatus } from '../domain/entities/kyc-submission';
import { KycRepository, ReviewKycParams, SubmitKycParams } from '../domain/repository';
import { KycMaxAttemptsExceededError, KycSubmissionError } from '../domain/errors';
import { maskNik, validateIdCardFile, validateNik } from '../domain/rules/kyc-rules';
import { SEED_KYC_QUEUE } from './seed';

interface KycRow {
  id: string;
  user_id: string;
  nik_encrypted: string;
  nik_masked?: string | null;
  id_card_photo_url: string;
  status: KycStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  attempt_count: number;
  created_at: string;
}

const offlineSubmissionsByUser = new Map<string, KycSubmission>();
let offlineReviewQueue: KycSubmission[] = [...SEED_KYC_QUEUE];

export class KycSupabaseRepository implements KycRepository {
  private _client?: ReturnType<typeof createClient>;

  private get client() {
    if (!this._client) {
      this._client = createClient();
    }
    return this._client;
  }

  private async resolveCurrentUserId(): Promise<string | null> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data?.valid && data?.user?.userId) {
            return data.user.userId as string;
          }
        }
      } catch {
        // Fallback to Supabase Auth
      }
    }

    if (config.supabase.isConfigured) {
      const { data: authData } = await this.client.auth.getUser();
      return authData.user?.id ?? null;
    }

    return null;
  }

  async getLatestSubmission(userId?: string): Promise<KycSubmission | null> {
    const targetUserId = userId || (await this.resolveCurrentUserId());
    if (!targetUserId) {
      return null;
    }

    if (!config.supabase.isConfigured) {
      return offlineSubmissionsByUser.get(targetUserId) ?? null;
    }

    const { data, error } = await this.client
      .from('kyc_submissions')
      .select('id, user_id, nik_encrypted, nik_masked, id_card_photo_url, status, rejection_reason, reviewed_by, reviewed_at, attempt_count, created_at')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }

    return this.mapRowToEntity(data[0] as KycRow);
  }

  async submitKyc({ nik, photoFile }: SubmitKycParams): Promise<KycSubmission> {
    const nikValidation = validateNik(nik);
    if (!nikValidation.valid) {
      throw new KycSubmissionError(nikValidation.error);
    }

    const fileValidation = validateIdCardFile({
      size: photoFile.size,
      type: photoFile.type,
    });
    if (!fileValidation.valid) {
      throw new KycSubmissionError(fileValidation.error);
    }

    const userId = await this.resolveCurrentUserId();
    if (!userId) {
      throw new KycSubmissionError('Sesi berakhir. Silakan masuk terlebih dahulu untuk mengunggah KTP.');
    }

    const latest = await this.getLatestSubmission(userId);
    const nextAttempt = latest ? latest.attemptCount + 1 : 1;
    if (nextAttempt > 3) {
      throw new KycMaxAttemptsExceededError();
    }

    let photoPath = `private/${userId}/${Date.now()}.jpg`;
    if (config.supabase.isConfigured) {
      const ext = photoFile.name.split('.').pop() || 'jpg';
      photoPath = `${userId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await this.client.storage
        .from('kyc-documents')
        .upload(photoPath, photoFile, {
          upsert: false,
        });

      if (uploadError) {
        throw new KycSubmissionError(`Gagal mengunggah foto KTP: ${uploadError.message}`);
      }
    }

    const response = await fetch('/api/kyc/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nik, photoPath }),
    });

    const payload = await response.json();
    if (!response.ok) {
      if (response.status === 422) {
        throw new KycMaxAttemptsExceededError();
      }
      throw new KycSubmissionError(payload?.error || 'Gagal menyimpan pengajuan KYC.');
    }

    const submission: KycSubmission = {
      ...payload.submission,
      attemptCount: payload.submission.attemptCount ?? nextAttempt,
    };

    if (!config.supabase.isConfigured) {
      offlineSubmissionsByUser.set(userId, submission);
      offlineReviewQueue = [submission, ...offlineReviewQueue];
    }

    return submission;
  }

  async getPendingSubmissions(): Promise<KycSubmission[]> {
    if (!config.supabase.isConfigured) {
      return offlineReviewQueue.filter((s) => s.status === 'in_review');
    }

    const { data, error } = await this.client
      .from('kyc_submissions')
      .select('id, user_id, nik_encrypted, nik_masked, id_card_photo_url, status, rejection_reason, reviewed_by, reviewed_at, attempt_count, created_at')
      .eq('status', 'in_review')
      .order('created_at', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map((row) => this.mapRowToEntity(row as KycRow));
  }

  async reviewSubmission({ submissionId, decision, reason }: ReviewKycParams): Promise<void> {
    const response = await fetch('/api/kyc/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId, decision, reason }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.error || 'Gagal menyimpan keputusan peninjauan KYC.');
    }

    if (!config.supabase.isConfigured) {
      const reviewedAt = new Date().toISOString();
      offlineReviewQueue = offlineReviewQueue.map((item) => {
        if (item.id !== submissionId) return item;
        const updated: KycSubmission = {
          ...item,
          status: decision,
          rejectionReason: reason || undefined,
          reviewedAt,
        };
        offlineSubmissionsByUser.set(item.userId, updated);
        return updated;
      });
    }
  }

  private mapRowToEntity(row: KycRow): KycSubmission {
    const safeMasked =
      row.nik_masked ||
      (row.nik_encrypted.startsWith('v1:') ? '****************' : maskNik(row.nik_encrypted));

    return {
      id: row.id,
      userId: row.user_id,
      nikMasked: safeMasked,
      idCardPhotoUrl: row.id_card_photo_url,
      status: row.status,
      rejectionReason: row.rejection_reason,
      reviewedBy: row.reviewed_by,
      reviewedAt: row.reviewed_at,
      attemptCount: row.attempt_count,
      createdAt: row.created_at,
    };
  }
}
