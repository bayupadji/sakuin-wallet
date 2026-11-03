import { useQuery } from '@tanstack/react-query';
import { fxKeys } from './fx-keys';
import {
  FX_RATE_LOCK_MS,
  fetchWiseRate,
  convertUsdToIdr,
  convertIdrToUsd,
  FxConversionResult,
} from '@/shared/infrastructure/fx/wise';

export interface FxRateData {
  rate: number;
  rateFormatted: string;
  inverseRate: number;
  inverseRateFormatted: string;
  date: string;
  source: 'wise';
  jisdorReference: number;
  spreadPercent: number;
  lockDurationSeconds: number;
  lastUpdated: string;
  expiresAt: number;
}

export { convertUsdToIdr, convertIdrToUsd };

async function fetchLockedRate(): Promise<FxConversionResult> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/fx-rate', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      return (await res.json()) as FxConversionResult;
    }
    throw new Error(`FX API returned status ${res.status}`);
  }

  return fetchWiseRate('USD', 'IDR');
}

export function useFxRateQuery() {
  return useQuery({
    queryKey: fxKeys.rate(),
    queryFn: async (): Promise<FxRateData> => {
      const data = await fetchLockedRate();
      const expiresAt = data.lockedUntil || Date.now() + FX_RATE_LOCK_MS;
      const rateFormatted = `Rp${Math.round(data.rate).toLocaleString('id-ID')}`;
      const inverseRateFormatted = `$${data.inverseRate.toFixed(6)}`;

      return {
        rate: data.rate,
        rateFormatted,
        inverseRate: data.inverseRate,
        inverseRateFormatted,
        date: data.date,
        source: 'wise',
        jisdorReference: data.rate,
        spreadPercent: 0,
        lockDurationSeconds: Math.floor(FX_RATE_LOCK_MS / 1000),
        lastUpdated: 'Baru saja',
        expiresAt,
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
}
