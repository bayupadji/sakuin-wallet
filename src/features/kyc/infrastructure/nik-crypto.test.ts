import { describe, it, expect } from 'vitest';
import { encryptNik, decryptNik, hashNik } from './nik-crypto';

describe('NIK AES-256-GCM Encryption & Deterministic Hash', () => {
  const sampleNik = '3171012304950002';
  const testSecret = 'unit-test-secret-32-bytes-key-01';

  it('encrypts NIK with random IV and decrypts back to exact 16 digits', async () => {
    const encrypted1 = await encryptNik(sampleNik, testSecret);
    const encrypted2 = await encryptNik(sampleNik, testSecret);

    expect(encrypted1.startsWith('v1:')).toBe(true);
    expect(encrypted1).not.toContain(sampleNik);
    expect(encrypted1).not.toBe(encrypted2);

    const decrypted1 = await decryptNik(encrypted1, testSecret);
    const decrypted2 = await decryptNik(encrypted2, testSecret);
    expect(decrypted1).toBe(sampleNik);
    expect(decrypted2).toBe(sampleNik);
  });

  it('rejects tampered ciphertext or wrong decryption key', async () => {
    const encrypted = await encryptNik(sampleNik, testSecret);
    await expect(decryptNik(encrypted, 'wrong-key')).rejects.toThrow();

    const tampered = encrypted.slice(0, -2) + (encrypted.endsWith('aa') ? 'bb' : 'aa');
    await expect(decryptNik(tampered, testSecret)).rejects.toThrow();
  });

  it('produces deterministic HMAC hash for unique NIK enforcement without storing plaintext', async () => {
    const hash1 = await hashNik(sampleNik, testSecret);
    const hash2 = await hashNik(sampleNik, testSecret);
    const otherHash = await hashNik('3201041208920008', testSecret);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
    expect(hash1).not.toBe(otherHash);
  });
});

