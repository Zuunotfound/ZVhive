import { createApp } from '../src/app';
import serverlessHttp from 'serverless-http';
const app = createApp();
const handler = serverlessHttp(app);
export default async function (req, res) {
    return handler(req, res);
}
//# sourceMappingURL=vercel.js.map