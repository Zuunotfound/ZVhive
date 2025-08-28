import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import publicRouter from './routes/public';
import secureRouter from './routes/secure';
import paymentsRouter from './routes/payments';
import accountRouter from './routes/account';
import adminRouter from './routes/admin';
import plansRouter from './routes/plans';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'zvhive-api' });
});

app.use('/api', publicRouter);
app.use('/api', secureRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/account', accountRouter);
app.use('/api/admin', adminRouter);
app.use('/api/plans', plansRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('API listening on :' + port);
});
