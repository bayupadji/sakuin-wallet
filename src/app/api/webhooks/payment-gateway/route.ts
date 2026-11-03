import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/shared/config';
import { createAdminSupabaseClient } from '@/shared/infrastructure/supabase/server';
import { verifyGatewayWebhookSignature } from '@/shared/domain/ledger';
import { getWebhookSecret, serverLedger } from '@/shared/infrastructure/ledger/server-ledger';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get('x-gateway-signature');
    const secret = getWebhookSecret();

    const isAuthentic = await verifyGatewayWebhookSignature(rawBody, signatureHeader, secret);
    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Invalid or missing gateway webhook signature.' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const transactionId = typeof payload?.transactionId === 'string' ? payload.transactionId : '';
    const webhookIdempotencyKey =
      typeof payload?.webhookIdempotencyKey === 'string' ? payload.webhookIdempotencyKey : '';
    const payerName = typeof payload?.payerName === 'string' ? payload.payerName : undefined;
    const paymentSource =
      typeof payload?.paymentSource === 'string' ? payload.paymentSource : undefined;

    if (!transactionId || !webhookIdempotencyKey) {
      return NextResponse.json(
        { error: 'transactionId and webhookIdempotencyKey are required.' },
        { status: 400 }
      );
    }

    if (config.supabase.isConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminSupabaseClient();
      const { data, error } = await admin.rpc('post_gateway_topup_settlement', {
        p_transaction_id: transactionId,
        p_webhook_idempotency_key: webhookIdempotencyKey,
        p_payer_name: payerName ?? null,
        p_payment_source: paymentSource ?? null,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 422 });
      }

      return NextResponse.json({ settled: true, result: data });
    }

    const settled = serverLedger.settlePendingOrder({
      transactionId,
      webhookIdempotencyKey,
      payerName,
      paymentSource,
    });

    return NextResponse.json({
      settled: true,
      alreadySettled: settled.alreadySettled,
      ledgerSequence: settled.transaction.ledgerSequence,
      balanceCents: settled.balanceCents.toString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed.';
    return NextResponse.json({ error: message }, { status: 422 });
  }
}

