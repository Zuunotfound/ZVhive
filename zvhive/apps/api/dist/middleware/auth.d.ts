import type { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string | undefined;
        role?: string | undefined;
        claims?: Record<string, unknown> | undefined;
    };
}
export declare function authenticateFirebaseToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.d.ts.map