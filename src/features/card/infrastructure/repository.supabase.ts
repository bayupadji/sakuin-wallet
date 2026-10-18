import { createClient } from '@/shared/infrastructure/supabase/client';
import { config } from '@/shared/config';
import { CardDetails } from '../domain/entities/card-details';
import { CardRepository } from '../domain/repository';

let inMemoryCard: CardDetails = {
  id: 'card_virt_01',
  cardholderName: 'Bayu Prasetya Adji Sugiyarto',
  last4: '4821',
  expiry: '08/29',
  issuingCountry: 'Singapura (MAS)',
  isFrozen: false,
  monthlyLimit: 2000,
  onlineTransactions: true,
  non3dsTransactions: true,
  atmWithdrawals: false,
};

export class CardSupabaseRepository implements CardRepository {
  private client = createClient();

  async getCardDetails(): Promise<CardDetails> {
    if (!config.supabase.url) {
      return inMemoryCard;
    }
    try {
      const { data, error } = await this.client.from('wallets').select('is_frozen').limit(1);
      if (!error && data && data.length > 0) {
        return {
          ...inMemoryCard,
          isFrozen: data[0].is_frozen ?? inMemoryCard.isFrozen,
        };
      }
      return inMemoryCard;
    } catch {
      return inMemoryCard;
    }
  }

  async toggleFreezeCard(isFrozen: boolean): Promise<boolean> {
    inMemoryCard = { ...inMemoryCard, isFrozen };
    if (!config.supabase.url) {
      return isFrozen;
    }
    try {
      await this.client.from('wallets').update({ is_frozen: isFrozen }).neq('id', '');
    } catch {
      // Continue offline fallback
    }
    return isFrozen;
  }

  async updateCardControls(controls: Partial<CardDetails>): Promise<CardDetails> {
    inMemoryCard = { ...inMemoryCard, ...controls };
    return inMemoryCard;
  }
}
