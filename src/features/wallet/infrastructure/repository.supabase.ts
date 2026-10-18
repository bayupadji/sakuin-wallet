import { createClient } from '@/shared/infrastructure/supabase/client';
import { config } from '@/shared/config';
import { Money } from '@/shared/domain/money';
import { Wallet } from '../domain/entities/wallet';
import { WalletRepository } from '../domain/repository';

interface WalletRow {
  id: string;
  user_id: string;
  balance_cents: number | string | bigint;
  currency: string;
  is_frozen: boolean;
  updated_at: string;
}

export class WalletSupabaseRepository implements WalletRepository {
  private _client?: ReturnType<typeof createClient>;

  private get client() {
    if (!this._client) {
      this._client = createClient();
    }
    return this._client;
  }

  async getWallet(userId?: string): Promise<Wallet | null> {
    if (!config.supabase.isConfigured) {
      return null;
    }

    let targetUserId = userId;
    if (!targetUserId) {
      const { data: authData } = await this.client.auth.getUser();
      targetUserId = authData.user?.id;
    }

    if (!targetUserId) {
      return null;
    }

    const { data, error } = await this.client
      .from('wallets')
      .select('*')
      .eq('user_id', targetUserId)
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }

    const row = data[0] as WalletRow;
    const centsBigInt = BigInt(row.balance_cents);

    return {
      id: row.id,
      userId: row.user_id,
      balance: Money.fromCents(centsBigInt, 'USD'),
      isFrozen: row.is_frozen,
      updatedAt: row.updated_at,
    };
  }
}
