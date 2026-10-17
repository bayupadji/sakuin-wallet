import { User } from './entities/user';

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthRepository {
  signUp(params: SignUpParams): Promise<User>;
  signIn(params: SignInParams): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
