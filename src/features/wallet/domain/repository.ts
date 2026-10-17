import { Wallet } from './entities/wallet';

export interface WalletRepository {
  getWallet(userId?: string): Promise<Wallet | null>;
}
