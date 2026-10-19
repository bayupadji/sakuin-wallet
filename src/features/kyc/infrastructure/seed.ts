import { KycSubmission } from '../domain/entities/kyc-submission';

export const SEED_KYC_SUBMISSION: KycSubmission = {
  id: 'kyc-demo-01',
  userId: 'user-01',
  nikMasked: '317101******0002',
  idCardPhotoUrl: '/demo/ktp-sample.jpg',
  status: 'approved',
  attemptCount: 1,
  createdAt: '2026-10-15T08:00:00Z',
};

export const SEED_KYC_QUEUE: KycSubmission[] = [
  {
    id: 'kyc-queue-01',
    userId: 'user-pend-01',
    nikMasked: '317101******0008',
    idCardPhotoUrl: '/demo/ktp-sample-2.jpg',
    status: 'in_review',
    attemptCount: 1,
    createdAt: '2026-10-18T00:30:00Z',
  },
  {
    id: 'kyc-queue-02',
    userId: 'user-pend-02',
    nikMasked: '320104******0019',
    idCardPhotoUrl: '/demo/ktp-sample-3.jpg',
    status: 'in_review',
    attemptCount: 2,
    createdAt: '2026-10-18T00:45:00Z',
  },
];
