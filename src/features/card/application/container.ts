import { CardRepository } from '../domain/repository';
import { CardSupabaseRepository } from '../infrastructure/repository.supabase';

export const cardRepository: CardRepository = new CardSupabaseRepository();
