export function createDefaultAccount(params) {
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
//# sourceMappingURL=account.js.map