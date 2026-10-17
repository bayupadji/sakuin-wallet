import { DomainError } from '@/shared/domain/errors';

export class WalletNotFoundError extends DomainError {
  constructor(message = 'Wallet not found for this user.') {
    super(message, 'WALLET_NOT_FOUND');
  }
}

export class WalletFrozenError extends DomainError {
  constructor(message = 'Wallet is currently frozen. Contact support for assistance.') {
    super(message, 'WALLET_FROZEN');
  }
}
