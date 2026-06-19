import cors from 'cors';
import express from 'express';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'presvila-backend', timestamp: new Date().toISOString() });
});

app.use('/api', contactRoutes);
app.use(errorHandler);

export default app;
