import type { Response, NextFunction } from 'express';
import { getFirestore } from '../lib/firebaseAdmin';
import type { AuthenticatedRequest } from './auth';

const DEFAULT_MONTHLY_API_LIMIT = 1500;

function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export async function enforceMonthlyApiQuota(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const db = getFirestore();
    const monthKey = getCurrentMonthKey();
    const accountSnap = await db.collection('accounts').doc(userId).get();
    const plan = (accountSnap.data()?.plan as string) || 'free';
    const limit = plan === 'pro' ? 20000 : plan === 'enterprise' ? 1000000 : DEFAULT_MONTHLY_API_LIMIT;
    const docRef = db.collection('usage').doc(`${userId}:api:${monthKey}`);
    let remaining = 0;
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      const count = snap.exists ? (snap.data()?.count as number) || 0 : 0;
      if (count >= limit) {
        throw new Error('limit');
      }
      remaining = Math.max(0, limit - (count + 1));
      tx.set(
        docRef,
        {
          userId,
          kind: 'api',
          month: monthKey,
          count: count + 1,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    });
    const resetDate = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, 1, 0, 0, 0, 0));
    res.setHeader('X-RateLimit-Limit', String(limit));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(Math.floor(resetDate.getTime() / 1000)));
    return next();
  } catch (err) {
    if ((err as Error).message === 'limit') {
      return res.status(429).json({ error: 'Monthly API limit reached' });
    }
    return res.status(500).json({ error: 'Quota check failed' });
  }
}

export async function enforceBugReportLimit(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const db = getFirestore();
    const docRef = db.collection('bug_reports_meta').doc(userId);
    const accountSnap = await db.collection('accounts').doc(userId).get();
    const plan = (accountSnap.data()?.plan as string) || 'free';
    const gapMs = plan === 'pro' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // pro: 1h, free: 24h
    const snap = await docRef.get();
    const now = Date.now();
    const lastMillis = (snap.data()?.lastReportAt as number) || 0;
    if (now - lastMillis < gapMs) {
      return res.status(429).json({ error: 'Bug report limit is 1 per 24h' });
    }
    await docRef.set({ lastReportAt: now }, { merge: true });
    return next();
  } catch {
    return res.status(500).json({ error: 'Bug limit check failed' });
  }
}

