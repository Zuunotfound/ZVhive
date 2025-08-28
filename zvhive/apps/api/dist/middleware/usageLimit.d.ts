import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth';
export declare function enforceMonthlyApiQuota(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export declare function enforceBugReportLimit(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=usageLimit.d.ts.map