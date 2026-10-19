import { useQuery } from '@tanstack/react-query';
import { fxKeys } from './fx-keys';

export interface FxRateData {
  rate: number;
  rateFormatted: string;
  jisdorReference: number;
  spreadPercent: number;
  lockDurationSeconds: number;
  lastUpdated: string;
  expiresAt: number;
}

let sessionExpiresAt: number | null = null;

export function useFxRateQuery() {
  return useQuery({
    queryKey: fxKeys.rate(),
    queryFn: async (): Promise<FxRateData> => {
      // If previous lock expired or uninitialized, establish new 15-min lock window
      if (!sessionExpiresAt || Date.now() >= sessionExpiresAt) {
        sessionExpiresAt = Date.now() + 900 * 1000;
      }

      return {
        rate: 16250,
        rateFormatted: 'Rp 16.250',
        jisdorReference: 16245,
        spreadPercent: 0.03,
        lockDurationSeconds: 900,
        lastUpdated: 'Baru saja',
        expiresAt: sessionExpiresAt,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    refetchInterval: 1000 * 60, // Poll every 1 minute
  });
}
