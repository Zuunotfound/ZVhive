import { Router } from 'express';
import { getFirestore } from '../lib/firebaseAdmin';

const router = Router();
const db = getFirestore();

router.get('/', async (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  if (!q || q.length < 2) return res.json({ series: [], posts: [], blog: [] });

  // naive search by title/content fields
  const [seriesSnap, commSnap, blogSnap] = await Promise.all([
    db.collection('series').limit(20).get(),
    db.collection('community_posts').limit(50).get(),
    db.collection('blog_posts').limit(50).get(),
  ]);

  const series = seriesSnap.docs
    .map((d) => d.data())
    .filter((s) => String((s as any).title || '').toLowerCase().includes(q))
    .slice(0, 10);
  const posts = commSnap.docs
    .map((d) => d.data())
    .filter((p) =>
      String((p as any).title || '').toLowerCase().includes(q) ||
      String((p as any).content || '').toLowerCase().includes(q)
    )
    .slice(0, 10);
  const blog = blogSnap.docs
    .map((d) => d.data())
    .filter((b) =>
      String((b as any).title || '').toLowerCase().includes(q) ||
      String((b as any).content || '').toLowerCase().includes(q)
    )
    .slice(0, 10);

  res.json({ series, posts, blog });
});

export default router;

