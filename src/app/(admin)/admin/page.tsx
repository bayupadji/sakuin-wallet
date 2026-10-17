import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/presentation/ui/button';
import { EmptyState } from '@/shared/presentation/ui/empty-state';
import { FileCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review customer verification submissions, handle disputes, and monitor traffic.
          </p>
        </div>

        <Link href="/admin/kyc">
          <Button variant="primary" className="gap-2">
            <FileCheck className="h-4 w-4" aria-hidden="true" />
            <span>Open KYC Queue</span>
          </Button>
        </Link>
      </div>

      {/* KYC Queue Status */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-teal-400" aria-hidden="true" />
            <span>Pending KYC Submissions</span>
          </h2>
          <span className="text-xs text-slate-400">Phase 1 Module</span>
        </div>

        <EmptyState
          title="No pending KYC submissions"
          description="All submitted ID cards have been reviewed. New submissions will appear here automatically."
          className="border-slate-800 bg-slate-900/40"
        />
      </div>
    </div>
  );
}
