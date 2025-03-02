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
    logger.error(`[${os.hostname}] [${statusCode}] | ${req.method} | ${req.originalUrl} - ${name} | ${message} | ${stack}`);
  }else{
    logger.error(`[${os.hostname}] [${statusCode}] | ${req.method} | ${req.originalUrl} - ${name} | ${message}`); 
  }

  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    return res.status(statusCode).json({
      status,
      statusCode,
      message,
      name,
      ...(envConfig.NODE_ENV === 'development' && { stack }),
    });
  }
  
  // MongoServerError: E11000 duplicate key error collection
  if (err.code === 11000) {
    const duplicateFields = err.keyValue ? Object.entries(err.keyValue).map(([key, value]) => `${key}: ${value}`) : []; 
    return res.status(statusCode).json({
      status,
      statusCode,
      message: `Duplicate entry: ${duplicateFields.join(", ")} already exists.`, 
      name,
      ...(envConfig.NODE_ENV === 'development' && { stack }),
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status,
      statusCode: 400,
      message: Object.values(err.errors).map((val) => val.message),
      name,
      ...(envConfig.NODE_ENV === 'development' && { stack }),
    });
  }
  
  // Handle invalid MongoDB ObjectId errors
  if (err.name === "CastError") {
    return res.status(400).json({
      status,
      statusCode: 400,
      message: `Invalid ${err.path}: ${err.value}`, 
      name,
      ...(envConfig.NODE_ENV === "development" && { stack: err.stack }),
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
