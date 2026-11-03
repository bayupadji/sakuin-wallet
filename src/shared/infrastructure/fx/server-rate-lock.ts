import { config } from '@/shared/config';
import { createAdminSupabaseClient } from '@/shared/infrastructure/supabase/server';
import { fetchWiseRate, FxConversionResult } from './wise';

let cachedServerRate: FxConversionResult | null = null;

export async function getOrLockServerFxRate(now: number = Date.now()): Promise<FxConversionResult> {
  if (config.supabase.isConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminSupabaseClient();
    const { data: existing } = await admin
      .from('fx_rates')
      .select('*')
      .eq('base_currency', 'USD')
      .eq('target_currency', 'IDR')
      .gt('locked_until', new Date(now).toISOString())
      .order('locked_until', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      const rateNum = Number(existing.rate);
      const fetchedAtMs = new Date(existing.fetched_at).getTime();
      const lockedUntilMs = new Date(existing.locked_until).getTime();
      return {
        rate: rateNum,
        inverseRate: 1 / rateNum,
        date: new Date(fetchedAtMs).toISOString().slice(0, 10),
        base: 'USD',
        target: 'IDR',
        source: 'wise',
        fetchedAt: fetchedAtMs,
        lockedUntil: lockedUntilMs,
      };
    }
  }

  if (cachedServerRate && cachedServerRate.lockedUntil > now) {
    return cachedServerRate;
  }

  const freshRate = await fetchWiseRate('USD', 'IDR', now);
  cachedServerRate = freshRate;

  if (config.supabase.isConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = createAdminSupabaseClient();
      await admin.from('fx_rates').insert({
        base_currency: 'USD',
        target_currency: 'IDR',
        rate: freshRate.rate,
        source: 'wise',
        fetched_at: new Date(freshRate.fetchedAt).toISOString(),
        locked_until: new Date(freshRate.lockedUntil).toISOString(),
      });
    } catch {
      // Keep freshRate in memory if table write is not yet migrated
    }
  }

  return freshRate;
}

