import { Router } from 'express';
import { authenticateFirebaseToken } from '../middleware/auth';
import { ensureAccount } from '../middleware/roles';
import { getFirestore } from '../lib/firebaseAdmin';
const router = Router();
const db = getFirestore();
router.get('/posts', async (_req, res) => {
    const snap = await db
        .collection('community_posts')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
    res.json(snap.docs.map((d) => d.data()));
});
router.post('/posts', authenticateFirebaseToken, ensureAccount, async (req, res) => {
    const { title, content } = req.body || {};
    if (!title || !content)
        return res.status(400).json({ error: 'title and content required' });
    const id = db.collection('community_posts').doc().id;
    const post = {
        id,
        userId: req.user.uid,
        title,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    await db.collection('community_posts').doc(id).set(post);
    res.json(post);
});
router.get('/posts/:id/comments', async (req, res) => {
    const postId = req.params.id;
    const snap = await db
        .collection('community_comments')
        .where('postId', '==', postId)
        .orderBy('createdAt', 'asc')
        .limit(100)
        .get();
    res.json(snap.docs.map((d) => d.data()));
});
router.post('/posts/:id/comments', authenticateFirebaseToken, ensureAccount, async (req, res) => {
    const postId = req.params.id;
    const { content } = req.body || {};
    if (!content)
        return res.status(400).json({ error: 'content required' });
    const id = db.collection('community_comments').doc().id;
    const comment = {
        id,
        postId,
        userId: req.user.uid,
        content,
        createdAt: Date.now(),
    };
    await db.collection('community_comments').doc(id).set(comment);
    res.json(comment);
});
export default router;
//# sourceMappingURL=community.js.map