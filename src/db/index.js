import mongoose from "mongoose"; 
import { logger } from "../middlewares/winston.js";
import envConfig from "../env.config.js";

const connectDb = async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`${envConfig.MONGO_DB_URI}/${envConfig.DB_NAME}`);
        if(connectionInstance.connection.host == 'localhost'){
            logger.warn(`${envConfig.NODE_ENV} Environment `);
            logger.info(`⚙️  MongoDB connected local server !! DB HOST: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`);
        }else{
            logger.warn(`${envConfig.NODE_ENV} Environment `);
            logger.info(`⚙️  MongoDB connected atlas server !! DB HOST: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`); 
        } 
    } catch (error) {
        logger.error("MONGODB connection FAILED ", error);
        process.exit(1);
        
    }
}

export default connectDb;