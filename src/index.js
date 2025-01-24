import connectDb from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";
import { logger } from "./middlewares/winston.js";

dotenv.config({path: './.env'});

connectDb()
.then(() => {
    app.listen(process.env.PORT || 5500, () => {
        logger.info(`Server is running on http://localhost:${process.env.PORT}/api/v1/`)
    })
})
.catch((error) => {
    logger.error("error",error);
})
