import { WalletRepository } from '../domain/repository';
import { WalletSupabaseRepository } from '../infrastructure/repository.supabase';

export const walletRepository: WalletRepository = new WalletSupabaseRepository();
