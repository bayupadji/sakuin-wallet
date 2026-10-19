import { User } from '../domain/entities/user';

export function createSeedUser(email: string): User {
  return {
    id: 'user-01',
    email,
    fullName: 'Bayu Prasetya Adji Sugiyarto',
    role: email.includes('admin') ? 'super_admin' : 'customer',
    createdAt: '2026-10-15T00:00:00Z',
  };
}
