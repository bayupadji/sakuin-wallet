import { createClient } from '@/shared/infrastructure/supabase/client';
import { config } from '@/shared/config';
import { User, UserRole } from '../domain/entities/user';
import {
  InvalidCredentialsError,
  RateLimitExceededError,
  UserAlreadyExistsError,
} from '../domain/errors';
import { AuthRepository, SignInParams, SignUpParams } from '../domain/repository';

export class AuthSupabaseRepository implements AuthRepository {
  private _client?: ReturnType<typeof createClient>;

  private get client() {
    if (!this._client) {
      this._client = createClient();
    }
    return this._client;
  }

  async signUp({ email, password, fullName }: SignUpParams): Promise<User> {
    if (!config.supabase.isConfigured) {
      return {
        id: `user-${Date.now()}`,
        email,
        fullName,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
    }

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
    let user: User;

    if (!config.supabase.isConfigured) {
      user = {
        id: 'user-01',
        email,
        fullName: 'Bayu Prasetya Adji Sugiyarto',
        role: email.includes('admin') ? 'super_admin' : 'customer',
        createdAt: '2026-10-15T00:00:00Z',
      };
    } else {
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

      user = this.mapSupabaseUser(data.user);
    }

    // Issue HMAC-signed session cookie with 30-min idle and 2-hour hard expiration
    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });
      } catch {
        // Fallback for offline or test environments
      }
    }

    return user;
  }

  async signOut(): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch {
        // Fallback
      }
    }

    if (config.supabase.isConfigured) {
      const { error } = await this.client.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    // 1. Check active HMAC session cookie first if running in browser
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.valid && data.user) {
            return {
              id: data.user.userId,
              email: data.user.email,
              fullName: data.user.fullName,
              role: data.user.role,
              createdAt: new Date(data.user.createdAt).toISOString(),
            };
          }
        }
      } catch {
        // Continue to Supabase fallback
      }
    }

    if (!config.supabase.isConfigured) return null;
    const { data, error } = await this.client.auth.getUser();
    if (error || !data.user) {
      return null;
    }
    return this.mapSupabaseUser(data.user);
  }

  private mapSupabaseUser(
    user: {
      id: string;
      email?: string;
      app_metadata?: Record<string, unknown>;
      user_metadata?: Record<string, unknown>;
      created_at: string;
    },
    fallbackFullName = ''
  ): User {
    // Prioritize app_metadata (server-only claims) over client-writable user_metadata
    const role =
      (user.app_metadata?.role as UserRole) ||
      (user.user_metadata?.role as UserRole) ||
      'customer';
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
