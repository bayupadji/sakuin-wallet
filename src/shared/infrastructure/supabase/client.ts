import { createBrowserClient } from '@supabase/ssr';
import { config } from '@/shared/config';

export function createClient() {
  const url = config.supabase.url || 'https://placeholder-project.supabase.co';
  const key =
    config.supabase.publishableKey ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.signature';
  return createBrowserClient(url, key);
}
