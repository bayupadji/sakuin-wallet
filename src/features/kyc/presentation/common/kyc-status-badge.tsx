import React from 'react';
import { KycStatus } from '../../domain/entities/kyc-submission';
import { cn } from '@/shared/utils/cn';
import { AlertCircle, CheckCircle2, Clock, HelpCircle, XCircle } from 'lucide-react';
import { messages } from '@/shared/messages/en';

export interface KycStatusBadgeProps {
  status: KycStatus;
  className?: string;
}

export function KycStatusBadge({ status, className }: KycStatusBadgeProps) {
  const configs: Record<
    KycStatus,
    { label: string; icon: React.ComponentType<{ className?: string }>; classes: string }
  > = {
    approved: {
      label: messages.kyc.status.approved,
      icon: CheckCircle2,
      classes:
        'bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-800',
    },
    in_review: {
      label: messages.kyc.status.inReview,
      icon: Clock,
      classes:
        'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    },
    rejected: {
      label: messages.kyc.status.rejected,
      icon: XCircle,
      classes:
        'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800',
    },
    reupload_required: {
      label: messages.kyc.status.reuploadRequired,
      icon: AlertCircle,
      classes:
        'bg-orange-50 text-orange-900 border-orange-300 dark:bg-orange-950/70 dark:text-orange-300 dark:border-orange-800',
    },
    not_verified: {
      label: messages.kyc.status.notVerified,
      icon: HelpCircle,
      classes:
        'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    },
  };

  const current = configs[status] || configs.not_verified;
  const Icon = current.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold select-none',
        current.classes,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{current.label}</span>
    </span>
  );
}
