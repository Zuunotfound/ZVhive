import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import publicRouter from './routes/public';
import secureRouter from './routes/secure';
import paymentsRouter from './routes/payments';

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

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('API listening on :' + port);
});
