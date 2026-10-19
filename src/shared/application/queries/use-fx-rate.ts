import { useQuery } from '@tanstack/react-query';
import { fxKeys } from './fx-keys';
import {
  fetchFrankfurterRate,
  convertUsdToIdr,
  convertIdrToUsd,
  FxConversionResult,
} from '@/shared/infrastructure/fx/frankfurter';

export interface FxRateData {
  rate: number;
  rateFormatted: string;
  inverseRate: number;
  inverseRateFormatted: string;
  date: string;
  source: string;
  jisdorReference: number;
  spreadPercent: number;
  lockDurationSeconds: number;
  lastUpdated: string;
  expiresAt: number;
}

export { convertUsdToIdr, convertIdrToUsd };

let sessionExpiresAt: number | null = null;

async function fetchRateWithFallback(): Promise<FxConversionResult> {
  // If running in browser, try internal API route first, fallback to direct Frankfurter API
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/fx-rate', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        return (await res.json()) as FxConversionResult;
      }
    } catch {
      // Fall through to direct fetch
    }
  }

  return fetchFrankfurterRate('USD', 'IDR');
}

export function useFxRateQuery() {
  return useQuery({
    queryKey: fxKeys.rate(),
    queryFn: async (): Promise<FxRateData> => {
      const data = await fetchRateWithFallback();

      // Maintain a 15-minute rate lock window
      if (!sessionExpiresAt || Date.now() >= sessionExpiresAt) {
        sessionExpiresAt = Date.now() + 900 * 1000;
      }

      const rateFormatted = `Rp ${data.rate.toLocaleString('id-ID')}`;
      const inverseRateFormatted = `$${data.inverseRate.toFixed(6)}`;

      return {
        rate: data.rate,
        rateFormatted,
        inverseRate: data.inverseRate,
        inverseRateFormatted,
        date: data.date,
        source: data.source,
        jisdorReference: data.rate,
        spreadPercent: 0, // Wise / market reference without hidden markup
        lockDurationSeconds: 900,
        lastUpdated: 'Baru saja',
        expiresAt: sessionExpiresAt,
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes fresh
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}
