import { Router } from 'express';
import { authenticateFirebaseToken } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { getFirestore } from '../lib/firebaseAdmin';

const router = Router();
const db = getFirestore();

// Series CRUD (admin)
router.post('/series', authenticateFirebaseToken, requireRole('admin'), async (req: any, res) => {
  const { title, kind } = req.body || {};
  if (!title || !kind) return res.status(400).json({ error: 'title and kind required' });
  const id = db.collection('series').doc().id;
  const series = { id, title, kind, createdAt: Date.now(), updatedAt: Date.now() };
  await db.collection('series').doc(id).set(series);
  res.json(series);
});

router.get('/series', async (_req, res) => {
  const snap = await db.collection('series').orderBy('createdAt', 'desc').limit(100).get();
  res.json(snap.docs.map((d) => d.data()));
});

// Chapter creation (admin)
router.post('/series/:id/chapters', authenticateFirebaseToken, requireRole('admin'), async (req: any, res) => {
  const seriesId = req.params.id;
  const { number, title } = req.body || {};
  if (number === undefined) return res.status(400).json({ error: 'number required' });
  const id = db.collection('chapters').doc().id;
  const chap = { id, seriesId, number, title: title || `Chapter ${number}`, createdAt: Date.now() };
  await db.collection('chapters').doc(id).set(chap);
  res.json(chap);
});

router.get('/series/:id/chapters', async (req, res) => {
  const seriesId = req.params.id;
  const snap = await db.collection('chapters').where('seriesId', '==', seriesId).orderBy('number', 'asc').get();
  res.json(snap.docs.map((d) => d.data()));
});

export default router;

