import verifyJwt from "./auth.middleware.js";
import { errorHandler } from "./error.middleware.js";
import { upload } from "./multer.middleware.js";
import { validateObjectId } from "./validateObjectId.middleware.js";
import { logger, requestLogger } from "./winston.js";


const sharedMiddlewares = {
    verifyJwt,
    errorHandler,
    upload,
    validateObjectId, 
};

export default sharedMiddlewares;

export { logger, requestLogger };