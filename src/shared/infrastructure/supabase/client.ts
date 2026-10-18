import { createBrowserClient } from '@supabase/ssr';
import { config } from '@/shared/config';

export function createClient() {
  const url = config.supabase.url;
  const key = config.supabase.publishableKey;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.'
    );
  }

  return createBrowserClient(url, key);
}
