import { createClient } from '@/shared/infrastructure/supabase/client';
import { config } from '@/shared/config';
import { CardDetails } from '../domain/entities/card-details';
import { CardRepository, RevealedCardSecrets } from '../domain/repository';
import { SEED_CARD } from './seed';

export class CardSupabaseRepository implements CardRepository {
  private _client?: ReturnType<typeof createClient>;
  private instanceFallback: CardDetails;

  constructor(initialCard?: CardDetails) {
    this.instanceFallback = { ...(initialCard ?? SEED_CARD) };
  }

  private get client() {
    if (!this._client) {
      this._client = createClient();
    }
    return this._client;
  }

  async getCardDetails(userId?: string): Promise<CardDetails> {
    if (typeof window !== 'undefined') {
      const res = await fetch('/api/card');
      if (res.ok) {
        const payload = (await res.json()) as { card?: CardDetails };
        if (payload.card) {
          this.instanceFallback = { ...payload.card };
          return payload.card;
        }
      }
      return { ...this.instanceFallback };
    }

    if (!config.supabase.isConfigured) {
      return { ...this.instanceFallback };
    }

    try {
      const resolvedUserId = userId ?? (await this.client.auth.getUser()).data.user?.id;
      if (!resolvedUserId) return { ...this.instanceFallback };

      const { data, error } = await this.client
        .from('cards')
        .select(
          'id, cardholder_name, last4, expiry, issuing_country, is_frozen, monthly_limit_cents, online_transactions, non_3ds_transactions, atm_withdrawals'
        )
        .eq('user_id', resolvedUserId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          cardholderName: data.cardholder_name,
          last4: data.last4,
          expiry: data.expiry,
          issuingCountry: data.issuing_country,
          isFrozen: Boolean(data.is_frozen),
          monthlyLimit: Math.round(Number(data.monthly_limit_cents) / 100),
          onlineTransactions: Boolean(data.online_transactions),
          non3dsTransactions: Boolean(data.non_3ds_transactions),
          atmWithdrawals: Boolean(data.atm_withdrawals),
        };
      }
      return { ...this.instanceFallback };
    } catch {
      return { ...this.instanceFallback };
    }
  }

  async toggleFreezeCard(isFrozen: boolean): Promise<boolean> {
    const updated = await this.updateCardControls({ isFrozen });
    return updated.isFrozen;
  }

  async updateCardControls(controls: Partial<CardDetails>): Promise<CardDetails> {
    this.instanceFallback = { ...this.instanceFallback, ...controls };

    if (typeof window !== 'undefined') {
      const res = await fetch('/api/card', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(controls),
      });
      if (res.ok) {
        const payload = (await res.json()) as { card?: CardDetails };
        if (payload.card) {
          this.instanceFallback = { ...payload.card };
          return payload.card;
        }
      }
    }

    return { ...this.instanceFallback };
  }

  async revealCardDetails(password: string): Promise<RevealedCardSecrets> {
    if (!password || password.trim().length < 6) {
      throw new Error('Kata sandi tidak valid. Periksa kembali kata sandi akun Anda.');
    }

    if (typeof window !== 'undefined') {
      const res = await fetch('/api/card/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const payload = (await res.json()) as Partial<RevealedCardSecrets> & { error?: string };
      if (!res.ok || !payload.cardNumberFormatted || !payload.cvv) {
        throw new Error(
          payload.error || 'Kata sandi tidak valid. Periksa kembali kata sandi akun Anda.'
        );
      }
      return {
        cardNumberFormatted: payload.cardNumberFormatted,
        cvv: payload.cvv,
        expiresInSeconds: payload.expiresInSeconds ?? 30,
      };
    }

    throw new Error('Pembukaan detail kartu memerlukan sesi server aktif.');
  }
}
