import type { Response, NextFunction } from 'express';
import { getFirestore } from '../lib/firebaseAdmin';
import type { AuthenticatedRequest } from './auth';

const MONTHLY_API_LIMIT = 1500;
const BUG_REPORT_LIMIT_PER_DAYS = 1;

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
    const docRef = db.collection('usage').doc(`${userId}:api:${monthKey}`);
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      const count = snap.exists ? (snap.data()?.count as number) || 0 : 0;
      if (count >= MONTHLY_API_LIMIT) {
        throw new Error('limit');
      }
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
    const snap = await docRef.get();
    const now = Date.now();
    const lastMillis = (snap.data()?.lastReportAt as number) || 0;
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (now - lastMillis < oneDayMs) {
      return res.status(429).json({ error: 'Bug report limit is 1 per 24h' });
    }
    await docRef.set({ lastReportAt: now }, { merge: true });
    return next();
  } catch {
    return res.status(500).json({ error: 'Bug limit check failed' });
  }
}

