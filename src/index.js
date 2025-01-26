import connectDb from "./db/index.js";
import app from "./app.js"; 
import { logger } from "./middlewares/winston.js";
import envConfig from "./env.config.js";
import os from 'os';

connectDb()
.then(() => {
    app.listen( envConfig.PORT, envConfig.HOST, () => {
        logger.info(`[${os.hostname}] Server is running on http://${envConfig.HOST}:${envConfig.PORT}/api/v1/`)
    })
})
.catch((error) => {
    logger.error("error",error);
})
