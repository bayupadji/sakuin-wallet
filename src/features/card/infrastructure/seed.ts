import { CardDetails } from '../domain/entities/card-details';

export const SEED_CARD: CardDetails = {
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
