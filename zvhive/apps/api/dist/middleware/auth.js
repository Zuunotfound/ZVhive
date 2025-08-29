import { getAuth } from '../lib/firebaseAdmin';
export async function authenticateFirebaseToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.substring('Bearer '.length)
            : undefined;
        if (!token) {
            return res.status(401).json({ error: 'Missing Bearer token' });
        }
        const decoded = await getAuth().verifyIdToken(token);
        req.user = {
            uid: decoded.uid,
            email: decoded.email ?? undefined,
            role: decoded.role ?? undefined,
            claims: decoded ?? undefined,
        };
        return next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
//# sourceMappingURL=auth.js.map