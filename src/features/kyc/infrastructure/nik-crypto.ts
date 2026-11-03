/**
 * Server-side AES-256-GCM encryption and HMAC-SHA256 deterministic hashing for Indonesian NIK (16 digits).
 * Raw NIK is never stored in plaintext or logged; lists display nik_masked only (AGENTS.md Section 7 & 8).
 */

function getKycSecret(): string {
  const secret = process.env.KYC_ENCRYPTION_KEY || process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('KYC_ENCRYPTION_KEY environment variable is required in production.');
    }
    return 'sakuin-dev-kyc-aes-256-gcm-secret-key';
  }
  return secret;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) {
    throw new Error('Malformed hexadecimal string');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

async function deriveAesGcmKey(secret: string): Promise<CryptoKey> {
  const encoded = new TextEncoder().encode(secret);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

export async function encryptNik(plainNik: string, secret: string = getKycSecret()): Promise<string> {
  const sanitized = plainNik.replace(/\D/g, '');
  if (sanitized.length !== 16) {
    throw new Error('NIK must be exactly 16 digits before encryption.');
  }

  const key = await deriveAesGcmKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(sanitized);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);

  return `v1:${bytesToHex(iv)}:${bytesToHex(new Uint8Array(ciphertext))}`;
}

export async function decryptNik(
  encryptedPayload: string,
  secret: string = getKycSecret()
): Promise<string> {
  const parts = encryptedPayload.split(':');
  if (parts.length !== 3 || parts[0] !== 'v1') {
    throw new Error('Unsupported or corrupted encrypted NIK format.');
  }

  const iv = hexToBytes(parts[1]);
  const ciphertext = hexToBytes(parts[2]);
  const key = await deriveAesGcmKey(secret);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    ciphertext as BufferSource
  );
  return new TextDecoder().decode(decrypted);
}

export async function hashNik(plainNik: string, secret: string = getKycSecret()): Promise<string> {
  const sanitized = plainNik.replace(/\D/g, '');
  if (sanitized.length !== 16) {
    throw new Error('NIK must be exactly 16 digits before hashing.');
  }

  const encoder = new TextEncoder();
  const hmacKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(`nik-unique-index:${secret}`),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', hmacKey, encoder.encode(sanitized));
  return bytesToHex(new Uint8Array(signature));
}

