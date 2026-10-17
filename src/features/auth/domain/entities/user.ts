export type UserRole =
  | 'customer'
  | 'super_admin'
  | 'kyc_reviewer'
  | 'dispute_agent'
  | 'analyst';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}
