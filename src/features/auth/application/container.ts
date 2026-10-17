import { AuthRepository } from '../domain/repository';
import { AuthSupabaseRepository } from '../infrastructure/repository.supabase';

export const authRepository: AuthRepository = new AuthSupabaseRepository();
