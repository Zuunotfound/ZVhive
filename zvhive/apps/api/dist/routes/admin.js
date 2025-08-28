import { Router } from 'express';
import { authenticateFirebaseToken } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { getFirestore } from '../lib/firebaseAdmin';
const router = Router();
router.use(authenticateFirebaseToken, requireRole('admin'));
router.post('/user/:uid/verify', async (req, res) => {
    const uid = req.params.uid;
    await getFirestore().collection('accounts').doc(uid).set({ role: 'verified', updatedAt: Date.now() }, { merge: true });
    res.json({ ok: true });
});
router.post('/user/:uid/ban', async (req, res) => {
    const uid = req.params.uid;
    await getFirestore().collection('accounts').doc(uid).set({ banned: true, updatedAt: Date.now() }, { merge: true });
    res.json({ ok: true });
});
router.post('/user/:uid/unban', async (req, res) => {
    const uid = req.params.uid;
    await getFirestore().collection('accounts').doc(uid).set({ banned: false, updatedAt: Date.now() }, { merge: true });
    res.json({ ok: true });
});
export default router;
//# sourceMappingURL=admin.js.map