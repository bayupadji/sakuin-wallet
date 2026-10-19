import { createClient } from '@/shared/infrastructure/supabase/client';
import { config } from '@/shared/config';
import { KycSubmission, KycStatus } from '../domain/entities/kyc-submission';
import { KycRepository, ReviewKycParams, SubmitKycParams } from '../domain/repository';
import { KycMaxAttemptsExceededError, KycSubmissionError } from '../domain/errors';
import { maskNik, validateIdCardFile, validateNik } from '../domain/rules/kyc-rules';
import { SEED_KYC_SUBMISSION, SEED_KYC_QUEUE } from './seed';

interface KycRow {
  id: string;
  user_id: string;
  nik_encrypted: string;
  id_card_photo_url: string;
  status: KycStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  attempt_count: number;
  created_at: string;
}

let inMemoryKyc: KycSubmission | null = { ...SEED_KYC_SUBMISSION };
let inMemoryPendingList: KycSubmission[] = [...SEED_KYC_QUEUE];

export class KycSupabaseRepository implements KycRepository {
  private _client?: ReturnType<typeof createClient>;

  private get client() {
    if (!this._client) {
      this._client = createClient();
    }
    return this._client;
  }

  async getLatestSubmission(userId?: string): Promise<KycSubmission | null> {
    if (!config.supabase.isConfigured) {
      return inMemoryKyc;
    }

    let query = this.client
      .from('kyc_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return inMemoryKyc;
    }

    return this.mapRowToEntity(data[0] as KycRow);
  }

  async submitKyc({ nik, photoFile }: SubmitKycParams): Promise<KycSubmission> {
    // 1. Client-side rules check
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

    // 2. Auth check
    let userId = 'user-01';
    if (config.supabase.isConfigured) {
      const { data: authData } = await this.client.auth.getUser();
      if (!authData.user) {
        throw new KycSubmissionError('User must be signed in to submit KYC.');
      }
      userId = authData.user.id;
    }

    // 3. Attempt check
    const latest = await this.getLatestSubmission(userId);
    const nextAttempt = latest ? latest.attemptCount + 1 : 1;
    if (nextAttempt > 3) {
      throw new KycMaxAttemptsExceededError();
    }

    if (!config.supabase.isConfigured) {
      const newSubmission: KycSubmission = {
        id: `kyc-${Date.now()}`,
        userId,
        nikMasked: maskNik(nik),
        idCardPhotoUrl: '/demo/ktp-sample.jpg',
        status: 'in_review',
        attemptCount: nextAttempt,
        createdAt: new Date().toISOString(),
      };
      inMemoryKyc = newSubmission;
      inMemoryPendingList = [newSubmission, ...inMemoryPendingList];
      return newSubmission;
    }

    // 4. Upload photo to private storage bucket 'kyc-documents'
    const ext = photoFile.name.split('.').pop() || 'jpg';
    const filePath = `${userId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await this.client.storage
      .from('kyc-documents')
      .upload(filePath, photoFile, {
        upsert: false,
      });

    if (uploadError) {
      console.warn('Storage upload fallback:', uploadError.message);
    }

    // 5. Insert record (Store masked NIK on client side; full encryption handled server-side)
    const { data, error } = await this.client
      .from('kyc_submissions')
      .insert({
        user_id: userId,
        nik_encrypted: maskNik(nik),
        id_card_photo_url: filePath,
        status: 'in_review',
        attempt_count: nextAttempt,
      })
      .select()
      .single();

    if (error) {
      throw new KycSubmissionError(error.message);
    }

    return this.mapRowToEntity(data as KycRow);
  }

  async getPendingSubmissions(): Promise<KycSubmission[]> {
    if (!config.supabase.isConfigured) {
      return inMemoryPendingList.filter((s) => s.status === 'in_review');
    }

    const { data, error } = await this.client
      .from('kyc_submissions')
      .select('*')
      .eq('status', 'in_review')
      .order('created_at', { ascending: true });

    if (error || !data) {
      return inMemoryPendingList.filter((s) => s.status === 'in_review');
    }

    return data.map((row) => this.mapRowToEntity(row as KycRow));
  }

  async reviewSubmission({ submissionId, decision, reason }: ReviewKycParams): Promise<void> {
    if (!config.supabase.isConfigured) {
      inMemoryPendingList = inMemoryPendingList.map((item) =>
        item.id === submissionId
          ? {
              ...item,
              status: decision,
              rejectionReason: reason || undefined,
              reviewedAt: new Date().toISOString(),
            }
          : item
      );
      if (inMemoryKyc && inMemoryKyc.id === submissionId) {
        inMemoryKyc.status = decision;
        inMemoryKyc.rejectionReason = reason || undefined;
      }
      return;
    }

    const { data: authData } = await this.client.auth.getUser();
    const reviewerId = authData.user?.id;

    const { error } = await this.client
      .from('kyc_submissions')
      .update({
        status: decision,
        rejection_reason: reason || null,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    if (error) {
      throw new Error(error.message);
    }
  }

  private mapRowToEntity(row: KycRow): KycSubmission {
    return {
      id: row.id,
      userId: row.user_id,
      nikMasked: maskNik(row.nik_encrypted),
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
