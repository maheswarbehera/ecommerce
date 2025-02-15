import winston from 'winston';
import os from 'os';
import envConfig from '../env.config.js';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console(), // Log to the console
      ...(envConfig.NODE_ENV === 'development' ? [new winston.transports.File({ filename: 'logs/development.server.log' })] : [new winston.transports.File({ filename: 'logs/production.server.log' })]),

    ]
  });

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const userAgentInfo  = req.useragent; 
  // Check if device is mobile, tablet, or desktop
  let deviceType;

  userAgentInfo.isMobile ? deviceType = 'Mobile' : userAgentInfo.isTablet ? deviceType = 'Tablet' : deviceType = 'Desktop';
  // After the response is finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`[${os.hostname}] [${res.statusCode}] ${req.method} | ${req.originalUrl} - ${duration}ms | ${userAgentInfo.platform} | ${userAgentInfo.browser}/${userAgentInfo.version} | ${deviceType}`); 
  });
  res.on('error', () => {
    const duration = Date.now() - startTime;
    logger.error(`[${os.hostname}] [${res.statusCode}] ${req.method} | ${req.originalUrl} - ${duration}ms | ${userAgentInfo.platform} | ${userAgentInfo.browser}/${userAgentInfo.version} | ${deviceType}`); 
  });

  next(); // Pass control to the next middleware
};

export  {logger, requestLogger};