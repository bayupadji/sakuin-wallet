import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  FX_RATE_LOCK_MS,
  convertUsdToIdr,
  convertIdrToUsd,
  fetchWiseRate,
} from './wise';

describe('Wise Zero-Markup FX Utilities', () => {
  describe('convertUsdToIdr', () => {
    it('converts USD to IDR with nearest-Rupiah integer rounding', () => {
      const rate = 18000;
      expect(convertUsdToIdr(100, rate)).toBe(1800000);
      expect(convertUsdToIdr(1.5, rate)).toBe(27000);
      expect(convertUsdToIdr(0.333, rate)).toBe(5994);
    });

    it('handles zero, negative, and NaN amounts safely', () => {
      const rate = 18000;
      expect(convertUsdToIdr(0, rate)).toBe(0);
      expect(convertUsdToIdr(-50, rate)).toBe(0);
      expect(convertUsdToIdr(NaN, rate)).toBe(0);
    });
  });

  describe('convertIdrToUsd', () => {
    it('converts IDR to USD rounded to the nearest cent', () => {
      const rate = 18000;
      expect(convertIdrToUsd(1800000, rate)).toBe(100);
      expect(convertIdrToUsd(1000000, rate)).toBe(55.56);
      expect(convertIdrToUsd(500000, rate)).toBe(27.78);
    });

    it('handles zero, negative, and invalid rates safely', () => {
      expect(convertIdrToUsd(0, 18000)).toBe(0);
      expect(convertIdrToUsd(-1000, 18000)).toBe(0);
      expect(convertIdrToUsd(100000, 0)).toBe(0);
    });
  });

  describe('fetchWiseRate', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('fetches zero-markup rate from Wise API and sets 15-minute lock window', async () => {
      const fixedNow = 1793700000000;
      const mockResponse = [
        {
          rate: 16245.5,
          source: 'USD',
          target: 'IDR',
          time: '2026-11-03T14:00:00+0000',
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchWiseRate('USD', 'IDR', fixedNow);
      expect(result.rate).toBe(16245.5);
      expect(result.base).toBe('USD');
      expect(result.target).toBe('IDR');
      expect(result.source).toBe('wise');
      expect(result.lockedUntil).toBe(fixedNow + FX_RATE_LOCK_MS);
      expect(result.inverseRate).toBeCloseTo(1 / 16245.5, 6);
    });

    it('throws instead of returning a fabricated rate when network fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(fetchWiseRate('USD', 'IDR')).rejects.toThrow('Network error');
    });

    it('throws when Wise API responds with non-OK status', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 });

      await expect(fetchWiseRate('USD', 'IDR')).rejects.toThrow('503');
    });
  });
});

