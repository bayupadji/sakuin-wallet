export type KycStatus =
  | 'not_verified'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'reupload_required';

export interface KycSubmission {
  id: string;
  userId: string;
  nikMasked: string;
  idCardPhotoUrl: string;
  status: KycStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  attemptCount: number;
  createdAt: string;
}
