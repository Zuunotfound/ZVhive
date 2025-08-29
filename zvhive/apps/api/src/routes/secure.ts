import { Router } from 'express';
import { authenticateFirebaseToken } from '../middleware/auth';
import type { AuthenticatedRequest } from '../middleware/auth';
import { enforceMonthlyApiQuota, enforceBugReportLimit } from '../middleware/usageLimit';
import { getFirestore } from '../lib/firebaseAdmin';

const router = Router();

router.use(authenticateFirebaseToken);

router.get('/me', enforceMonthlyApiQuota, async (req: AuthenticatedRequest, res) => {
  res.json({ uid: req.user!.uid, email: req.user!.email, role: req.user!.role });
});

router.post('/bug-report', enforceBugReportLimit, async (req: AuthenticatedRequest, res) => {
  const { title, description } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title required' });
  const db = getFirestore();
  const id = `${req.user!.uid}-${Date.now()}`;
  await db.collection('bug_reports').doc(id).set({
    id,
    userId: req.user!.uid,
    title,
    description: description || '',
    createdAt: new Date(),
  });
  res.json({ ok: true, id });
});

export default router;

