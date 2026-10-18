import { UserRole } from '@/features/auth/domain/entities/user';

export const SESSION_COOKIE_NAME = 'sakuin_session';
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
export const MAX_SESSION_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

export interface SessionPayload {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: number;
  lastActiveAt: number;
}

export type SessionVerifyResult =
  | { valid: true; payload: SessionPayload }
  | { valid: false; reason: 'tampered' | 'idle_timeout' | 'expired' | 'missing' };

export function getSessionSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'sakuin-fintech-fallback-hmac-secret-key-32b'
  );
}

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export async function signHmac(data: string, secret: string = getSessionSecret()): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createSignedSessionCookie(
  user: { id: string; email: string; fullName: string; role: UserRole },
  now: number = Date.now(),
  secret: string = getSessionSecret()
): Promise<{ cookieValue: string; payload: SessionPayload }> {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    createdAt: now,
    lastActiveAt: now,
  };

  const rawJson = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(rawJson);
  const signature = await signHmac(encodedPayload, secret);
  const cookieValue = `${encodedPayload}.${signature}`;

  return { cookieValue, payload };
}

export async function refreshSignedSessionCookie(
  payload: SessionPayload,
  now: number = Date.now(),
  secret: string = getSessionSecret()
): Promise<{ cookieValue: string; payload: SessionPayload }> {
  const updatedPayload: SessionPayload = {
    ...payload,
    lastActiveAt: now,
  };

  const rawJson = JSON.stringify(updatedPayload);
  const encodedPayload = base64UrlEncode(rawJson);
  const signature = await signHmac(encodedPayload, secret);
  const cookieValue = `${encodedPayload}.${signature}`;

  return { cookieValue, payload: updatedPayload };
}

export async function verifySessionCookie(
  cookieValue: string | undefined | null,
  now: number = Date.now(),
  secret: string = getSessionSecret()
): Promise<SessionVerifyResult> {
  if (!cookieValue) {
    return { valid: false, reason: 'missing' };
  }

  const parts = cookieValue.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'tampered' };
  }

  const [encodedPayload, providedSignature] = parts;

  // 1. Verify HMAC signature
  const expectedSignature = await signHmac(encodedPayload, secret);
  if (!timingSafeEqualHex(providedSignature.toLowerCase(), expectedSignature.toLowerCase())) {
    return { valid: false, reason: 'tampered' };
  }

  // 2. Parse payload safely
  let payload: SessionPayload;
  try {
    const jsonStr = base64UrlDecode(encodedPayload);
    payload = JSON.parse(jsonStr);
  } catch {
    return { valid: false, reason: 'tampered' };
  }

  // 3. Absolute expiration check (2 hours)
  if (now - payload.createdAt > MAX_SESSION_AGE_MS) {
    return { valid: false, reason: 'expired' };
  }

  // 4. Idle timeout check (30 minutes)
  if (now - payload.lastActiveAt > IDLE_TIMEOUT_MS) {
    return { valid: false, reason: 'idle_timeout' };
  }

  return { valid: true, payload };
}
