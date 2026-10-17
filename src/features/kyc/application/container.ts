import { KycRepository } from '../domain/repository';
import { KycSupabaseRepository } from '../infrastructure/repository.supabase';

export const kycRepository: KycRepository = new KycSupabaseRepository();
