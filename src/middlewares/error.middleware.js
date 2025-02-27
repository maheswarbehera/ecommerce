import envConfig from '../env.config.js'; 
import sharedUtils from '../utils/index.js';
import { logger } from '../middlewares/index.js';
import os from 'os';

const { ApiError } = sharedUtils;

const errorHandler = (err, req, res, next) => {
  // Default error properties
  const statusCode = err.statusCode || 500; 
  const message =  err.message || 'Internal Server Error'; 
  const status = err.status || false; 
  const stack = err.stack || undefined; 
  const name = err.name || 'Error';

  // In development mode, log the stack trace for debugging
  if (envConfig.NODE_ENV === 'development') {
    logger.error(`[${os.hostname}] [${statusCode}] ${req.method} ${req.originalUrl} - ${stack}`);
  }else{
    logger.error(`[${os.hostname}] [${statusCode}] ${req.method} ${req.originalUrl} - ${message}`); 
  }

  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    return res.status(statusCode).json({
      status: status,
      statusCode: statusCode,
      message: message,
      name: name,
      ...(envConfig.NODE_ENV === 'development' && { stack }),
    });
  }

  // Respond to the client with an error message
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    name,
    ...(envConfig.NODE_ENV === 'development' && { stack }), // Include stack trace in development
  });
};

export { errorHandler };
