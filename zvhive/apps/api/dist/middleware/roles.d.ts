import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth';
export declare function ensureAccount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export declare function requireRole(minRole: 'user' | 'verified' | 'admin'): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=roles.d.ts.map