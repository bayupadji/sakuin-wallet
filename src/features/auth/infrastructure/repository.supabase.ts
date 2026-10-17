import { createClient } from '@/shared/infrastructure/supabase/client';
import { User, UserRole } from '../domain/entities/user';
import {
  InvalidCredentialsError,
  RateLimitExceededError,
  UserAlreadyExistsError,
} from '../domain/errors';
import { AuthRepository, SignInParams, SignUpParams } from '../domain/repository';

export class AuthSupabaseRepository implements AuthRepository {
  private client = createClient();

  async signUp({ email, password, fullName }: SignUpParams): Promise<User> {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'customer',
        },
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        throw new UserAlreadyExistsError();
      }
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Sign up failed: no user returned.');
    }

    return this.mapSupabaseUser(data.user, fullName);
  }

  async signIn({ email, password }: SignInParams): Promise<User> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.status === 429 || error.message.toLowerCase().includes('rate limit')) {
        throw new RateLimitExceededError();
      }
      if (
        error.message.toLowerCase().includes('invalid login credentials') ||
        error.message.toLowerCase().includes('invalid credentials')
      ) {
        throw new InvalidCredentialsError();
      }
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new InvalidCredentialsError();
    }

    return this.mapSupabaseUser(data.user);
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.client.auth.getUser();
    if (error || !data.user) {
      return null;
    }
    return this.mapSupabaseUser(data.user);
  }

  private mapSupabaseUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at: string }, fallbackFullName = ''): User {
    const role = (user.user_metadata?.role as UserRole) || 'customer';
    const fullName = (user.user_metadata?.full_name as string) || fallbackFullName;

    return {
      id: user.id,
      email: user.email || '',
      fullName,
      role,
      createdAt: user.created_at,
    };
  }
}
