import { DomainError } from '@/shared/domain/errors';

export class KycSubmissionError extends DomainError {
  constructor(message = 'Failed to submit KYC verification.') {
    super(message, 'KYC_SUBMISSION_ERROR');
  }
}

export class KycMaxAttemptsExceededError extends DomainError {
  constructor(message = 'Maximum verification attempts (3) exceeded.') {
    super(message, 'KYC_MAX_ATTEMPTS_EXCEEDED');
  }
}

export class KycNotApprovedError extends DomainError {
  constructor(message = 'Identity verification (KYC) must be approved to access this feature.') {
    super(message, 'KYC_NOT_APPROVED');
  }
}
