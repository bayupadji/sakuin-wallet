import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/shared/config';
import {
  SESSION_COOKIE_NAME,
  verifySessionCookie,
} from '@/shared/infrastructure/auth/session';
import { createAdminSupabaseClient } from '@/shared/infrastructure/supabase/server';
import { maskNik, validateNik } from '@/features/kyc/domain/rules/kyc-rules';
import { encryptNik, hashNik } from '@/features/kyc/infrastructure/nik-crypto';

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionCookie(cookie);

    if (!session.valid) {
      return NextResponse.json({ error: 'Sesi tidak valid. Silakan masuk kembali.' }, { status: 401 });
    }

    const body = await request.json();
    const rawNik = typeof body?.nik === 'string' ? body.nik : '';
    const photoPath = typeof body?.photoPath === 'string' ? body.photoPath : '';

    const nikValidation = validateNik(rawNik);
    if (!nikValidation.valid) {
      return NextResponse.json({ error: nikValidation.error }, { status: 400 });
    }

    if (!photoPath) {
      return NextResponse.json({ error: 'Lokasi dokumen KTP wajib disertakan.' }, { status: 400 });
    }

    const nikEncrypted = await encryptNik(rawNik);
    const nikHash = await hashNik(rawNik);
    const nikMasked = maskNik(rawNik);
    const userId = session.payload.userId;

    if (config.supabase.isConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminSupabaseClient();

      // Enforce 1 NIK per account
      const { data: duplicateNik } = await admin
        .from('kyc_submissions')
        .select('id, user_id')
        .eq('nik_hash', nikHash)
        .in('status', ['in_review', 'approved'])
        .neq('user_id', userId)
        .limit(1);

      if (duplicateNik && duplicateNik.length > 0) {
        return NextResponse.json(
          { error: 'NIK sudah terdaftar pada akun lain. Satu KTP hanya berlaku untuk satu akun.' },
          { status: 409 }
        );
      }

      const { count } = await admin
        .from('kyc_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      const nextAttempt = (count || 0) + 1;
      if (nextAttempt > 3) {
        return NextResponse.json(
          { error: 'Batas maksimum pengajuan verifikasi KTP (3 kali) telah tercapai.' },
          { status: 422 }
        );
      }

      const { data, error } = await admin
        .from('kyc_submissions')
        .insert({
          user_id: userId,
          nik_encrypted: nikEncrypted,
          nik_masked: nikMasked,
          nik_hash: nikHash,
          id_card_photo_url: photoPath,
          status: 'in_review',
          attempt_count: nextAttempt,
        })
        .select('id, user_id, nik_masked, status, attempt_count, created_at')
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: error?.message || 'Gagal menyimpan pengajuan KYC.' },
          { status: 500 }
        );
      }

      await admin.from('audit_logs').insert({
        actor_id: userId,
        action: 'KYC_SUBMITTED',
        entity: 'kyc_submission',
        entity_id: data.id,
        after_state: { status: 'in_review', attempt_count: nextAttempt },
      });

      return NextResponse.json({
        submission: {
          id: data.id,
          userId: data.user_id,
          nikMasked: data.nik_masked || nikMasked,
          idCardPhotoUrl: photoPath,
          status: data.status,
          attemptCount: data.attempt_count,
          createdAt: data.created_at,
        },
      });
    }

    return NextResponse.json({
      submission: {
        id: `kyc-${Date.now()}`,
        userId,
        nikMasked,
        idCardPhotoUrl: photoPath,
        status: 'in_review',
        attemptCount: 1,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memproses pengajuan KYC.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

