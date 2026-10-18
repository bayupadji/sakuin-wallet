import { TransactionRepository } from '../domain/repository';
import { TransactionSupabaseRepository } from '../infrastructure/repository.supabase';

export const transactionRepository: TransactionRepository = new TransactionSupabaseRepository();
