import { ApiError } from '../utils/ApiError.js';
import { logger } from './winston.js';
import os from 'os';

const errorHandler = (err, req, res, next) => {
  // Default error properties
  const statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
  const message =  err.message || 'Internal Server Error'; // Default to 'Internal Server Error'

  // In development mode, log the stack trace for debugging
  if (process.env.NODE_ENV === 'development') {
    logger.error(err.stack);
  }else{
    logger.error(`[${os.hostname}] [${statusCode}] ${req.method} ${req.originalUrl} - ${message}`); 
  }

  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    return res.status(statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Respond to the client with an error message
  res.status(statusCode).json({
    status: false,
    statusCode,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in development
  });
};

export { errorHandler };
