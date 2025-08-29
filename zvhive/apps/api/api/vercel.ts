import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/app';
import serverlessHttp from 'serverless-http';

const app = createApp();
const handler = serverlessHttp(app as any);

export default async function (req: VercelRequest, res: VercelResponse) {
  return handler(req as any, res as any);
}

