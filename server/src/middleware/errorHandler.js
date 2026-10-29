import { errorResponse } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Endpoint ${req.method} ${req.originalUrl} not found`, 404);
};

export const globalErrorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const message = err.message || 'Internal server error';
  const statusCode = err.statusCode || 500;
  return errorResponse(res, message, statusCode, process.env.NODE_ENV === 'development' ? { stack: err.stack } : null);
};
