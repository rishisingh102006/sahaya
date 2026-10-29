import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';
import { systemController } from './controllers/systemController.js';

const app = express();

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: true, // Allow frontend during development
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Root & direct health endpoint
app.get('/health', systemController.health);
app.get('/', (req, res) => {
  res.json({
    name: 'SAHAYA Backend API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Mount all API endpoints
app.use('/api', apiRouter);

// 404 & Global Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
