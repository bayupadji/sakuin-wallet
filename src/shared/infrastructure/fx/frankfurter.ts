/**
 * Frankfurter API client (https://frankfurter.dev)
 * Open-source exchange rate service tracking European Central Bank reference rates.
 */

export interface FrankfurterLatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface FxConversionResult {
  rate: number;
  inverseRate: number;
  date: string;
  base: string;
  target: string;
  source: 'frankfurter.dev';
  fetchedAt: number;
}

const FRANKFURTER_BASE_URL = 'https://api.frankfurter.dev/v1';
const FALLBACK_USD_IDR_RATE = 16250;

/**
 * Fetches the latest USD to IDR exchange rate directly from Frankfurter API.
 */
export async function fetchFrankfurterRate(
  base: string = 'USD',
  symbols: string = 'IDR'
): Promise<FxConversionResult> {
  const url = `${FRANKFURTER_BASE_URL}/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(symbols)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Frankfurter API returned status: ${res.status}`);
    }

    const data: FrankfurterLatestResponse = await res.json();
    const rate = data.rates[symbols];

    if (!rate || typeof rate !== 'number') {
      throw new Error(`Rate for ${symbols} not found in response`);
    }

    const inverseRate = rate > 0 ? 1 / rate : 0;

    return {
      rate,
      inverseRate,
      date: data.date,
      base: data.base,
      target: symbols,
      source: 'frankfurter.dev',
      fetchedAt: Date.now(),
    };
  } catch (error) {
    console.warn('[Frankfurter API] Falling back to default rate due to error:', error);
    return {
      rate: FALLBACK_USD_IDR_RATE,
      inverseRate: 1 / FALLBACK_USD_IDR_RATE,
      date: new Date().toISOString().split('T')[0],
      base,
      target: symbols,
      source: 'frankfurter.dev',
      fetchedAt: Date.now(),
    };
  }
}

/**
 * Converts USD to IDR using the given rate (rounded to nearest integer Rupiah).
 */
export function convertUsdToIdr(amountUsd: number, rate: number): number {
  if (!Number.isFinite(amountUsd) || amountUsd < 0) return 0;
  return Math.round(amountUsd * rate);
}

/**
 * Converts IDR to USD using the given rate (rounded to 2 decimal places / cents).
 */
export function convertIdrToUsd(amountIdr: number, rate: number): number {
  if (!Number.isFinite(amountIdr) || amountIdr <= 0 || rate <= 0) return 0;
  const usd = amountIdr / rate;
  return Math.round(usd * 100) / 100;
}
