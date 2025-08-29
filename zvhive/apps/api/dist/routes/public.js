import { Router } from 'express';
const router = Router();
router.get('/status', (_req, res) => {
    res.json({ name: 'ZVHive API', version: '0.1.0' });
});
export default router;
//# sourceMappingURL=public.js.map