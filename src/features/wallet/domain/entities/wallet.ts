import { Money } from '@/shared/domain/money';

export interface Wallet {
  id: string;
  userId: string;
  balance: Money;
  isFrozen: boolean;
  updatedAt: string;
}
