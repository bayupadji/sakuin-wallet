import { CurrencyMismatchError, InvalidMoneyAmountError } from './errors';

export type Currency = 'USD' | 'IDR';

export class Money {
  private readonly _amount: bigint;
  private readonly _currency: Currency;

  private constructor(amount: bigint, currency: Currency) {
    if (amount < 0n) {
      throw new InvalidMoneyAmountError(`Money amount cannot be negative: ${amount.toString()}`);
    }
    this._amount = amount;
    this._currency = currency;
  }

  public static fromCents(cents: bigint | number, currency: Currency = 'USD'): Money {
    const amountBigInt = typeof cents === 'bigint' ? cents : BigInt(Math.round(cents));
    return new Money(amountBigInt, currency);
  }

  public static fromDecimal(decimalStrOrNum: string | number, currency: Currency): Money {
    if (typeof decimalStrOrNum === 'number') {
      if (!Number.isFinite(decimalStrOrNum)) {
        throw new InvalidMoneyAmountError('Invalid decimal number');
      }
      decimalStrOrNum = decimalStrOrNum.toFixed(currency === 'USD' ? 2 : 0);
    }

    const cleanStr = decimalStrOrNum.trim();
    if (currency === 'IDR') {
      const parsed = BigInt(Math.round(Number(cleanStr)));
      return new Money(parsed, 'IDR');
    }

    // USD (cents): parse dollars and cents safely without float multiplication
    const parts = cleanStr.split('.');
    if (parts.length > 2) {
      throw new InvalidMoneyAmountError(`Malformed decimal string: ${cleanStr}`);
    }

    const dollarsPart = parts[0] ? BigInt(parts[0]) : 0n;
    let centsPart = 0n;

    if (parts.length === 2) {
      const centStr = (parts[1] + '00').slice(0, 2);
      centsPart = BigInt(centStr);
    }

    const totalCents = dollarsPart * 100n + centsPart;
    return new Money(totalCents, 'USD');
  }

  public static zero(currency: Currency = 'USD'): Money {
    return new Money(0n, currency);
  }

  public get amount(): bigint {
    return this._amount;
  }

  public get currency(): Currency {
    return this._currency;
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    if (this._amount < other._amount) {
      throw new InvalidMoneyAmountError('Insufficient balance: subtraction result cannot be negative');
    }
    return new Money(this._amount - other._amount, this._currency);
  }

  public equals(other: Money): boolean {
    return this._currency === other._currency && this._amount === other._amount;
  }

  public isZero(): boolean {
    return this._amount === 0n;
  }

  public isPositive(): boolean {
    return this._amount > 0n;
  }

  public toDecimalString(): string {
    if (this._currency === 'IDR') {
      return this._amount.toString();
    }
    const dollars = this._amount / 100n;
    const cents = this._amount % 100n;
    return `${dollars.toString()}.${cents.toString().padStart(2, '0')}`;
  }

  /**
   * Formats money per AGENTS.md rule 10:
   * Dollar: $1,234.56
   * Rupiah: Rp1.500.000
   */
  public format(): string {
    if (this._currency === 'USD') {
      const dollars = this._amount / 100n;
      const cents = this._amount % 100n;
      const formattedDollars = dollars.toLocaleString('en-US');
      return `$${formattedDollars}.${cents.toString().padStart(2, '0')}`;
    }

    const formattedIdr = this._amount.toLocaleString('id-ID');
    return `Rp${formattedIdr}`;
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new CurrencyMismatchError(this._currency, other._currency);
    }
  }
}
