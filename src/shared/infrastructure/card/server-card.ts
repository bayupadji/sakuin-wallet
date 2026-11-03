export interface ServerCardRecord {
  id: string;
  userId: string;
  issuerCardRef: string;
  cardholderName: string;
  last4: string;
  expiry: string;
  issuingCountry: string;
  isFrozen: boolean;
  monthlyLimit: number;
  onlineTransactions: boolean;
  non3dsTransactions: boolean;
  atmWithdrawals: boolean;
}

const globalForCards = globalThis as unknown as {
  __sakuinServerCards?: Map<string, ServerCardRecord>;
};

const cardStore =
  globalForCards.__sakuinServerCards ??
  (globalForCards.__sakuinServerCards = new Map<string, ServerCardRecord>());

function deriveLast4(userId: string): string {
  let hash = 2166136261;
  for (let i = 0; i < userId.length; i++) {
    hash ^= userId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return String(1000 + ((hash >>> 0) % 9000));
}

export function getOrCreateFallbackCard(userId: string, fullName?: string): ServerCardRecord {
  const existing = cardStore.get(userId);
  if (existing) {
    return { ...existing };
  }
  const created: ServerCardRecord = {
    id: `card_${userId}`,
    userId,
    issuerCardRef: `uqpay_ref_${userId}`,
    cardholderName: fullName?.trim() || 'Nasabah Sakuin',
    last4: deriveLast4(userId),
    expiry: '08/29',
    issuingCountry: 'Singapura (MAS)',
    isFrozen: false,
    monthlyLimit: 2000,
    onlineTransactions: true,
    non3dsTransactions: true,
    atmWithdrawals: false,
  };
  cardStore.set(userId, created);
  return { ...created };
}

export function updateFallbackCard(
  userId: string,
  fullName: string | undefined,
  patch: Partial<
    Pick<
      ServerCardRecord,
      'isFrozen' | 'monthlyLimit' | 'onlineTransactions' | 'non3dsTransactions' | 'atmWithdrawals'
    >
  >
): ServerCardRecord {
  const current = getOrCreateFallbackCard(userId, fullName);
  const next: ServerCardRecord = {
    ...current,
    ...(typeof patch.isFrozen === 'boolean' ? { isFrozen: patch.isFrozen } : {}),
    ...(typeof patch.monthlyLimit === 'number' && patch.monthlyLimit >= 0
      ? { monthlyLimit: Math.round(patch.monthlyLimit) }
      : {}),
    ...(typeof patch.onlineTransactions === 'boolean'
      ? { onlineTransactions: patch.onlineTransactions }
      : {}),
    ...(typeof patch.non3dsTransactions === 'boolean'
      ? { non3dsTransactions: patch.non3dsTransactions }
      : {}),
    ...(typeof patch.atmWithdrawals === 'boolean' ? { atmWithdrawals: patch.atmWithdrawals } : {}),
  };
  cardStore.set(userId, next);
  return { ...next };
}

/**
 * Fetches ephemeral sensitive card credentials from the card issuer (UQPay) on demand.
 * Never persisted in database, logs, or client storage (AGENTS.md Section 8).
 */
export async function fetchEphemeralIssuerSecrets(
  issuerCardRef: string,
  last4: string
): Promise<{ cardNumberFormatted: string; cvv: string }> {
  const apiKey = process.env.UQPAY_API_KEY;
  const issuerBaseUrl = process.env.UQPAY_API_BASE_URL;

  if (apiKey && issuerBaseUrl) {
    const response = await fetch(
      `${issuerBaseUrl.replace(/\/$/, '')}/v1/issuing/cards/${encodeURIComponent(issuerCardRef)}/secure`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Gagal mengambil detail kartu dari mitra penerbit.');
    }

    const payload = (await response.json()) as { cardNumber?: string; cvv?: string };
    const digits = String(payload.cardNumber ?? '').replace(/\D/g, '');
    if (digits.length !== 16 || !payload.cvv) {
      throw new Error('Respons mitra penerbit kartu tidak valid.');
    }
    const formatted = `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)} ${digits.slice(12, 16)}`;
    return { cardNumberFormatted: formatted, cvv: String(payload.cvv) };
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('UQPAY_API_KEY belum dikonfigurasi di server.');
  }

  // shortcut: Ephemeral HMAC-derived sandbox digits when UQPay sandbox key is absent in local dev; upgrade when UQPAY_API_KEY is provisioned.
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(`sandbox-issuer:${issuerCardRef}:${last4}`)
  );
  const bytes = new Uint8Array(digest);
  const block2 = String(1000 + (((bytes[0] << 8) | bytes[1]) % 9000));
  const block3 = String(1000 + (((bytes[2] << 8) | bytes[3]) % 9000));
  const cvv = String(100 + (((bytes[4] << 8) | bytes[5]) % 900));

  return {
    cardNumberFormatted: `4532 ${block2} ${block3} ${last4}`,
    cvv,
  };
}

