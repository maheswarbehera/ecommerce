import dotenv from 'dotenv';

dotenv.config({path: `./.env.${process.env.NODE_ENV}`});

const envConfig = {
    NODE_ENV : process.env.NODE_ENV || 'development',
    PORT : process.env.PORT || 5000,
    HOST : process.env.HOST || 'localhost',
    CORS_ORIGIN : process.env.CORS_ORIGIN,
    ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY : process.env.ACCESS_TOKEN_EXPIRY,
    DB_NAME : process.env.DB_NAME,
    MONGO_DB_URI : process.env.MONGO_DB_URI,

    CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET_KEY : process.env.CLOUDINARY_API_SECRET_KEY,

    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MESSAGE: process.env.RATE_LIMIT_MESSAGE,
    RATE_LIMIT_STATUS_CODE: process.env.RATE_LIMIT_STATUS_CODE,
    RATE_LIMIT_HEADERS: process.env.RATE_LIMIT_HEADERS,

}

export default envConfig;