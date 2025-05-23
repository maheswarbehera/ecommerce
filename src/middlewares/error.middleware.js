import envConfig from '../env.config.js'; 
import sharedUtils from '../utils/index.js';
import os from 'os';
import { errorLogger } from './winston.js';
import sharedModels from '../models/index.js';

const { ApiError } = sharedUtils;

const errorHandler = (err, req, res, next) => {
  // Default error properties
  let statusCode = err.statusCode || 500; 
  let message =  err.message || 'Something went wrong. Please try again later.'; 
  const status = err.status || false; 
  const stack = err.stack || undefined; 
  const name = err.name || 'Error';
  const errCode = err.code || undefined;  

  const start = process.hrtime();
  const {Audit} = sharedModels;
  const userAgentInfo = req.useragent;
  const {platform, browser, version} = userAgentInfo
  const deviceType = userAgentInfo.isMobile ? 'Mobile' : userAgentInfo.isTablet ? 'Tablet' : 'Desktop';
  
  res.on('finish', async() => {
      const end = process.hrtime(start);
      const responseTime = (end[0] * 1e3 + end[1] / 1e6).toFixed(2);
      const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
      const { method, user, originalUrl, body, query, params, ip } = req       
      
      if(httpMethods.includes(method) && user){
          const actionType = {
              POST: 'create',
              GET: 'Read',
              PUT: 'update',
              DELETE: 'delete'
          };

          try {
              const auditLog = await Audit.create({
                  user: user._id || user,
                  os: os.hostname(),
                  httpMethod: method,
                  route: originalUrl,              
                  action: actionType[req.method],               
                  reqBody: body || {},                
                  reqQuery: query || {},                
                  reqParams: params || {},
                  ip: ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                  device: deviceType,
                  platform: platform,
                  browser: `${browser}/${version}`,
                  statusCode: statusCode,
                  responseTime: `${responseTime}ms`,
                  errorDetails: err
              })
              errorLogger.error(`Audit error log saved: ${JSON.stringify(auditLog)}`);
          } catch (err) {
              errorLogger.error('Audit log error:', err.message);
          }
      }
  });

  // In development mode, log the stack trace for debugging
  const isDevelopment = envConfig.NODE_ENV === 'development';
  const log = `[${os.hostname}] [${statusCode}] | ${req.method} | ${req.originalUrl} - ${name} | ${message}`

  errorLogger.error( isDevelopment && stack ? `${log} | ${stack}` : log);
 
  const errorResponse = (statusCode, message) => {
    const response = {
      status,
      statusCode,
      message,
    };
    if (isDevelopment) {
      response.name = name;
      response.errCode = errCode;
      response.stack = stack;
    }
    return res.status(statusCode).json(response);
  }

  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) return errorResponse(statusCode, message);
    // return res.status(statusCode).json({
    //   status, 
    //   statusCode,
    //   message,
    //   ...(envConfig.NODE_ENV === 'development' && { name, stack }),
    // });

  
  // MongoServerError: E11000 duplicate key error collection
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateFields = err.keyValue ? Object.entries(err.keyValue).map(([key, value]) => `${key}: ${value}`) : []; 
    message = `Duplicate entry: ${duplicateFields.join(", ")} already exists.`;
    return errorResponse(statusCode, message);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
    return errorResponse(statusCode, message);
  }
  
  // Handle invalid MongoDB ObjectId errors
  if (err.name === "CastError") return errorResponse(400, `Invalid ${err.path}: ${err.value}`);
    
  // JWT errors
  if (err.name === 'TokenExpiredError') return errorResponse(401, 'Access token has expired');
  if (err.name === 'JsonWebTokenError') return errorResponse(401, 'Invalid access token');
  if (err.name === 'NotBeforeError') return errorResponse(401, 'Access token not active yet');

  // System (Errno) Errors
  const systemErrors = {
    ENOENT: [404, 'File or resource not found.'],
    EACCES: [403, 'Permission denied.'],
    ECONNREFUSED: [503, 'Connection refused.'],
    ETIMEDOUT: [504, 'Request timed out.'],
    ECONNRESET: [502, 'Connection was reset.'],
  };
  if (err.code && systemErrors[err.code]) {
    const [code, msg] = systemErrors[err.code];
    return errorResponse(code, `${msg} (${err.code})`);
  }

  // Built-in JS error types
  const jsErrorTypes = [
    'SyntaxError',
    'ReferenceError',
    'TypeError',
    'RangeError',
    'URIError',
    'EvalError',
    'AggregateError',
  ];

  if (jsErrorTypes.includes(name)) return errorResponse(500, `Unexpected ${name}: ${message}`);

  // Axios/Fetch style errors
  if (err.isAxiosError || err.message?.includes('fetch') || err.message?.includes('network')) return errorResponse(502, `External API/network request failed: ${message}`);

  // Default fallback Respond to the client with an error message
  return errorResponse(statusCode, message);
};

export { errorHandler };
