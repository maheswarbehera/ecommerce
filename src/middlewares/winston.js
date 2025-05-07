import winston from 'winston';
import os from 'os';
import envConfig from '../env.config.js';
import fs from 'fs'

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }) 
};

const createLogger = (level, filename, includeConsole = true) => {
  return winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${formatTimestamp(timestamp)}] ${level.toUpperCase()}: ${typeof message === 'object' ? JSON.stringify(message) : message}`;
      })
    ),
    transports: [
      ...(includeConsole ? [new winston.transports.Console()] : []),
      new winston.transports.File({ filename }),
    ]

  });
}

// Filenames based on environment
const env = envConfig.NODE_ENV || 'development';
const filePrefix = `${logDir}/${env}`;

// Logger instances
const logger = createLogger('info', `${filePrefix}.server.log`);
const auditLogger = createLogger('info', `${filePrefix}.audit.log`);
const errorLogger = createLogger('error', `${filePrefix}.error.log`);

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const userAgentInfo  = req.useragent; 
  // Check if device is mobile, tablet, or desktop
  const deviceType =  userAgentInfo.isMobile ? 'Mobile' : userAgentInfo.isTablet ? 'Tablet' : 'Desktop';

  const logResponse = (level = 'info') => {
    const duration = Date.now() - start;
    const logMessage = `[${os.hostname}] [${res.statusCode}] ${req.method} | ${req.originalUrl} - ${duration}ms | ${userAgentInfo.platform} | ${userAgentInfo.browser}/${userAgentInfo.version} | ${deviceType}`;
    logger[level](logMessage);
  }

  // After the response is finished
  res.on('finish', () => logResponse('info'));
  res.on('error', () => logResponse('error'));

  next(); // Pass control to the next middleware
};

export  {logger, errorLogger, auditLogger, requestLogger};