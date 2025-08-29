import type { Request, Response, NextFunction } from 'express';
import { getAuth } from '../lib/firebaseAdmin';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string | undefined;
    role?: string | undefined;
    claims?: Record<string, unknown> | undefined;
  };
}

export async function authenticateFirebaseToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
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
      role: (decoded as any).role ?? undefined,
      claims: decoded ?? undefined,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

