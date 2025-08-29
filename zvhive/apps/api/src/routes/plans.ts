import { Router } from 'express';
import { authenticateFirebaseToken } from '../middleware/auth';
import { ensureAccount } from '../middleware/roles';
import { getFirestore } from '../lib/firebaseAdmin';

const router = Router();
router.use(authenticateFirebaseToken, ensureAccount);

router.get('/', (_req, res) => {
  res.json({
    free: { price: 0, currency: 'USD', apiLimit: 1500, bugLimitPerDay: 1, ads: true },
    pro: { price: 5, currency: 'USD', apiLimit: 20000, bugLimitPerDay: 10, ads: false },
    enterprise: { price: 99, currency: 'USD', apiLimit: 1000000, bugLimitPerDay: 999, ads: false },
  });
});

router.post('/upgrade', async (req: any, res) => {
  const { plan = 'pro', durationMonths = 1 } = req.body || {};
  const uid = req.user!.uid;
  const now = Date.now();
  const expires = now + durationMonths * 30 * 24 * 60 * 60 * 1000;
  await getFirestore().collection('accounts').doc(uid).set(
    { plan, planExpiresAt: expires, adsDisabled: plan !== 'free', updatedAt: now },
    { merge: true }
  );
  res.json({ ok: true });
});

export default router;

