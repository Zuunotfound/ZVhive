import { Router } from 'express';
import { authenticateFirebaseToken } from '../middleware/auth';
import { ensureAccount } from '../middleware/roles';
import { getFirestore } from '../lib/firebaseAdmin';
const router = Router();
router.use(authenticateFirebaseToken, ensureAccount);
router.get('/me', async (req, res) => {
    const uid = req.user.uid;
    const doc = await getFirestore().collection('accounts').doc(uid).get();
    res.json(doc.data());
});
router.post('/me', async (req, res) => {
    const uid = req.user.uid;
    const { displayName, photoURL, bio } = req.body || {};
    const ref = getFirestore().collection('accounts').doc(uid);
    await ref.set({ displayName, photoURL, bio, updatedAt: Date.now() }, { merge: true });
    const after = await ref.get();
    res.json(after.data());
});
export default router;
//# sourceMappingURL=account.js.map