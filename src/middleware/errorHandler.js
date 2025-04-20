/**
 * Express.js error handling middleware
 */

// Custom error class for API errors
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found error handler
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Resource not found: ${req.originalUrl}`);
  next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log the error (in production, you might want to use a proper logger)
  console.error(`[ERROR] ${statusCode} - ${message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    details: err.details || undefined,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
};