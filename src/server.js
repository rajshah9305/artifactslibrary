/**
 * Basic Express.js server template
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import config from './utils/config.js';
import Logger from './utils/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import RateLimiter from './middleware/rateLimiter.js';

// Initialize logger
const logger = new Logger({
  level: config.get('logging.level', 'info'),
  prefix: 'server'
});

// Create Express app
const app = express();

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.get('security.corsOrigins', '*'),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Apply rate limiting if enabled
if (config.get('api.rateLimiting.enabled', false)) {
  const rateLimiter = new RateLimiter({
    windowMs: config.get('api.rateLimiting.timeWindow', 60000),
    max: config.get('api.rateLimiting.maxRequests', 100)
  });
  app.use(rateLimiter.middleware());
}

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes would be mounted here
// app.use('/api/v1', apiRoutes);

// Handle 404 errors
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = config.get('server.port', 3000);
const HOST = config.get('server.host', 'localhost');

const server = app.listen(PORT, HOST, () => {
  logger.info(`Server running at http://${HOST}:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default server;