import { User, UserRole } from '../domain/entities/user';

const DEV_SUPER_ADMIN_EMAILS = new Set([
  'admin@sakuin.co.id',
  'superadmin@sakuin.co.id',
]);

const DEV_KYC_REVIEWER_EMAILS = new Set([
  'compliance@sakuin.co.id',
  'kyc@sakuin.co.id',
]);

function deterministicUserId(normalizedEmail: string): string {
  let hash = 2166136261;
  for (let i = 0; i < normalizedEmail.length; i++) {
    hash ^= normalizedEmail.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `user-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function createSeedUser(email: string): User {
  const normalized = email.trim().toLowerCase();
  let role: UserRole = 'customer';

  if (DEV_SUPER_ADMIN_EMAILS.has(normalized)) {
    role = 'super_admin';
  } else if (DEV_KYC_REVIEWER_EMAILS.has(normalized)) {
    role = 'kyc_reviewer';
  }

  const localPart = normalized.split('@')[0] || 'Pengguna';
  const displayName = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    id: deterministicUserId(normalized),
    email: normalized,
    fullName: displayName || 'Nasabah Sakuin',
    role,
    createdAt: new Date().toISOString(),
  };
}
