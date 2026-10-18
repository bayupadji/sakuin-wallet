import { describe, expect, it } from 'vitest';
import {
  createSignedSessionCookie,
  refreshSignedSessionCookie,
  verifySessionCookie,
  IDLE_TIMEOUT_MS,
  MAX_SESSION_AGE_MS,
  signHmac,
} from './session';

describe('HMAC Session Cookie System', () => {
  const mockUser = {
    id: 'user-123',
    email: 'bayu@example.com',
    fullName: 'Bayu Prasetya Adji Sugiyarto',
    role: 'customer' as const,
  };

  it('generates a valid HMAC-signed cookie and verifies successfully', async () => {
    const t0 = 1000000000000;
    const { cookieValue } = await createSignedSessionCookie(mockUser, t0);

    const result = await verifySessionCookie(cookieValue, t0 + 1000);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.payload.userId).toBe('user-123');
      expect(result.payload.email).toBe('bayu@example.com');
      expect(result.payload.createdAt).toBe(t0);
      expect(result.payload.lastActiveAt).toBe(t0);
    }
  });

  it('rejects tampered cookie payloads', async () => {
    const t0 = 1000000000000;
    const { cookieValue } = await createSignedSessionCookie(mockUser, t0);
    const [payloadB64] = cookieValue.split('.');

    // Tamper with signature
    const tamperedSigCookie = `${payloadB64}.0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`;
    const resultSig = await verifySessionCookie(tamperedSigCookie, t0);
    expect(resultSig.valid).toBe(false);
    if (!resultSig.valid) {
      expect(resultSig.reason).toBe('tampered');
    }

    // Tamper with payload
    const signature = await signHmac(payloadB64);
    const tamperedPayloadCookie = `eyJ1c2VySWQiOiJoYWNrZXIifQ.${signature}`;
    const resultPayload = await verifySessionCookie(tamperedPayloadCookie, t0);
    expect(resultPayload.valid).toBe(false);
    if (!resultPayload.valid) {
      expect(resultPayload.reason).toBe('tampered');
    }
  });

  it('triggers idle timeout when inactive for more than 30 minutes', async () => {
    const t0 = 1000000000000;
    const { cookieValue } = await createSignedSessionCookie(mockUser, t0);

    // Within 30 minutes (e.g. 29m50s): valid
    const withinIdle = await verifySessionCookie(cookieValue, t0 + IDLE_TIMEOUT_MS - 10000);
    expect(withinIdle.valid).toBe(true);

    // Over 30 minutes (e.g. 30m1s): idle timeout
    const overIdle = await verifySessionCookie(cookieValue, t0 + IDLE_TIMEOUT_MS + 1000);
    expect(overIdle.valid).toBe(false);
    if (!overIdle.valid) {
      expect(overIdle.reason).toBe('idle_timeout');
    }
  });

  it('triggers hard expiration after 2 hours even with continuous activity', async () => {
    const t0 = 1000000000000;
    const { payload } = await createSignedSessionCookie(mockUser, t0);

    // Keep refreshing lastActiveAt every 20 minutes until past 2 hours
    const refreshedPast2Hours = await refreshSignedSessionCookie(
      payload,
      t0 + MAX_SESSION_AGE_MS - 5000 // Active right before 2 hours
    );

    // Exactly after 2 hours + 1 second
    const expiredResult = await verifySessionCookie(
      refreshedPast2Hours.cookieValue,
      t0 + MAX_SESSION_AGE_MS + 1000
    );

    expect(expiredResult.valid).toBe(false);
    if (!expiredResult.valid) {
      expect(expiredResult.reason).toBe('expired');
    }
  });

  it('slides the idle window upon refreshing', async () => {
    const t0 = 1000000000000;
    const { payload } = await createSignedSessionCookie(mockUser, t0);

    // Refresh after 20 minutes of activity
    const t1 = t0 + 20 * 60 * 1000;
    const { cookieValue: refreshedCookie, payload: refreshedPayload } = await refreshSignedSessionCookie(
      payload,
      t1
    );

    expect(refreshedPayload.lastActiveAt).toBe(t1);
    expect(refreshedPayload.createdAt).toBe(t0); // Preserved

    // Check 25 minutes after t1 (45 min after t0, but only 25 min idle since t1): valid!
    const result = await verifySessionCookie(refreshedCookie, t1 + 25 * 60 * 1000);
    expect(result.valid).toBe(true);
  });
});
