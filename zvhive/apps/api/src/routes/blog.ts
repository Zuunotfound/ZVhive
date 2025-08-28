import { Router } from 'express';
import { authenticateFirebaseToken } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { getFirestore } from '../lib/firebaseAdmin';

const router = Router();
const db = getFirestore();

router.get('/posts', async (_req, res) => {
  const snap = await db.collection('blog_posts').orderBy('publishedAt', 'desc').limit(50).get();
  res.json(snap.docs.map((d) => d.data()));
});

router.get('/posts/:id', async (req, res) => {
  const id = req.params.id;
  const doc = await db.collection('blog_posts').doc(id).get();
  if (!doc.exists) return res.status(404).json({ error: 'not found' });
  res.json(doc.data());
});

router.post('/posts', authenticateFirebaseToken, requireRole('admin'), async (req: any, res) => {
  const { title, content } = req.body || {};
  if (!title || !content) return res.status(400).json({ error: 'title and content required' });
  const id = db.collection('blog_posts').doc().id;
  const post = { id, title, content, publishedAt: Date.now(), authorId: req.user!.uid };
  await db.collection('blog_posts').doc(id).set(post);
  res.json(post);
});

export default router;

