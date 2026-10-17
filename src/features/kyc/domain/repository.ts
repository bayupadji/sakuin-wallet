import { KycStatus, KycSubmission } from './entities/kyc-submission';

export interface SubmitKycParams {
  nik: string;
  photoFile: File;
}

export interface ReviewKycParams {
  submissionId: string;
  decision: Extract<KycStatus, 'approved' | 'rejected' | 'reupload_required'>;
  reason?: string;
}

export interface KycRepository {
  getLatestSubmission(userId?: string): Promise<KycSubmission | null>;
  submitKyc(params: SubmitKycParams): Promise<KycSubmission>;
  getPendingSubmissions(): Promise<KycSubmission[]>;
  reviewSubmission(params: ReviewKycParams): Promise<void>;
}
