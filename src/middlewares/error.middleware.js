import envConfig from '../env.config.js'; 
import sharedUtils from '../utils/index.js';
import { logger } from '../middlewares/index.js';
import os from 'os';

const { ApiError } = sharedUtils;

const errorHandler = (err, req, res, next) => {
  // Default error properties
  let statusCode = err.statusCode || 500; 
  let message =  err.message || 'Something went wrong. Please try again later.'; 
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
      ...(envConfig.NODE_ENV === 'development' && { name, stack }),
    });
  }
  
  // MongoServerError: E11000 duplicate key error collection
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateFields = err.keyValue ? Object.entries(err.keyValue).map(([key, value]) => `${key}: ${value}`) : []; 
    return res.status(statusCode).json({
      status,
      statusCode,
      message: `Duplicate entry: ${duplicateFields.join(", ")} already exists.`,       
      ...(envConfig.NODE_ENV === 'development' && {name, stack }),
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    return res.status(statusCode).json({
      status,
      statusCode,
      message: Object.values(err.errors).map((val) => val.message),
      ...(envConfig.NODE_ENV === 'development' && {name, stack }),
    });
  }
  
  // Handle invalid MongoDB ObjectId errors
  if (err.name === "CastError") {
    statusCode = 400
    return res.status(statusCode).json({
      status,
      statusCode,
      message: `Invalid ${err.path}: ${err.value}`, 
      ...(envConfig.NODE_ENV === "development" && { name, stack }),
    });
  } 

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    return res.status(statusCode).json({ 
      status, 
      statusCode,
      message: "Access token has expired",  name,
      ...(envConfig.NODE_ENV === "development" && { name, stack }),
    });
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    return res.status(statusCode).json({ 
      status,
      statusCode,
      message: "Invalid access token", 
      ...(envConfig.NODE_ENV === "development" && { name, stack }),
    });
  }
  // Respond to the client with an error message
  res.status(statusCode).json({
    status,
    statusCode,
    message, 
    ...(envConfig.NODE_ENV === 'development' && { name, stack }), // Include stack trace in development
  });
};

export { errorHandler };
