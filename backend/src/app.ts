import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { router } from './routes/index.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

app.use((req, _res, next) => {
  req.headers['x-request-id'] = crypto.randomUUID();
  next();
});

app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
