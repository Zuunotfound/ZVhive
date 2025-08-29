import { getFirestore } from '../lib/firebaseAdmin';
export async function ensureAccount(req, res, next) {
    const uid = req.user?.uid;
    if (!uid)
        return res.status(401).json({ error: 'Unauthorized' });
    const db = getFirestore();
    const ref = db.collection('accounts').doc(uid);
    const snap = await ref.get();
    if (!snap.exists) {
        await ref.set({ uid, email: req.user?.email || null, role: 'user', banned: false, plan: 'free', createdAt: Date.now(), updatedAt: Date.now() }, { merge: true });
    }
    return next();
}
export function requireRole(minRole) {
    const order = { user: 1, verified: 2, admin: 3 };
    return async (req, res, next) => {
        const uid = req.user?.uid;
        if (!uid)
            return res.status(401).json({ error: 'Unauthorized' });
        const db = getFirestore();
        const doc = await db.collection('accounts').doc(uid).get();
        const role = doc.data()?.role || 'user';
        const banned = !!doc.data()?.banned;
        if (banned)
            return res.status(403).json({ error: 'Banned' });
        const currentRank = order[role] ?? 0;
        const minRank = order[minRole];
        if (currentRank < minRank)
            return res.status(403).json({ error: 'Forbidden' });
        return next();
    };
}
//# sourceMappingURL=roles.js.map