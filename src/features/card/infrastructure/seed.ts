import { CardDetails } from '../domain/entities/card-details';

export const SEED_CARD: CardDetails = {
  id: 'card_virt_01',
  cardholderName: 'Nasabah Sakuin',
  last4: '4821',
  expiry: '08/29',
  issuingCountry: 'Singapura (MAS)',
  isFrozen: false,
  monthlyLimit: 2000,
  onlineTransactions: true,
  non3dsTransactions: true,
  atmWithdrawals: false,
};

export function createDefaultCardForUser(userId: string, fullName?: string): CardDetails {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  const last4 = String(1000 + (hash % 9000));
  return {
    ...SEED_CARD,
    id: `card_${userId}`,
    cardholderName: fullName?.trim() || SEED_CARD.cardholderName,
    last4,
  };
}
