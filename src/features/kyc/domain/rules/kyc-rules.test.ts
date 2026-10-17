import { describe, expect, it } from 'vitest';
import {
  canSubmitKyc,
  canTransact,
  maskNik,
  validateIdCardFile,
  validateNik,
} from './kyc-rules';

describe('KYC Domain Rules', () => {
  it('validates file size and mime type correctly', () => {
    const valid = validateIdCardFile({ size: 1024 * 1024, type: 'image/jpeg' });
    expect(valid.valid).toBe(true);

    const tooLarge = validateIdCardFile({ size: 6 * 1024 * 1024, type: 'image/png' });
    expect(tooLarge.valid).toBe(false);
    expect(tooLarge.error).toContain('5 MB');

    const wrongFormat = validateIdCardFile({ size: 1024, type: 'application/pdf' });
    expect(wrongFormat.valid).toBe(false);
    expect(wrongFormat.error).toContain('JPG or PNG');
  });

  it('validates NIK format strictly (16 digits)', () => {
    expect(validateNik('3171012345670001').valid).toBe(true);
    expect(validateNik('31710123456700').valid).toBe(false);
    expect(validateNik('317101234567000A').valid).toBe(false);
  });

  it('masks NIK for privacy compliance', () => {
    expect(maskNik('3171012345670001')).toBe('317101******0001');
  });

  it('enforces canTransact only when approved', () => {
    expect(canTransact('approved')).toBe(true);
    expect(canTransact('not_verified')).toBe(false);
    expect(canTransact('in_review')).toBe(false);
    expect(canTransact('rejected')).toBe(false);
    expect(canTransact('reupload_required')).toBe(false);
  });

  it('enforces maximum 3 attempts for submission', () => {
    expect(canSubmitKyc('not_verified', 0)).toBe(true);
    expect(canSubmitKyc('rejected', 1)).toBe(true);
    expect(canSubmitKyc('reupload_required', 2)).toBe(true);
    expect(canSubmitKyc('rejected', 3)).toBe(false);
    expect(canSubmitKyc('in_review', 1)).toBe(false);
    expect(canSubmitKyc('approved', 1)).toBe(false);
  });
});
