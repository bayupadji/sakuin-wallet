export class DomainError extends Error {
  public readonly code: string;

  constructor(message: string, code = 'DOMAIN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidMoneyAmountError extends DomainError {
  constructor(message = 'Amount cannot be negative and must be a valid integer value') {
    super(message, 'INVALID_MONEY_AMOUNT');
  }
}

export class CurrencyMismatchError extends DomainError {
  constructor(expected: string, received: string) {
    super(`Cannot operate on mismatched currencies: expected ${expected}, got ${received}`, 'CURRENCY_MISMATCH');
  }
}

export class PrecisionLossError extends DomainError {
  constructor(message = 'Floating point arithmetic is forbidden for money; use integer cents') {
    super(message, 'PRECISION_LOSS_ERROR');
  }
}
