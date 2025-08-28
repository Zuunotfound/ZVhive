import { getFirestore } from '../lib/firebaseAdmin';
const DEFAULT_MONTHLY_API_LIMIT = 1500;
function getCurrentMonthKey() {
    const now = new Date();
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}
export async function enforceMonthlyApiQuota(req, res, next) {
    try {
        const userId = req.user?.uid;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const db = getFirestore();
        const monthKey = getCurrentMonthKey();
        const accountSnap = await db.collection('accounts').doc(userId).get();
        const plan = accountSnap.data()?.plan || 'free';
        const limit = plan === 'pro' ? 20000 : plan === 'enterprise' ? 1000000 : DEFAULT_MONTHLY_API_LIMIT;
        const docRef = db.collection('usage').doc(`${userId}:api:${monthKey}`);
        await db.runTransaction(async (tx) => {
            const snap = await tx.get(docRef);
            const count = snap.exists ? snap.data()?.count || 0 : 0;
            if (count >= limit) {
                throw new Error('limit');
            }
            tx.set(docRef, {
                userId,
                kind: 'api',
                month: monthKey,
                count: count + 1,
                updatedAt: new Date(),
            }, { merge: true });
        });
        return next();
    }
    catch (err) {
        if (err.message === 'limit') {
            return res.status(429).json({ error: 'Monthly API limit reached' });
        }
        return res.status(500).json({ error: 'Quota check failed' });
    }
}
export async function enforceBugReportLimit(req, res, next) {
    try {
        const userId = req.user?.uid;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const db = getFirestore();
        const docRef = db.collection('bug_reports_meta').doc(userId);
        const accountSnap = await db.collection('accounts').doc(userId).get();
        const plan = accountSnap.data()?.plan || 'free';
        const gapMs = plan === 'pro' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // pro: 1h, free: 24h
        const snap = await docRef.get();
        const now = Date.now();
        const lastMillis = snap.data()?.lastReportAt || 0;
        if (now - lastMillis < gapMs) {
            return res.status(429).json({ error: 'Bug report limit is 1 per 24h' });
        }
        await docRef.set({ lastReportAt: now }, { merge: true });
        return next();
    }
    catch {
        return res.status(500).json({ error: 'Bug limit check failed' });
    }
}
//# sourceMappingURL=usageLimit.js.map