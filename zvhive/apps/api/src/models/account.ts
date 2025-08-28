export type UserRole = 'user' | 'verified' | 'admin';

export interface Account {
  uid: string;
  email?: string | undefined;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  role: UserRole;
  banned: boolean;
  plan: 'free' | 'pro' | 'enterprise';
  planExpiresAt?: number; // epoch ms
  adsDisabled?: boolean;
  createdAt: number;
  updatedAt: number;
}

export function createDefaultAccount(params: { uid: string; email?: string }): Account {
  const now = Date.now();
  return {
    uid: params.uid,
    email: params.email,
    role: 'user',
    banned: false,
    plan: 'free',
    adsDisabled: false,
    createdAt: now,
    updatedAt: now,
  };
}

