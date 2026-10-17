import { createClient } from '@/shared/infrastructure/supabase/client';
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
  private client = createClient();

  async getWallet(userId?: string): Promise<Wallet | null> {
    let query = this.client.from('wallets').select('*').limit(1);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
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
