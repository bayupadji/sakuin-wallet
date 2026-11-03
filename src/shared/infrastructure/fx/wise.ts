/**
 * Wise FX Reference Rate Client (https://api.wise.com/v1/rates)
 * Zero-markup mid-market reference rate locked for 15 minutes per AGENTS.md Section 6 Rule 7.
 */

export const FX_RATE_LOCK_MS = 15 * 60 * 1000; // 15 minutes

export interface WiseRateEntry {
  rate: number;
  source: string;
  target: string;
  time: string;
}

export interface FxConversionResult {
  rate: number;
  inverseRate: number;
  date: string;
  base: string;
  target: string;
  source: 'wise';
  fetchedAt: number;
  lockedUntil: number;
}

const WISE_RATES_URL = 'https://api.wise.com/v1/rates';

/**
 * Fetches the zero-margin USD -> IDR reference rate from Wise Rates API.
 * Throws on network or API failure; callers must handle errors and never substitute a fabricated rate.
 */
export async function fetchWiseRate(
  base: string = 'USD',
  target: string = 'IDR',
  now: number = Date.now()
): Promise<FxConversionResult> {
  const url = `${WISE_RATES_URL}?source=${encodeURIComponent(base)}&target=${encodeURIComponent(target)}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  const apiToken = typeof process !== 'undefined' ? process.env?.WISE_API_TOKEN : undefined;
  if (apiToken) {
    headers.Authorization = `Bearer ${apiToken}`;
  }

  const res = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    throw new Error(`Wise FX API returned status: ${res.status}`);
  }

  const data: WiseRateEntry[] = await res.json();
  const entry = Array.isArray(data) ? data[0] : undefined;

  if (!entry || typeof entry.rate !== 'number' || entry.rate <= 0) {
    throw new Error(`Valid Wise rate for ${base}/${target} not found in response`);
  }

  return {
    rate: entry.rate,
    inverseRate: 1 / entry.rate,
    date: (entry.time || new Date(now).toISOString()).slice(0, 10),
    base: entry.source || base,
    target: entry.target || target,
    source: 'wise',
    fetchedAt: now,
    lockedUntil: now + FX_RATE_LOCK_MS,
  };
}

/**
 * Converts USD to IDR using the locked Wise rate (rounded to nearest integer Rupiah).
 */
export function convertUsdToIdr(amountUsd: number, rate: number): number {
  if (!Number.isFinite(amountUsd) || amountUsd <= 0 || !Number.isFinite(rate) || rate <= 0) return 0;
  return Math.round(amountUsd * rate);
}

/**
 * Converts IDR to USD using the locked Wise rate (rounded to nearest cent).
 */
export function convertIdrToUsd(amountIdr: number, rate: number): number {
  if (!Number.isFinite(amountIdr) || amountIdr <= 0 || !Number.isFinite(rate) || rate <= 0) return 0;
  const cents = Math.round((amountIdr / rate) * 100);
  return cents / 100;
}

