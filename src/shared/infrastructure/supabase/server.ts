import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { config } from '@/shared/config';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const url = config.supabase.url;
  const key = config.supabase.publishableKey;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.'
    );
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

export function createAdminSupabaseClient() {
  const url = config.supabase.url;
  const key = config.supabase.serviceRoleKey;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase service role credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.'
    );
  }

  return createServerClient(url, key, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
}
