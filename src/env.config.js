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
    CLOUDINARY_API_SECRET_KEY : process.env.CLOUDINARY_API_SECRET_KEY
}

export default envConfig;