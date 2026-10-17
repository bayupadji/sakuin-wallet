import { createBrowserClient } from '@supabase/ssr';
import { config } from '@/shared/config';

export function createClient() {
  return createBrowserClient(config.supabase.url, config.supabase.publishableKey);
}
