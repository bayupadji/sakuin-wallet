import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/shared/config';
import {
  SESSION_COOKIE_NAME,
  verifySessionCookie,
} from '@/shared/infrastructure/auth/session';
import { createAdminSupabaseClient } from '@/shared/infrastructure/supabase/server';

const ALLOWED_DECISIONS = new Set(['approved', 'rejected', 'reupload_required']);

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionCookie(cookie);

    if (!session.valid) {
      return NextResponse.json({ error: 'Sesi tidak valid.' }, { status: 401 });
    }

    const reviewerRole = session.payload.role;
    if (reviewerRole !== 'super_admin' && reviewerRole !== 'kyc_reviewer') {
      return NextResponse.json(
        { error: 'Akses ditolak: hanya petugas kepatuhan yang dapat meninjau KTP.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const submissionId = typeof body?.submissionId === 'string' ? body.submissionId : '';
    const decision = typeof body?.decision === 'string' ? body.decision : '';
    const reason = typeof body?.reason === 'string' ? body.reason.trim() : '';

    if (!submissionId || !ALLOWED_DECISIONS.has(decision)) {
      return NextResponse.json({ error: 'Parameter keputusan peninjauan tidak valid.' }, { status: 400 });
    }

    if ((decision === 'rejected' || decision === 'reupload_required') && !reason) {
      return NextResponse.json(
        { error: 'Alasan penolakan atau permintaan unggah ulang wajib diisi.' },
        { status: 400 }
      );
    }

    const reviewedAt = new Date().toISOString();

    if (config.supabase.isConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminSupabaseClient();

      const { data: beforeRow } = await admin
        .from('kyc_submissions')
        .select('id, status, user_id')
        .eq('id', submissionId)
        .maybeSingle();

      const { error } = await admin
        .from('kyc_submissions')
        .update({
          status: decision,
          rejection_reason: reason || null,
          reviewed_by: session.payload.userId,
          reviewed_at: reviewedAt,
          updated_at: reviewedAt,
        })
        .eq('id', submissionId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      await admin.from('audit_logs').insert({
        actor_id: session.payload.userId,
        action: `KYC_${decision.toUpperCase()}`,
        entity: 'kyc_submission',
        entity_id: submissionId,
        before_state: { status: beforeRow?.status ?? 'in_review' },
        after_state: { status: decision, has_reason: Boolean(reason) },
      });
    }

    return NextResponse.json({ success: true, reviewedAt });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menyimpan hasil peninjauan KYC.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

