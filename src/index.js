import connectDb from "./db/index.js";
import app from "./app.js"; 
import { logger } from "./middlewares/index.js";
import envConfig from "./env.config.js";
import os from 'os';

connectDb()
.then(() => {
    const server = app.listen( envConfig.PORT, envConfig.HOST, () => {
        logger.info(`[${os.hostname}] Server is running on http://${envConfig.HOST}:${envConfig.PORT}${envConfig.BASE_URL}${envConfig.API_VERSION}`);
    })

    const gracefulShutdown = (signal) => {
        logger.info(`[${os.hostname}] ${signal} Received, server shutting down gracefully...`);
        server.close(() => {
            logger.info(`[${os.hostname}] Closed out remaining connections`);
            process.exit(0);
        });
    }

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
})
.catch((error) => {
    logger.error(" Database connection failed:",error);
    process.exit(1);
})

// Global error handling for unexpected failures
process.on("unhandledRejection", (error) => {
    logger.error(`🔥 Unhandled Rejection: ${error.message}`);
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
});
