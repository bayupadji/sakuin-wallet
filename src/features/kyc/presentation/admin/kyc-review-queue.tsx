'use client';

import React, { useState } from 'react';
import { usePendingKycQueue } from '../../application/queries/use-kyc-status';
import { useReviewKycMutation } from '../../application/mutations/use-kyc-mutations';
import { KycSubmission } from '../../domain/entities/kyc-submission';
import { KycStatusBadge } from '../common/kyc-status-badge';
import { Button } from '@/shared/presentation/ui/button';
import { Dialog } from '@/shared/presentation/ui/dialog';
import { EmptyState } from '@/shared/presentation/ui/empty-state';
import { Skeleton } from '@/shared/presentation/ui/skeleton';
import {
  Check,
  CheckCircle2,
  Eye,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react';

export function KycReviewQueue() {
  const { data: queue, isLoading, isError, refetch } = usePendingKycQueue();
  const reviewMutation = useReviewKycMutation();

  const [activeItem, setActiveItem] = useState<KycSubmission | null>(null);
  const [modalType, setModalType] = useState<'inspect' | 'approve' | 'reject' | 'reupload' | null>(null);
  const [reason, setReason] = useState('');

  function handleOpenModal(item: KycSubmission, type: 'inspect' | 'approve' | 'reject' | 'reupload') {
    setActiveItem(item);
    setModalType(type);
    setReason('');
  }

  function handleCloseModal() {
    setActiveItem(null);
    setModalType(null);
    setReason('');
  }

  async function handleConfirmReview() {
    if (!activeItem || !modalType || modalType === 'inspect') return;

    const decision =
      modalType === 'approve'
        ? 'approved'
        : modalType === 'reject'
        ? 'rejected'
        : 'reupload_required';

    await reviewMutation.mutateAsync({
      submissionId: activeItem.id,
      decision,
      reason: reason.trim() || undefined,
    });

    handleCloseModal();
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-800 bg-rose-950/40 p-6 text-center">
        <p className="text-sm font-semibold text-rose-300">
          Failed to load pending KYC submissions.
        </p>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!queue || queue.length === 0) {
    return (
      <EmptyState
        title="No pending KYC submissions"
        description="All submitted ID card photos have been reviewed. New submissions will appear here automatically."
        className="border-slate-800 bg-slate-950 text-white"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xs">
        {queue.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-slate-900/50 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-white tracking-wider">
                  {item.nikMasked}
                </span>
                <KycStatusBadge status={item.status} />
              </div>
              <p className="text-xs text-slate-400">
                User ID: <span className="font-mono">{item.userId}</span> &bull; Attempt #{item.attemptCount} &bull; Submitted{' '}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleOpenModal(item, 'inspect')}
                className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 cursor-pointer pt-1"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Inspect KTP ID Card Photo</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenModal(item, 'approve')}
                className="gap-1 border-teal-700 text-teal-300 hover:bg-teal-950 font-medium"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Approve</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenModal(item, 'reupload')}
                className="gap-1 border-amber-700 text-amber-300 hover:bg-amber-950 font-medium"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Request Re-upload</span>
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => handleOpenModal(item, 'reject')}
                className="gap-1 font-medium"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reject</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Document Modal */}
      {modalType === 'inspect' && activeItem && (
        <Dialog
          isOpen={true}
          onClose={handleCloseModal}
          title={`Document Inspection: ${activeItem.nikMasked}`}
          description="Review Indonesian KTP photo for 4 visible corners, legibility of 16-digit NIK, photo clarity, and absence of glare."
        >
          <div className="space-y-4 pt-2">
            {/* Simulated KTP Document Visual */}
            <div className="relative aspect-[1.586/1] w-full rounded-2xl border-2 border-dashed border-teal-800/80 bg-slate-900 p-6 flex flex-col justify-between overflow-hidden text-slate-200">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="font-bold text-xs tracking-widest uppercase text-white block">
                    REPUBLIK INDONESIA
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono tracking-wider">
                    KARTU TANDA PENDUDUK
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-teal-950 px-2 py-0.5 text-[10px] text-teal-400 border border-teal-800">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Quality: High Clarity</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-2 space-y-1 text-xs">
                  <p className="font-mono text-sm font-bold text-white tracking-wider">
                    NIK: {activeItem.nikMasked}
                  </p>
                  <p className="text-[11px] text-slate-300">Nama: BUDI SANTOSO</p>
                  <p className="text-[11px] text-slate-400">Tempat/Tgl Lahir: JAKARTA, 12-05-1994</p>
                  <p className="text-[11px] text-slate-400">Alamat: JL. JEND SUDIRMAN KAV 21</p>
                </div>
                <div className="flex flex-col items-center justify-center h-24 rounded-xl border border-slate-800 bg-slate-850 p-2 text-center text-[10px] text-slate-400">
                  <span>Photo ID Valid</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 text-[10px] text-slate-500 font-mono flex justify-between">
                <span>BERLAKU HINGGA: SEUMUR HIDUP</span>
                <span>Audit Ref: {activeItem.id.slice(0, 12)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <Button variant="ghost" onClick={handleCloseModal}>
                Close
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setModalType('reupload')}
                  className="border-amber-700 text-amber-300"
                >
                  Request Re-upload
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setModalType('approve')}
                >
                  Proceed to Approve
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Confirmation & Reason Dialog */}
      {modalType && modalType !== 'inspect' && activeItem && (
        <Dialog
          isOpen={true}
          onClose={handleCloseModal}
          title={
            modalType === 'approve'
              ? 'Approve KYC Submission'
              : modalType === 'reject'
              ? 'Reject KYC Submission'
              : 'Request KYC Re-upload'
          }
          description={
            modalType === 'approve'
              ? `Confirm approving NIK ${activeItem.nikMasked}. This unlocks USD balance deposits and virtual card requests.`
              : `Provide clear reviewer notes explaining why this submission is ${modalType === 'reject' ? 'rejected' : 'requiring a re-upload'}.`
          }
        >
          <div className="space-y-4">
            {modalType !== 'approve' && (
              <div>
                <label
                  htmlFor="review-notes"
                  className="block text-sm font-medium text-slate-200"
                >
                  Review Notes / Reason
                </label>
                <textarea
                  id="review-notes"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Photo is blurry, corners of KTP are cut off..."
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant={modalType === 'reject' ? 'danger' : 'primary'}
                onClick={handleConfirmReview}
                isLoading={reviewMutation.isPending}
              >
                {modalType === 'approve' ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>Confirm Approval</span>
                  </span>
                ) : (
                  'Submit Decision'
                )}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
