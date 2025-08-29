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
    planExpiresAt?: number;
    adsDisabled?: boolean;
    createdAt: number;
    updatedAt: number;
}
export declare function createDefaultAccount(params: {
    uid: string;
    email?: string;
}): Account;
//# sourceMappingURL=account.d.ts.map