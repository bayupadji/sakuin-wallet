import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  convertUsdToIdr,
  convertIdrToUsd,
  fetchFrankfurterRate,
} from './frankfurter';

describe('Frankfurter FX Utilities', () => {
  describe('convertUsdToIdr', () => {
    it('converts USD to IDR correctly with integer rounding', () => {
      const rate = 18000;
      expect(convertUsdToIdr(100, rate)).toBe(1800000);
      expect(convertUsdToIdr(1.5, rate)).toBe(27000);
      expect(convertUsdToIdr(0.333, rate)).toBe(5994);
    });

    it('handles zero and negative amounts safely', () => {
      const rate = 18000;
      expect(convertUsdToIdr(0, rate)).toBe(0);
      expect(convertUsdToIdr(-50, rate)).toBe(0);
      expect(convertUsdToIdr(NaN, rate)).toBe(0);
    });
  });

  describe('convertIdrToUsd', () => {
    it('converts IDR to USD correctly with 2 decimal precision', () => {
      const rate = 18000;
      // 1,800,000 / 18,000 = 100
      expect(convertIdrToUsd(1800000, rate)).toBe(100);
      // 1,000,000 / 18,000 = 55.5555... -> 55.56
      expect(convertIdrToUsd(1000000, rate)).toBe(55.56);
      // 500,000 / 18,000 = 27.7777... -> 27.78
      expect(convertIdrToUsd(500000, rate)).toBe(27.78);
    });

    it('handles zero, negative, and invalid rates safely', () => {
      expect(convertIdrToUsd(0, 18000)).toBe(0);
      expect(convertIdrToUsd(-1000, 18000)).toBe(0);
      expect(convertIdrToUsd(100000, 0)).toBe(0);
    });
  });

  describe('fetchFrankfurterRate', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('successfully fetches and parses rate from Frankfurter API', async () => {
      const mockResponse = {
        amount: 1,
        base: 'USD',
        date: '2026-10-16',
        rates: { IDR: 18031 },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchFrankfurterRate('USD', 'IDR');
      expect(result.rate).toBe(18031);
      expect(result.base).toBe('USD');
      expect(result.target).toBe('IDR');
      expect(result.source).toBe('frankfurter.dev');
      expect(result.inverseRate).toBeCloseTo(1 / 18031, 6);
    });

    it('falls back to default rate if fetch fails or network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await fetchFrankfurterRate('USD', 'IDR');
      expect(result.rate).toBe(16250);
      expect(result.source).toBe('frankfurter.dev');
      expect(result.inverseRate).toBeCloseTo(1 / 16250, 6);
    });
  });
});
