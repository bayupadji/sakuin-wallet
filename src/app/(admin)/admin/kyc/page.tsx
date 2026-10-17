import React from 'react';
import { KycReviewQueue } from '@/features/kyc';

export const metadata = {
  title: 'KYC Review Queue | Admin Console',
  description: 'Review pending customer identity verification submissions.',
};

export default function AdminKycPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          KYC Review Queue
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Review uploaded KTP ID card photos and approve, reject, or request re-upload with compliance notes.
        </p>
      </div>

      <KycReviewQueue />
    </div>
  );
}
