import { describe, expect, it } from 'vitest';
import { CurrencyMismatchError, InvalidMoneyAmountError } from './errors';
import { Money } from './money';

describe('Money Domain Value Object', () => {
  it('creates Money from cents correctly and stores as bigint', () => {
    const usd = Money.fromCents(123456n, 'USD');
    expect(usd.amount).toBe(123456n);
    expect(usd.currency).toBe('USD');
    expect(usd.format()).toBe('$1,234.56');
    expect(usd.toDecimalString()).toBe('1234.56');
  });

  it('formats Rupiah correctly according to AGENTS.md formatting rules', () => {
    const idr = Money.fromDecimal('1500000', 'IDR');
    expect(idr.amount).toBe(1500000n);
    expect(idr.currency).toBe('IDR');
    expect(idr.format()).toBe('Rp1.500.000');
  });

  it('parses decimal dollar strings without floating point loss', () => {
    const parsed = Money.fromDecimal('10.50', 'USD');
    expect(parsed.amount).toBe(1050n);
    expect(parsed.format()).toBe('$10.50');
  });

  it('adds and subtracts money of same currency safely', () => {
    const a = Money.fromCents(500n, 'USD');
    const b = Money.fromCents(250n, 'USD');

    const sum = a.add(b);
    expect(sum.amount).toBe(750n);

    const diff = a.subtract(b);
    expect(diff.amount).toBe(250n);
  });

  it('throws when attempting negative balance subtraction', () => {
    const small = Money.fromCents(100n, 'USD');
    const large = Money.fromCents(500n, 'USD');
    expect(() => small.subtract(large)).toThrow(InvalidMoneyAmountError);
  });

  it('throws on currency mismatch', () => {
    const usd = Money.fromCents(100n, 'USD');
    const idr = Money.fromCents(100000n, 'IDR');
    expect(() => usd.add(idr)).toThrow(CurrencyMismatchError);
  });
});
