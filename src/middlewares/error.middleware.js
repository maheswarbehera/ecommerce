import envConfig from '../env.config.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from './winston.js';
import os from 'os';

const errorHandler = (err, req, res, next) => {
  // Default error properties
  const statusCode = err.statusCode || 500; 
  const message =  err.message || 'Internal Server Error'; 
  const status = err.status || false; 
  const stack = err.stack || undefined; 

  // In development mode, log the stack trace for debugging
  if (envConfig.NODE_ENV === 'development') {
    logger.error(stack);
  }else{
    logger.error(`[${os.hostname}] [${statusCode}] ${req.method} ${req.originalUrl} - ${message}`); 
  }

  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    return res.status(statusCode).json({
      status: status,
      statusCode: statusCode,
      message: message,
      ...(envConfig.NODE_ENV === 'development' && { stack }),
    });
  }

  // Respond to the client with an error message
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack }), // Include stack trace in development
  });
};

export { errorHandler };
