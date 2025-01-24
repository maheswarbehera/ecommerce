import { logger } from "./winston.js";
import os from 'os';

const verifyRoute = (req, res, next) => {
    next(); // Proceed to the next middleware/route
    if (req.route) {
        logger.info(`[${os.hostname}] Matched Route: [${req.route.path}] | HTTP Method: [${req.method}]`);
    } else {
        logger.warn(`[${os.hostname}] No route matched for: ${req.originalUrl}`);
        res.status(404).json({status: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
    }
};

export { verifyRoute };