import winston from 'winston';
import os from 'os';

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
      new winston.transports.File({ filename: 'logs/server.log' }) // Log to a file
    ]
  });

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // After the response is finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`[${os.hostname}] [${res.statusCode}] ${req.method} | ${req.originalUrl} - ${duration}ms | ${req.headers['user-agent']}`); 
  });
  res.on('error', () => {
    const duration = Date.now() - startTime;
    logger.error(`[${os.hostname}] [${res.statusCode}] ${req.method} | ${req.originalUrl} - ${duration}ms | ${req.headers['user-agent']}`); 
  });

  next(); // Pass control to the next middleware
};

export  {logger, requestLogger};