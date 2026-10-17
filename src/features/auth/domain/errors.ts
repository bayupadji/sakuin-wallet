import { DomainError } from '@/shared/domain/errors';

export class InvalidCredentialsError extends DomainError {
  constructor(message = 'Invalid email or password.') {
    super(message, 'INVALID_CREDENTIALS');
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor(message = 'An account with this email address already exists.') {
    super(message, 'USER_ALREADY_EXISTS');
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'You must be signed in to perform this action.') {
    super(message, 'UNAUTHORIZED');
  }
}

export class RateLimitExceededError extends DomainError {
  constructor(message = 'Too many attempts. Account locked. Please wait before trying again.') {
    super(message, 'RATE_LIMIT_EXCEEDED');
  }
}
